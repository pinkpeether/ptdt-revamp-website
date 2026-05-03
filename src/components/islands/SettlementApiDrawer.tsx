import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Code2, Zap, Shield, Copy, Check } from "lucide-react";

interface Endpoint {
  method: "GET" | "POST" | "PUT";
  path: string;
  label: string;
  desc: string;
  payload?: string;
  response?: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/v1/settlement/initiate",
    label: "Initiate Settlement",
    desc: "Submit a ride fare for on-chain settlement routing.",
    payload: `{
  "ride_id": "RD-2024-xxxxxx",
  "fare_amount": "12.50",
  "currency": "USDT",
  "driver_wallet": "0x...",
  "rider_wallet": "0x...",
  "platform_id": "your_platform_id"
}`,
    response: `{
  "status": "pending",
  "settlement_id": "STL-xxxxxx",
  "tx_hash": null,
  "estimated_ms": 3200,
  "protocol_fee": "0.125",
  "fee_split": { "burn": "0.075", "stakers": "0.050" }
}`,
  },
  {
    method: "GET",
    path: "/v1/settlement/:id",
    label: "Get Settlement",
    desc: "Fetch the status and receipt of a settlement by ID.",
    response: `{
  "settlement_id": "STL-xxxxxx",
  "status": "confirmed",
  "tx_hash": "0x...",
  "block": 38821440,
  "confirmed_at": "2025-11-01T12:04:33Z",
  "fare_amount": "12.50",
  "protocol_fee": "0.125",
  "receipt_url": "https://ptdt.taxi/receipt/STL-xxxxxx"
}`,
  },
  {
    method: "GET",
    path: "/v1/settlement/history",
    label: "Settlement History",
    desc: "Paginated list of settlements for your platform.",
    response: `{
  "data": [...],
  "total": 4820,
  "page": 1,
  "per_page": 20
}`,
  },
  {
    method: "POST",
    path: "/v1/settlement/webhook",
    label: "Register Webhook",
    desc: "Subscribe to real-time settlement status events.",
    payload: `{
  "url": "https://yourapp.com/webhooks/ptdt",
  "events": ["settlement.confirmed", "settlement.failed"],
  "secret": "your_signing_secret"
}`,
  },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="code-block">
      <button className="copy-btn" onClick={copy} aria-label="Copy code">
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre><code>{code.trim()}</code></pre>
    </div>
  );
}

