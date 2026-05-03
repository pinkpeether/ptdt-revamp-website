import { useState } from "react";
import { useConnect, useDisconnect, useAccount, useChainId, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, LogOut, ChevronDown, AlertTriangle } from "lucide-react";
import { wagmiConfig } from "@lib/wagmi";
import { shortenAddress } from "@lib/utils";

const queryClient = new QueryClient();

function WalletButton() {
  const { address, isConnected }    = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect }              = useDisconnect();
  const chainId                     = useChainId();
  const { switchChain }             = useSwitchChain();
  const [showMenu, setShowMenu]     = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);

  const wrongChain = isConnected && chainId !== bsc.id;

  if (isConnected && address) {
    return (
      <div style={{ position: "relative" }}>
        {wrongChain && (
          <button
            className="wc-btn wc-warn"
            onClick={() => switchChain({ chainId: bsc.id })}
          >
            <AlertTriangle size={14} />
            Switch to BSC
          </button>
        )}
        {!wrongChain && (
          <button
            className="wc-btn wc-connected"
            onClick={() => setShowMenu(p => !p)}
          >
            <span className="wc-dot" />
            {shortenAddress(address)}
            <ChevronDown size={13} />
          </button>
        )}

        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="wc-menu"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="wc-menu-addr">{address}</div>
              <div className="wc-menu-chain">
                <span className="wc-dot" />BNB Smart Chain
              </div>
              <button
                className="wc-menu-item danger"
                onClick={() => { disconnect(); setShowMenu(false); }}
              >
                <LogOut size={14} />
                Disconnect wallet
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Not connected
  return (
    <div style={{ position: "relative" }}>
      <button
        className="wc-btn wc-idle"
        onClick={() => setShowConnectors(p => !p)}
        disabled={isPending}
      >
        {isPending ? (
          <span className="wc-spinner" />
        ) : (
          <>
            <Wallet size={15} />
            Connect Wallet
          </>
        )}
      </button>

      <AnimatePresence>
        {showConnectors && (
          <motion.div
            className="wc-menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="wc-menu-label">Choose wallet</p>
            {connectors.map(connector => (
              <button
                key={connector.uid}
                className="wc-menu-item"
                onClick={() => {
                  connect({ connector, chainId: bsc.id });
                  setShowConnectors(false);
                }}
              >
                {connector.name === "Injected" ? "MetaMask / Browser Wallet" : connector.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .wc-btn {
          display: inline-flex; align-items: center; gap: 7px;
          min-height: 38px; padding: 0 16px; border-radius: 999px;
          font-size: 13px; font-weight: 800; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 0;
        }
        .wc-btn:hover { transform: translateY(-1px); }
        .wc-idle {
          background: linear-gradient(135deg, #fb0b8c, #ff4bad);
          color: #fff;
          box-shadow: 0 10px 22px rgba(251,11,140,0.22);
        }
        .wc-idle:disabled { opacity: 0.65; cursor: not-allowed; }
        .wc-connected {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          color: #fff;
        }
        .wc-warn {
          background: rgba(240,185,11,0.15);
          border: 1px solid rgba(240,185,11,0.35);
          color: #f0b90b;
        }
        .wc-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #00a747; flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(0,167,71,0.25);
          animation: wc-pulse 2s ease-in-out infinite;
        }
        @keyframes wc-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.6; transform:scale(1.25); }
        }
        .wc-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: wc-spin 0.6s linear infinite;
        }
        @keyframes wc-spin { to { transform: rotate(360deg); } }
        .wc-menu {
          position: absolute; top: calc(100% + 10px); right: 0;
          min-width: 220px; z-index: 200;
          background: #fff; border-radius: 14px;
          border: 1px solid rgba(16,16,24,0.08);
          box-shadow: 0 18px 50px rgba(16,16,24,0.16);
          padding: 8px;
          overflow: hidden;
        }
        .wc-menu-label {
          font-size: 11px; font-weight: 700; color: #958da4;
          padding: 6px 10px 4px; letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .wc-menu-addr {
          font-family: "IBM Plex Mono", monospace;
          font-size: 10px; color: #706a7d;
          padding: 8px 10px; word-break: break-all;
          border-bottom: 1px solid rgba(16,16,24,0.06);
          margin-bottom: 4px;
        }
        .wc-menu-chain {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 700; color: #00a747;
          padding: 6px 10px;
          border-bottom: 1px solid rgba(16,16,24,0.06);
          margin-bottom: 4px;
        }
        .wc-menu-item {
          display: flex; align-items: center; gap: 9px; width: 100%;
          padding: 10px 10px; border-radius: 9px;
          font-size: 13px; font-weight: 700; color: #1b1723;
          transition: background 0.18s, color 0.18s;
          text-align: left;
        }
        .wc-menu-item:hover { background: #f6f4f8; }
        .wc-menu-item.danger { color: #e0087d; }
        .wc-menu-item.danger:hover { background: #fff0f8; }
      `}</style>
    </div>
  );
}

// Wrap with providers — Astro islands need self-contained providers
export default function WalletConnect() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletButton />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
