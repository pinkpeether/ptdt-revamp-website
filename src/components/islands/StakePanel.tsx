import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { parseUnits } from "viem";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { wagmiConfig } from "@lib/wagmi";
import { ERC20_ABI, STAKING_ABI, PTDT_TOKEN, STAKING_ADDR } from "@lib/contracts";
import { TIER_CONFIGS, type StakingTier } from "@types/index";
import { formatPTDT, cn } from "@lib/utils";
import WalletConnect from "./WalletConnect";

const TIER_DISPLAY = {
  bronze: { color: "#cd7f32", gradient: "from-[#cd7f32]/20 to-[#e8a87c]/10", border: "border-[#cd7f32]/30" },
  silver: { color: "#94a3b8", gradient: "from-[#94a3b8]/20 to-[#cbd5e1]/10", border: "border-[#94a3b8]/30" },
  gold:   { color: "#fb0b8c", gradient: "from-pink-DEFAULT/20 to-[#ff4bad]/10", border: "border-pink-line" },
};

function StakeForm() {
  const { address, isConnected }  = useAccount();
  const [tier, setTier]           = useState<StakingTier>("bronze");
  const [amount, setAmount]       = useState("");
  const [txError, setTxError]     = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState(false);

  const tierCfg = TIER_CONFIGS.find(t => t.id === tier)!;

  // Read PTDT balance
  const { data: rawBalance, refetch: refetchBalance } = useReadContract({
    abi: ERC20_ABI, address: PTDT_TOKEN,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const balance = rawBalance ? formatPTDT(rawBalance as bigint) : "—";

  // Write staking call
  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();

  // Wait for confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setTxSuccess(true);
      setAmount("");
      refetchBalance();
      setTimeout(() => setTxSuccess(false), 8000);
    }
  }, [isConfirmed, refetchBalance]);

  useEffect(() => {
    if (writeError) setTxError(writeError.message.slice(0, 140));
  }, [writeError]);

  function handleStake(e: React.FormEvent) {
    e.preventDefault();
    setTxError(null);
    setTxSuccess(false);
    const val = parseFloat(amount);
    if (!val || val < tierCfg.minStake) {
      setTxError(`Minimum stake for ${tierCfg.label} tier is ${tierCfg.minStake} PTDT.`);
      return;
    }
    const tierIndex: Record<StakingTier, number> = { bronze: 0, silver: 1, gold: 2 };
    writeContract({
      abi: STAKING_ABI, address: STAKING_ADDR,
      functionName: "stake",
      args: [parseUnits(amount, 18), tierIndex[tier]],
    });
  }

  if (!isConnected) {
    return (
      <div className="stake-connect-prompt">
        <div className="stake-prompt-icon"><Lock size={28} /></div>
        <h3>Connect your wallet</h3>
        <p>Connect a BSC-compatible wallet to stake PTDT and earn protocol rewards.</p>
        <WalletConnect />
      </div>
    );
  }

  return (
    <div className="stake-panel">
      {/* Balance */}
      <div className="stake-balance">
        <span className="stake-balance-label">Your PTDT balance</span>
        <span className="stake-balance-val">{balance} <span>PTDT</span></span>
      </div>

      {/* Tier selector */}
      <div className="stake-tiers">
        {TIER_CONFIGS.map(t => {
          const td = TIER_DISPLAY[t.id];
          return (
            <button
              key={t.id}
              className={cn("stake-tier-btn", tier === t.id && "is-active", td.border)}
              style={{ "--tc": td.color } as React.CSSProperties}
              onClick={() => setTier(t.id)}
            >
              <span className="stb-badge">{t.label}</span>
              <span className="stb-apy">{t.apy}%</span>
              <span className="stb-sub">APY</span>
              <div className="stb-meta">
                <span>Min {t.minStake} PTDT</span>
                <span>{t.lockDays}d lock</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleStake} className="stake-form">
        <div className="stake-input-wrap">
          <label htmlFor="stake-amount">Amount to stake</label>
          <div className="stake-input-row">
            <input
              id="stake-amount"
              type="number"
              min={tierCfg.minStake}
              step="any"
              placeholder={`Min ${tierCfg.minStake} PTDT`}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
            <span className="stake-token-label">PTDT</span>
            <button
              type="button"
              className="stake-max-btn"
              onClick={() => rawBalance && setAmount(formatPTDT(rawBalance as bigint).replace(/,/g, ""))}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Projection */}
        {amount && !isNaN(parseFloat(amount)) && (
          <motion.div
            className="stake-projection"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          >
            <TrendingUp size={14} />
            <span>
              Estimated reward after {tierCfg.lockDays} days:{" "}
              <strong>
                {((parseFloat(amount) * tierCfg.apy / 100) * (tierCfg.lockDays / 365)).toFixed(2)} PTDT
              </strong>
            </span>
          </motion.div>
        )}

        {/* Errors / success */}
        <AnimatePresence>
          {txError && (
            <motion.div className="stake-alert error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AlertTriangle size={14} />
              {txError}
            </motion.div>
          )}
          {txSuccess && (
            <motion.div className="stake-alert success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Zap size={14} />
              Staking confirmed on BSC! Your position is active.
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="stake-submit"
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? (
            <span className="stake-spinner" />
          ) : (
            <>
              <Lock size={15} />
              Stake {tierCfg.label} · {tierCfg.apy}% APY
            </>
          )}
        </button>

        <p className="stake-disclaimer">
          Funds are locked for {tierCfg.lockDays} days. Staking operates on BNB Chain.
          Protocol fees: 60% burned / 40% to stakers.
        </p>
      </form>

      <style>{`
        .stake-connect-prompt {
          text-align: center; padding: 48px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .stake-prompt-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(251,11,140,0.1);
          border: 1px solid rgba(251,11,140,0.2);
          display: grid; place-items: center; color: #fb0b8c;
        }
        .stake-connect-prompt h3 { font-size: 20px; font-weight: 900; color: #fff; }
        .stake-connect-prompt p { font-size: 14px; color: rgba(255,255,255,0.5); max-width: 280px; }
        .stake-panel { display: flex; flex-direction: column; gap: 20px; padding: 24px; }
        .stake-balance {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .stake-balance-label { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 600; }
        .stake-balance-val { font-size: 20px; font-weight: 900; color: #fff; letter-spacing: -0.03em; }
        .stake-balance-val span { font-size: 13px; color: #2ae97b; font-weight: 700; margin-left: 4px; }
        .stake-tiers { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        .stake-tier-btn {
          border-radius: 14px; padding: 16px 12px; text-align: center;
          background: rgba(255,255,255,0.05); border: 1.5px solid transparent;
          cursor: pointer; transition: border-color 0.2s, background 0.2s, transform 0.2s;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .stake-tier-btn:hover { transform: translateY(-2px); background: rgba(255,255,255,0.09); }
        .stake-tier-btn.is-active {
          border-color: var(--tc); background: rgba(255,255,255,0.1);
          box-shadow: 0 0 20px color-mix(in srgb, var(--tc) 30%, transparent);
        }
        .stb-badge {
          font-size: 10px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--tc);
          font-family: "IBM Plex Mono", monospace;
        }
        .stb-apy { font-size: 30px; font-weight: 900; color: var(--tc); letter-spacing: -0.05em; line-height: 1.1; }
        .stb-sub { font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 600; }
        .stb-meta { margin-top: 6px; display: flex; flex-direction: column; gap: 2px;
          font-size: 10px; color: rgba(255,255,255,0.35); font-family: "IBM Plex Mono", monospace; }
        .stake-form { display: flex; flex-direction: column; gap: 12px; }
        .stake-input-wrap label {
          display: block; font-size: 12px; font-weight: 700;
          color: rgba(255,255,255,0.55); margin-bottom: 6px;
        }
        .stake-input-row {
          display: flex; align-items: center; gap: 0;
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 10px; background: rgba(255,255,255,0.06);
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .stake-input-row:focus-within { border-color: #fb0b8c; }
        .stake-input-row input {
          flex: 1; padding: 12px 14px; border: 0; background: transparent;
          font-size: 16px; font-weight: 700; color: #fff; outline: none;
          font-family: "IBM Plex Mono", monospace;
        }
        .stake-input-row input::placeholder { color: rgba(255,255,255,0.2); }
        .stake-token-label {
          font-size: 13px; font-weight: 800; color: #2ae97b;
          padding: 0 10px; flex-shrink: 0;
          font-family: "IBM Plex Mono", monospace;
        }
        .stake-max-btn {
          padding: 8px 12px; margin: 6px 6px 6px 0;
          border-radius: 6px; font-size: 11px; font-weight: 900;
          background: rgba(251,11,140,0.2); color: #fb0b8c;
          font-family: "IBM Plex Mono", monospace;
          transition: background 0.2s;
        }
        .stake-max-btn:hover { background: rgba(251,11,140,0.35); }
        .stake-projection {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; border-radius: 8px;
          background: rgba(42,233,123,0.08);
          border: 1px solid rgba(42,233,123,0.18);
          font-size: 13px; color: rgba(255,255,255,0.6);
        }
        .stake-projection strong { color: #2ae97b; }
        .stake-alert {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 10px 14px; border-radius: 8px; font-size: 13px; line-height: 1.5;
        }
        .stake-alert.error { background: rgba(251,11,140,0.1); color: #ff67b7; border: 1px solid rgba(251,11,140,0.22); }
        .stake-alert.success { background: rgba(42,233,123,0.1); color: #2ae97b; border: 1px solid rgba(42,233,123,0.22); }
        .stake-submit {
          min-height: 50px; border-radius: 999px; font-size: 15px; font-weight: 900;
          color: #fff;
          background: linear-gradient(135deg, #fb0b8c, #ff4bad);
          box-shadow: 0 12px 28px rgba(251,11,140,0.28);
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .stake-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 18px 38px rgba(251,11,140,0.38); }
        .stake-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .stake-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .stake-disclaimer {
          font-size: 11px; color: rgba(255,255,255,0.25);
          text-align: center; line-height: 1.6;
          font-family: "IBM Plex Mono", monospace;
        }
      `}</style>
    </div>
  );
}

export default function StakePanel() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={new QueryClient()}>
        <StakeForm />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