function EndpointRow({ ep, active, onToggle }: {
  ep: Endpoint; active: boolean; onToggle: () => void;
}) {
  const methodColor: Record<string, string> = {
    GET: "#00a747", POST: "#fb0b8c", PUT: "#8057d7",
  };
  return (
    <div className={`ep-row ${active ? "is-active" : ""}`}>
      <button className="ep-head" onClick={onToggle}>
        <span className="ep-method" style={{ color: methodColor[ep.method] }}>
          {ep.method}
        </span>
        <span className="ep-path">{ep.path}</span>
        <span className="ep-label">{ep.label}</span>
        <ChevronRight size={14} className={`ep-chevron ${active ? "rotated" : ""}`} />
      </button>
      <AnimatePresence>
        {active && (
          <motion.div
            className="ep-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ep-body-inner">
              <p className="ep-desc">{ep.desc}</p>
              {ep.payload && (
                <>
                  <p className="ep-section-label">Request body</p>
                  <CodeBlock code={ep.payload} />
                </>
              )}
              {ep.response && (
                <>
                  <p className="ep-section-label">Response</p>
                  <CodeBlock code={ep.response} />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SettlementApiDrawer() {
  const [open, setOpen]     = useState(false);
  const [active, setActive] = useState<number | null>(0);

  useEffect(() => {
    const handler = () => { setOpen(true); setActive(0); };
    window.addEventListener("ptdt:open-settlement-api", handler);
    return () => window.removeEventListener("ptdt:open-settlement-api", handler);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Drawer panel */}
          <motion.aside
            className="api-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Settlement API Reference"
          >
            {/* Drawer Header */}
            <div className="drawer-head">
              <div className="drawer-head-icon">
                <Code2 size={18} />
              </div>
              <div>
                <h2 className="drawer-title">Settlement API</h2>
                <p className="drawer-subtitle">REST · BNB Chain · JSON</p>
              </div>
              <button className="drawer-close" onClick={close} aria-label="Close drawer">
                <X size={18} />
              </button>
            </div>

            {/* Base URL */}
            <div className="drawer-base-url">
              <span className="base-label">Base URL</span>
              <code className="base-url">https://api.ptdt.taxi/v1</code>
            </div>

            {/* Badges */}
            <div className="drawer-badges">
              <span className="d-badge green"><Zap size={11} />Live on BSC</span>
              <span className="d-badge pink"><Shield size={11} />API Key Auth</span>
              <span className="d-badge purple"><Code2 size={11} />JSON REST</span>
            </div>

            {/* Endpoints */}
            <div className="drawer-endpoints">
              {ENDPOINTS.map((ep, i) => (
                <EndpointRow
                  key={ep.path}
                  ep={ep}
                  active={active === i}
                  onToggle={() => setActive(active === i ? null : i)}
                />
              ))}
            </div>

            {/* Footer CTA */}
            <div className="drawer-footer">
              <a href="/developers" className="drawer-footer-btn">
                Full API Docs →
              </a>
              <a
                href="https://github.com/pinkpeether"
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-footer-btn ghost"
              >
                GitHub
              </a>
            </div>
          </motion.aside>
        </>
      )}

      <style>{`
        .drawer-backdrop {
          position: fixed; inset: 0; z-index: 8000;
          background: rgba(10,8,18,0.52);
          backdrop-filter: blur(4px);
        }
        .api-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(560px, 96vw); z-index: 8100;
          background: #fff;
          display: flex; flex-direction: column;
          overflow: hidden;
          box-shadow: -24px 0 80px rgba(10,8,18,0.18);
          border-left: 1px solid rgba(251,11,140,0.12);
        }
        .drawer-head {
          display: flex; align-items: center; gap: 14px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(16,16,24,0.07);
          flex-shrink: 0;
        }
        .drawer-head-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #fb0b8c22, #8057d722);
          border: 1px solid rgba(251,11,140,0.2);
          display: grid; place-items: center;
          color: #fb0b8c; flex-shrink: 0;
        }
        .drawer-title {
          font-size: 17px; font-weight: 900; color: #101018;
          letter-spacing: -0.03em;
        }
        .drawer-subtitle {
          font-size: 12px; color: #958da4; margin-top: 1px;
          font-family: "IBM Plex Mono", monospace;
        }
        .drawer-close {
          margin-left: auto; width: 36px; height: 36px;
          border-radius: 50%; background: #f6f4f8; color: #706a7d;
          display: grid; place-items: center;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
        }
        .drawer-close:hover { background: #fb0b8c; color: #fff; }
        .drawer-base-url {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px;
          background: #0f0f1a;
          flex-shrink: 0;
        }
        .base-label {
          font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.35);
          text-transform: uppercase; letter-spacing: 0.08em; flex-shrink: 0;
        }
        .base-url {
          font-family: "IBM Plex Mono", monospace;
          font-size: 12px; color: #2ae97b;
          word-break: break-all;
        }
        .drawer-badges {
          display: flex; gap: 8px; padding: 12px 20px;
          border-bottom: 1px solid rgba(16,16,24,0.07); flex-shrink: 0;
          flex-wrap: wrap;
        }
        .d-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; padding: 4px 10px;
          border-radius: 999px; font-family: "IBM Plex Mono", monospace;
        }
        .d-badge.green { background: #edfff5; color: #0e8f43; border: 1px solid rgba(0,167,71,0.22); }
        .d-badge.pink  { background: #fff0f8; color: #fb0b8c; border: 1px solid rgba(251,11,140,0.22); }
        .d-badge.purple{ background: #f4efff; color: #8057d7; border: 1px solid rgba(128,87,215,0.2); }
        .drawer-endpoints {
          flex: 1; overflow-y: auto; padding: 12px 16px;
          scrollbar-width: thin; scrollbar-color: #fb0b8c transparent;
        }
        .ep-row {
          border: 1px solid rgba(16,16,24,0.08);
          border-radius: 12px; margin-bottom: 8px; overflow: hidden;
          transition: border-color 0.2s;
        }
        .ep-row.is-active { border-color: rgba(251,11,140,0.28); }
        .ep-head {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 12px 14px; text-align: left;
          background: transparent;
          transition: background 0.18s;
        }
        .ep-head:hover { background: #f6f4f8; }
        .ep-method {
          font-size: 11px; font-weight: 900; font-family: "IBM Plex Mono", monospace;
          width: 38px; flex-shrink: 0;
        }
        .ep-path {
          font-size: 12px; font-family: "IBM Plex Mono", monospace;
          color: #1b1723; flex: 1; min-width: 0; truncate: ellipsis;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .ep-label {
          font-size: 12px; font-weight: 700; color: #706a7d; flex-shrink: 0;
        }
        .ep-chevron { color: #958da4; flex-shrink: 0; transition: transform 0.22s; }
        .ep-chevron.rotated { transform: rotate(90deg); }
        .ep-body { overflow: hidden; }
        .ep-body-inner { padding: 0 14px 16px; }
        .ep-desc { font-size: 13px; color: #706a7d; line-height: 1.6; margin-bottom: 10px; }
        .ep-section-label {
          font-size: 11px; font-weight: 800; color: #958da4;
          text-transform: uppercase; letter-spacing: 0.07em;
          margin: 10px 0 6px;
        }
        .code-block {
          position: relative; background: #0f0f1a;
          border-radius: 8px; overflow: hidden;
        }
        .code-block pre {
          padding: 14px 14px 14px;
          font-size: 11px; line-height: 1.7;
          color: rgba(255,255,255,0.78);
          font-family: "IBM Plex Mono", monospace;
          overflow-x: auto; white-space: pre;
        }
        .copy-btn {
          position: absolute; top: 8px; right: 8px;
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 6px;
          background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.55);
          font-size: 11px; font-weight: 700; transition: background 0.2s, color 0.2s;
        }
        .copy-btn:hover { background: rgba(251,11,140,0.25); color: #ff67b7; }
        .drawer-footer {
          display: flex; gap: 10px; padding: 16px 20px;
          border-top: 1px solid rgba(16,16,24,0.07); flex-shrink: 0;
        }
        .drawer-footer-btn {
          flex: 1; min-height: 42px; display: grid; place-items: center;
          border-radius: 999px; font-size: 13px; font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #fb0b8c, #ff4bad);
          box-shadow: 0 10px 22px rgba(251,11,140,0.24);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .drawer-footer-btn:hover { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(251,11,140,0.34); }
        .drawer-footer-btn.ghost {
          background: #f6f4f8; color: #1b1723;
          box-shadow: none; border: 1px solid rgba(16,16,24,0.1);
        }
        .drawer-footer-btn.ghost:hover { border-color: rgba(251,11,140,0.3); color: #fb0b8c; }
      `}</style>
    </AnimatePresence>
  );
}
