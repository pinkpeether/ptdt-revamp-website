import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Copy, CheckCheck, ExternalLink } from "lucide-react";

/* ─── CSS injected once into <head> — never inside React render tree ──────── */
const DRAWER_CSS = `
.drawer-backdrop{position:fixed;inset:0;z-index:8000;background:rgba(10,8,18,.52);backdrop-filter:blur(4px);}
.api-drawer{position:fixed;top:0;right:0;bottom:0;width:min(560px,96vw);z-index:8100;background:#fff;display:flex;flex-direction:column;overflow:hidden;box-shadow:-24px 0 80px rgba(10,8,18,.18);border-left:1px solid rgba(251,11,140,.12);}
.drawer-head{display:flex;align-items:center;gap:14px;padding:20px 20px 16px;border-bottom:1px solid rgba(16,16,24,.07);flex-shrink:0;}
.drawer-head-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,rgba(251,11,140,.13),rgba(128,87,215,.13));border:1px solid rgba(251,11,140,.2);display:grid;place-items:center;color:#fb0b8c;flex-shrink:0;}
.drawer-title{font-size:17px;font-weight:900;color:#101018;letter-spacing:-.03em;}
.drawer-subtitle{font-size:12px;color:#958da4;margin-top:1px;font-family:"IBM Plex Mono",monospace;}
.drawer-close{margin-left:auto;width:36px;height:36px;border-radius:50%;background:#f6f4f8;color:#706a7d;display:grid;place-items:center;flex-shrink:0;transition:background .2s,color .2s;cursor:pointer;}
.drawer-close:hover{background:#fb0b8c;color:#fff;}
.drawer-base-url{display:flex;align-items:center;gap:12px;padding:12px 20px;background:#0f0f1a;flex-shrink:0;}
.base-label{font-size:10px;font-weight:800;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em;flex-shrink:0;}
.base-url-text{font-family:"IBM Plex Mono",monospace;font-size:12px;color:#2ae97b;word-break:break-all;}
.drawer-badges{display:flex;gap:8px;padding:12px 20px;border-bottom:1px solid rgba(16,16,24,.07);flex-shrink:0;flex-wrap:wrap;}
.d-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;font-family:"IBM Plex Mono",monospace;}
.d-badge.green{background:#edfff5;color:#0e8f43;border:1px solid rgba(0,167,71,.22);}
.d-badge.pink{background:#fff0f8;color:#fb0b8c;border:1px solid rgba(251,11,140,.22);}
.d-badge.purple{background:#f4efff;color:#8057d7;border:1px solid rgba(128,87,215,.2);}
.drawer-endpoints{flex:1;overflow-y:auto;padding:12px 16px;scrollbar-width:thin;scrollbar-color:#fb0b8c transparent;}
.ep-row{border:1px solid rgba(16,16,24,.08);border-radius:12px;margin-bottom:8px;overflow:hidden;transition:border-color .2s;}
.ep-row.is-active{border-color:rgba(251,11,140,.28);}
.ep-head{display:flex;align-items:center;gap:10px;width:100%;padding:12px 14px;text-align:left;background:transparent;transition:background .18s;cursor:pointer;border:none;}
.ep-head:hover{background:#f6f4f8;}
.ep-method{font-size:11px;font-weight:900;font-family:"IBM Plex Mono",monospace;width:38px;flex-shrink:0;}
.ep-path{font-size:12px;font-family:"IBM Plex Mono",monospace;color:#1b1723;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.ep-label{font-size:12px;font-weight:700;color:#706a7d;flex-shrink:0;}
.ep-chevron{color:#958da4;flex-shrink:0;transition:transform .22s;}
.ep-chevron.rotated{transform:rotate(90deg);}
.ep-body-inner{padding:0 14px 16px;}
.ep-desc{font-size:13px;color:#706a7d;line-height:1.6;margin-bottom:10px;}
.ep-section-label{font-size:11px;font-weight:800;color:#958da4;text-transform:uppercase;letter-spacing:.07em;margin:10px 0 6px;}
.code-block{position:relative;background:#0f0f1a;border-radius:8px;overflow:hidden;}
.code-block pre{padding:14px;font-size:11px;line-height:1.7;color:rgba(255,255,255,.78);font-family:"IBM Plex Mono",monospace;overflow-x:auto;white-space:pre;}
.copy-btn{position:absolute;top:8px;right:8px;display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.55);font-size:11px;font-weight:700;transition:background .2s,color .2s;cursor:pointer;border:none;}
.copy-btn:hover{background:rgba(251,11,140,.25);color:#ff67b7;}
.drawer-footer{display:flex;gap:10px;padding:16px 20px;border-top:1px solid rgba(16,16,24,.07);flex-shrink:0;}
.drawer-footer-btn{flex:1;min-height:42px;display:grid;place-items:center;border-radius:999px;font-size:13px;font-weight:800;color:#fff;background:linear-gradient(135deg,#fb0b8c,#ff4bad);box-shadow:0 10px 22px rgba(251,11,140,.24);transition:box-shadow .2s,transform .2s;cursor:pointer;border:none;text-decoration:none;}
.drawer-footer-btn:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(251,11,140,.34);}
.drawer-footer-btn.ghost{background:#f6f4f8;color:#1b1723;box-shadow:none;border:1px solid rgba(16,16,24,.1);}
.drawer-footer-btn.ghost:hover{border-color:rgba(251,11,140,.3);color:#fb0b8c;}
`;

function injectDrawerCSS() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ptdt-drawer-css")) return;
  const tag = document.createElement("style");
  tag.id = "ptdt-drawer-css";
  tag.textContent = DRAWER_CSS;
  document.head.appendChild(tag);
}

