import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { signIn, signUp, forgotPassword } from "@lib/auth";

type Mode = "signin" | "signup" | "forgot";

interface FieldState {
  email: string;
  password: string;
  confirm: string;
}

const OVERLAY_VARIANTS = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

const PANEL_VARIANTS = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
};

export default function AuthModal() {
  const [open, setOpen]         = useState(false);
  const [mode, setMode]         = useState<Mode>("signin");
  const [fields, setFields]     = useState<FieldState>({ email: "", password: "", confirm: "" });
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  // Listen for global open event from Navbar / anywhere
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ mode?: Mode }>).detail;
      setMode(detail?.mode ?? "signin");
      setError(null);
      setSuccess(null);
      setFields({ email: "", password: "", confirm: "" });
      setOpen(true);
    };
    window.addEventListener("ptdt:open-auth", handler);
    return () => window.removeEventListener("ptdt:open-auth", handler);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const update = (field: keyof FieldState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields(prev => ({ ...prev, [field]: e.target.value }));

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setSuccess(null);
    setFields({ email: "", password: "", confirm: "" });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(fields.email, fields.password);
        close();
        window.location.reload();

      } else if (mode === "signup") {
        if (fields.password !== fields.confirm) {
          throw new Error("Passwords do not match.");
        }
        if (fields.password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        await signUp(fields.email, fields.password);
        setSuccess("Account created! Please check your email to verify your address.");

      } else if (mode === "forgot") {
        await forgotPassword(fields.email);
        setSuccess("Password reset email sent. Check your inbox.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const titles: Record<Mode, string> = {
    signin: "Welcome back",
    signup: "Create account",
    forgot: "Reset password",
  };

  const subtitles: Record<Mode, string> = {
    signin: "Sign in to your PTDT account",
    signup: "Join the PTDT settlement protocol",
    forgot: "We'll email you a reset link",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="auth-overlay"
          variants={OVERLAY_VARIANTS}
          initial="hidden" animate="visible" exit="exit"
          onClick={e => { if (e.target === e.currentTarget) close(); }}
          role="dialog" aria-modal="true" aria-label={titles[mode]}
        >
          <motion.div
            className="auth-panel"
            variants={PANEL_VARIANTS}
            initial="hidden" animate="visible" exit="exit"
          >
            {/* Header */}
            <div className="auth-head">
              {mode === "forgot" && (
                <button className="auth-back" onClick={() => switchMode("signin")} aria-label="Back">
                  <ArrowLeft size={16} />
                </button>
              )}
              <div className="auth-logo">
                <img src="/ptdt-main-logo.png" alt="PTDT" />
              </div>
              <button className="auth-close" onClick={close} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="auth-body">
              <h2 className="auth-title">{titles[mode]}</h2>
              <p className="auth-subtitle">{subtitles[mode]}</p>

              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    className="auth-alert success"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <CheckCircle size={16} />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="auth-alert error"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <span>⚠ {error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="auth-field">
                  <label htmlFor="auth-email">Email address</label>
                  <div className="auth-input-wrap">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      id="auth-email"
                      type="email" required autoComplete="email"
                      placeholder="you@example.com"
                      value={fields.email}
                      onChange={update("email")}
                    />
                  </div>
                </div>

                {/* Password (not on forgot) */}
                {mode !== "forgot" && (
                  <div className="auth-field">
                    <label htmlFor="auth-password">Password</label>
                    <div className="auth-input-wrap">
                      <Lock size={16} className="auth-input-icon" />
                      <input
                        id="auth-password"
                        type={showPw ? "text" : "password"} required
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        placeholder={mode === "signup" ? "Min 8 characters" : "••••••••"}
                        value={fields.password}
                        onChange={update("password")}
                      />
                      <button
                        type="button" className="pw-toggle"
                        onClick={() => setShowPw(p => !p)}
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password (signup only) */}
                {mode === "signup" && (
                  <div className="auth-field">
                    <label htmlFor="auth-confirm">Confirm password</label>
                    <div className="auth-input-wrap">
                      <Lock size={16} className="auth-input-icon" />
                      <input
                        id="auth-confirm"
                        type={showPw ? "text" : "password"} required
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        value={fields.confirm}
                        onChange={update("confirm")}
                      />
                    </div>
                  </div>
                )}

                {/* Forgot password link (signin only) */}
                {mode === "signin" && (
                  <div className="auth-forgot-wrap">
                    <button type="button" className="auth-link" onClick={() => switchMode("forgot")}>
                      Forgot password?
                    </button>
                  </div>
                )}

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? (
                    <span className="auth-spinner" />
                  ) : (
                    <>
                      {mode === "signin" && "Sign in"}
                      {mode === "signup" && "Create account"}
                      {mode === "forgot" && "Send reset link"}
                    </>
                  )}
                </button>
              </form>

              {/* Footer switch */}
              <div className="auth-switch">
                {mode === "signin" ? (
                  <span>
                    New to PTDT?{" "}
                    <button className="auth-link" onClick={() => switchMode("signup")}>
                      Create an account
                    </button>
                  </span>
                ) : mode === "signup" ? (
                  <span>
                    Already have an account?{" "}
                    <button className="auth-link" onClick={() => switchMode("signin")}>
                      Sign in
                    </button>
                  </span>
                ) : null}
              </div>
            </div>
          </motion.div>

          <style>{`
            .auth-overlay {
              position: fixed; inset: 0; z-index: 9000;
              background: rgba(10,8,18,0.62);
              backdrop-filter: blur(6px);
              display: grid; place-items: center;
              padding: 24px;
            }
            .auth-panel {
              width: 100%; max-width: 440px;
              background: #fff;
              border-radius: 24px;
              box-shadow: 0 40px 100px rgba(10,8,18,0.28), 0 0 0 1px rgba(251,11,140,0.1);
              overflow: hidden;
            }
            .auth-head {
              display: flex; align-items: center;
              padding: 20px 24px 0;
              position: relative;
            }
            .auth-logo { flex: 1; display: flex; justify-content: center; }
            .auth-logo img { height: 38px; object-fit: contain; }
            .auth-back, .auth-close {
              width: 36px; height: 36px; border-radius: 50%;
              background: #f6f4f8; color: #706a7d;
              display: grid; place-items: center;
              transition: background 0.2s, color 0.2s;
              flex-shrink: 0;
            }
            .auth-back { position: absolute; left: 20px; }
            .auth-close { position: absolute; right: 20px; }
            .auth-back:hover, .auth-close:hover { background: #fb0b8c; color: #fff; }
            .auth-body { padding: 20px 28px 28px; }
            .auth-title {
              font-size: 22px; font-weight: 900; color: #101018;
              letter-spacing: -0.04em; text-align: center; margin-bottom: 4px;
            }
            .auth-subtitle {
              font-size: 13px; color: #706a7d; text-align: center;
              margin-bottom: 20px; line-height: 1.5;
            }
            .auth-alert {
              display: flex; align-items: flex-start; gap: 8px;
              padding: 10px 14px; border-radius: 10px;
              font-size: 13px; line-height: 1.5; margin-bottom: 16px;
            }
            .auth-alert.success {
              background: #edfff5; color: #0e8f43;
              border: 1px solid rgba(0,167,71,0.22);
            }
            .auth-alert.error {
              background: #fff0f8; color: #e0087d;
              border: 1px solid rgba(251,11,140,0.22);
            }
            .auth-field { margin-bottom: 14px; }
            .auth-field label {
              display: block; font-size: 12px; font-weight: 700;
              color: #1b1723; margin-bottom: 6px; letter-spacing: -0.01em;
            }
            .auth-input-wrap {
              position: relative; display: flex; align-items: center;
              border: 1.5px solid rgba(16,16,24,0.12);
              border-radius: 10px; background: #fbfafc;
              transition: border-color 0.2s, box-shadow 0.2s;
            }
            .auth-input-wrap:focus-within {
              border-color: #fb0b8c;
              box-shadow: 0 0 0 3px rgba(251,11,140,0.1);
              background: #fff;
            }
            .auth-input-icon {
              position: absolute; left: 14px; color: #958da4;
              pointer-events: none; flex-shrink: 0;
            }
            .auth-input-wrap input {
              width: 100%; padding: 12px 14px 12px 40px;
              border: 0; background: transparent;
              font-size: 14px; color: #101018; outline: none;
              border-radius: inherit;
            }
            .auth-input-wrap input::placeholder { color: #958da4; }
            .pw-toggle {
              position: absolute; right: 12px;
              color: #958da4; padding: 4px;
              transition: color 0.2s;
            }
            .pw-toggle:hover { color: #fb0b8c; }
            .auth-forgot-wrap {
              text-align: right; margin-bottom: 6px; margin-top: -6px;
            }
            .auth-link {
              color: #fb0b8c; font-size: 13px; font-weight: 700;
              transition: color 0.2s;
            }
            .auth-link:hover { color: #e0087d; text-decoration: underline; }
            .auth-submit {
              width: 100%; min-height: 48px; margin-top: 12px;
              border-radius: 999px; font-size: 15px; font-weight: 900;
              color: #fff;
              background: linear-gradient(135deg, #fb0b8c, #ff4bad);
              box-shadow: 0 12px 26px rgba(251,11,140,0.28);
              transition: box-shadow 0.2s, transform 0.2s, opacity 0.2s;
              display: grid; place-items: center;
            }
            .auth-submit:hover:not(:disabled) {
              box-shadow: 0 18px 38px rgba(251,11,140,0.38);
              transform: translateY(-2px);
            }
            .auth-submit:disabled { opacity: 0.65; cursor: not-allowed; }
            .auth-spinner {
              width: 20px; height: 20px;
              border: 2.5px solid rgba(255,255,255,0.35);
              border-top-color: #fff;
              border-radius: 50%;
              animation: auth-spin 0.7s linear infinite;
            }
            @keyframes auth-spin { to { transform: rotate(360deg); } }
            .auth-switch {
              text-align: center; margin-top: 18px;
              font-size: 13px; color: #706a7d;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