/* ─── Data ────────────────────────────────────────────────────────────────── */
const ENDPOINTS = [
  {
    method: "POST", path: "/v1/settlement/initiate", label: "Initiate Settlement",
    desc: "Submit a new ride fare for on-chain settlement. Returns a settlement ID and transaction hash.",
    reqBody: `{
  "ride_id":      "RD-20240101-XYZ",
  "fare_amount":  "12.50",
  "currency":     "USDT",
  "driver_wallet":"0xABC...DEF",
  "platform_id":  "plt_xxxxx"
}`,
    resBody: `{
  "settlement_id": "stl_xxxxxxxxxxxx",
  "status":        "pending",
  "tx_hash":       "0xabc...123",
  "burned":        "0.075",
  "staker_reward": "0.050",
  "created_at":    "2024-01-01T00:00:00Z"
}`,
  },
  {
    method: "GET", path: "/v1/settlement/:id", label: "Get Settlement",
    desc: "Retrieve full details of a single settlement by its ID.",
    reqBody: `// No body — pass settlement_id in URL
GET /v1/settlement/stl_xxxxxxxxxxxx`,
    resBody: `{
  "settlement_id": "stl_xxxxxxxxxxxx",
  "status":        "confirmed",
  "tx_hash":       "0xabc...123",
  "block_number":  38291847,
  "fare_amount":   "12.50",
  "burned":        "0.075",
  "staker_reward": "0.050"
}`,
  },
  {
    method: "GET", path: "/v1/settlement/history", label: "Settlement History",
    desc: "Paginated list of all settlements for your platform. Supports ?page, ?limit, ?status filters.",
    reqBody: `GET /v1/settlement/history?page=1&limit=20&status=confirmed`,
    resBody: `{
  "data":  [ { "settlement_id": "stl_...", "status": "confirmed", ... } ],
  "total": 142,
  "page":  1,
  "limit": 20
}`,
  },
  {
    method: "POST", path: "/v1/settlement/webhook", label: "Register Webhook",
    desc: "Register a webhook URL to receive real-time settlement status updates.",
    reqBody: `{
  "url":    "https://yourplatform.com/webhook/ptdt",
  "events": ["settlement.confirmed", "settlement.failed"]
}`,
    resBody: `{
  "webhook_id": "wh_xxxxxxxxxxxx",
  "url":        "https://yourplatform.com/webhook/ptdt",
  "status":     "active"
}`,
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function SettlementApiDrawer() {
  const [open, setOpen]       = useState(false);
  const [active, setActive]   = useState<number | null>(null);
  const [copied, setCopied]   = useState<string | null>(null);

  // Inject CSS once on mount — never inside render
  useEffect(() => { injectDrawerCSS(); }, []);

  // Listen for open event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("ptdt:open-settlement-api", handler);
    return () => window.removeEventListener("ptdt:open-settlement-api", handler);
  }, []);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open]);

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    });
  }, []);

  const methodColor = (m: string) =>
    m === "POST" ? "#fb0b8c" : m === "GET" ? "#2ae97b" : "#b993ff";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="api-drawer"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* Header */}
            <div className="drawer-head">
              <div className="drawer-head-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 9l3 3-3 3M13 15h3M3 12a9 9 0 1018 0A9 9 0 003 12z"/>
                </svg>
              </div>
              <div>
                <div className="drawer-title">Settlement API</div>
                <div className="drawer-subtitle">REST · JSON · BNB Chain · v1</div>
              </div>
              <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            {/* Base URL */}
            <div className="drawer-base-url">
              <span className="base-label">BASE URL</span>
              <span className="base-url-text">https://api.ptdt.taxi/v1</span>
            </div>

            {/* Badges */}
            <div className="drawer-badges">
              <span className="d-badge green">✓ REST</span>
              <span className="d-badge pink">API Key Auth</span>
              <span className="d-badge purple">BNB Chain</span>
              <span className="d-badge green">JSON</span>
            </div>

            {/* Endpoints */}
            <div className="drawer-endpoints">
              {ENDPOINTS.map((ep, i) => (
                <div key={i} className={`ep-row${active === i ? " is-active" : ""}`}>
                  <button className="ep-head" onClick={() => setActive(active === i ? null : i)}>
                    <span className="ep-method" style={{ color: methodColor(ep.method) }}>{ep.method}</span>
                    <code className="ep-path">{ep.path}</code>
                    <span className="ep-label">{ep.label}</span>
                    <ChevronRight size={14} className={`ep-chevron${active === i ? " rotated" : ""}`} />
                  </button>

                  {active === i && (
                    <div className="ep-body-inner">
                      <p className="ep-desc">{ep.desc}</p>

                      <div className="ep-section-label">Request</div>
                      <div className="code-block">
                        <pre>{ep.reqBody}</pre>
                        <button className="copy-btn" onClick={() => copy(ep.reqBody, `req-${i}`)}>
                          {copied === `req-${i}` ? <><CheckCheck size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                        </button>
                      </div>

                      <div className="ep-section-label" style={{ marginTop: 12 }}>Response</div>
                      <div className="code-block">
                        <pre>{ep.resBody}</pre>
                        <button className="copy-btn" onClick={() => copy(ep.resBody, `res-${i}`)}>
                          {copied === `res-${i}` ? <><CheckCheck size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="drawer-footer">
              <a href="/developers" className="drawer-footer-btn">
                Full API Docs
              </a>
              <a
                href="https://github.com/pinkpeether/ptdt-revamp-website"
                target="_blank" rel="noopener noreferrer"
                className="drawer-footer-btn ghost"
              >
                GitHub <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
