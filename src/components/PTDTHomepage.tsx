import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Flame,
  Gauge,
  Github,
  Layers3,
  Lock,
  Menu,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Protocol", href: "#protocol" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Staking", href: "#staking" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Roadmap", href: "#roadmap" },
];

const stats = [
  { label: "Hard Cap", value: "100K", tone: "text-ptdt-pink", icon: Gauge },
  { label: "Fee Burn", value: "60%", tone: "text-ptdt-pink", icon: Flame },
  { label: "To Stakers", value: "40%", tone: "text-ptdt-green", icon: Wallet },
  { label: "Audit Score", value: "9.2/10", tone: "text-ptdt-purple", icon: ShieldCheck },
];

const proofPoints = [
  "Settlement API surface for ride-hailing payment flows.",
  "On-chain receipts for fare settlement transparency.",
  "Deflationary fee routing: 60% burned, 40% to stakers.",
  "BNB Smart Chain deployment with public contract verification.",
];

const tokenCards = [
  {
    label: "Permanent Burn",
    value: "60%",
    desc: "Every protocol transaction fee routes the majority share to burn pressure.",
    icon: Flame,
    card: "border-pink-500/30 bg-pink-500/10",
    iconTone: "bg-pink-500/15 text-ptdt-pink",
  },
  {
    label: "Staker Yield",
    value: "40%",
    desc: "A protocol fee pool distributes yield to stakers without inflationary minting.",
    icon: TrendingUp,
    card: "border-emerald-400/30 bg-emerald-400/10",
    iconTone: "bg-emerald-400/15 text-ptdt-greenLight",
  },
  {
    label: "Supply Cap",
    value: "100K",
    desc: "Hard-capped token model designed for scarcity and clean verification.",
    icon: Lock,
    card: "border-white/10 bg-white/5",
    iconTone: "bg-white/10 text-white",
  },
  {
    label: "Protocol Utility",
    value: "API",
    desc: "PTDT is infrastructure: the token is the fuel, the API is the engine.",
    icon: Layers3,
    card: "border-purple-400/30 bg-purple-400/10",
    iconTone: "bg-purple-400/15 text-ptdt-purpleLight",
  },
];

const tiers = [
  { name: "Bronze", apy: "12%", min: "10 PTDT", lock: "30 days", accent: "from-[#cd7f32] to-[#e8a87c]", badge: "bg-[#cd7f32]/10 text-[#a05c1a]" },
  { name: "Silver", apy: "15%", min: "100 PTDT", lock: "60 days", accent: "from-slate-400 to-slate-200", badge: "bg-slate-200 text-slate-600" },
  { name: "Gold", apy: "18%", min: "500 PTDT", lock: "90 days", accent: "from-ptdt-pink to-[#ff4bad]", badge: "bg-pink-50 text-ptdt-pink" },
];

const ecosystem = [
  { name: "Dashboard", sub: "Live protocol surface", icon: "01", glow: "[--eco-glow:rgba(251,11,140,0.24)] [--eco-soft:#fff0f8]" },
  { name: "Settlement API", sub: "Developer docs", icon: "02", glow: "[--eco-glow:rgba(42,233,123,0.24)] [--eco-soft:#edfff5]" },
  { name: "Explorer", sub: "On-chain trace", icon: "03", glow: "[--eco-glow:rgba(128,87,215,0.24)] [--eco-soft:#f4efff]" },
  { name: "Staking", sub: "Protocol yield", icon: "04", glow: "[--eco-glow:rgba(240,185,11,0.22)] [--eco-soft:#fff8df]" },
  { name: "GitHub", sub: "Public build layer", icon: "05", glow: "[--eco-glow:rgba(56,189,248,0.22)] [--eco-soft:#ecfdff]" },
];

const roadmap = [
  { status: "Live", title: "Core protocol surfaces", desc: "Website, staking, docs, explorer and public verification layers available.", tone: "text-ptdt-green" },
  { status: "Active", title: "Revamped SEO website", desc: "Astro shell with React islands for interactive protocol sections.", tone: "text-ptdt-pink" },
  { status: "Next", title: "Operator integration readiness", desc: "Clear API positioning, partner pages, case studies and settlement demos.", tone: "text-ptdt-muted" },
];

function BrandMark() {
  return (
    <a href="#top" className="flex items-center gap-3 min-w-0" aria-label="Peether PTDT Home">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ptdt-green to-ptdt-greenLight p-1 shadow-glowGreen">
        <div className="grid h-full w-full place-items-center rounded-full bg-white/80 text-[10px] font-black text-ptdt-pink shadow-inner">
          PTDT
        </div>
      </div>
      <div className="leading-tight">
        <div className="text-[18px] font-black tracking-[-0.04em] text-ptdt-ink">Peether <span className="text-ptdt-pink">PTDT</span></div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ptdt-muted">Settlement Protocol</div>
      </div>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 -mb-[100px] px-0 py-3">
      <div className="container">
        <div className="flex min-h-[76px] items-center justify-between gap-4 rounded-full border border-black/10 bg-white/85 px-4 py-2 shadow-softCard backdrop-blur-2xl">
          <BrandMark />

          <nav className="hidden items-center gap-1 rounded-full border border-black/5 bg-ptdt-mist/80 p-1 lg:flex" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${index === 0 ? "bg-gradient-to-br from-ptdt-pink to-[#ff4bad] text-white shadow-glowPink" : "text-ptdt-muted hover:bg-white hover:text-ptdt-ink"}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a href="https://github.com/pinkpeether" className="btn btn-ghost min-h-[38px] px-4 text-[13px]" target="_blank" rel="noreferrer">
              <Github size={15} /> GitHub
            </a>
            <a href="/stake" className="btn btn-primary min-h-[38px] px-4 text-[13px]">Stake</a>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-ptdt-ink text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {open && (
          <div className="mt-3 rounded-[28px] border border-black/10 bg-white/95 p-3 shadow-softCard backdrop-blur-2xl lg:hidden">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-extrabold text-ptdt-muted hover:bg-pink-50 hover:text-ptdt-pink">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Announcement() {
  return (
    <>
      <div className="relative z-30 grid min-h-[78px] place-items-center overflow-hidden bg-[#0a0a0f] px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_50%,rgba(251,11,140,0.34),transparent_34%),radial-gradient(circle_at_70%_40%,rgba(42,233,123,0.22),transparent_30%)]" />
        <div className="relative font-mono text-[13px] font-black uppercase tracking-[0.24em] text-white/90">
          Trust the <span className="text-ptdt-greenLight">&#123; Code &#125;</span>, <span className="text-ptdt-pink">// Not the Cult!</span>
        </div>
      </div>
      <div className="relative z-30 grid min-h-[35px] place-items-center bg-gradient-to-b from-[#9250f2] via-[#7d39d6] to-[#59515a] px-6 text-center text-[15px] font-bold text-white shadow-lg">
        <span><strong>PTDT Settlement Protocol</strong> — From Pink Taxi to Global Protocol.</span>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[640px] items-center overflow-hidden rounded-b-[42px] bg-ptdt-ink pt-[100px]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,8,18,0.82)_0%,rgba(10,8,18,0.62)_30%,rgba(10,8,18,0.25)_56%,rgba(10,8,18,0.10)_100%),radial-gradient(circle_at_73%_39%,rgba(251,11,140,0.35),transparent_29%),radial-gradient(circle_at_82%_68%,rgba(42,233,123,0.24),transparent_28%),linear-gradient(135deg,#0a0812,#251533_48%,#07140d)]" />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,8,18,0.50)_0%,rgba(10,8,18,0.30)_38%,rgba(10,8,18,0.08)_72%,rgba(10,8,18,0.02)_100%)]" />

      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-[50%] top-[28%] aspect-square w-[42vw] max-w-[540px] rounded-full bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.28),rgba(251,11,140,0.16)_30%,rgba(10,8,18,0.86)_66%),repeating-linear-gradient(115deg,rgba(42,233,123,0.16)_0_2px,transparent_2px_14px)] shadow-[0_0_0_1px_rgba(251,11,140,0.18),0_0_34px_rgba(251,11,140,0.26),inset_0_0_26px_rgba(0,0,0,0.45)] lg:left-[44.5%]">
          <div className="absolute inset-[9%] grid place-items-center rounded-full border border-white/20 text-center text-white">
            <span className="text-[clamp(2rem,5vw,5.5rem)] font-black tracking-[-0.08em] text-white/90 drop-shadow-[0_0_30px_rgba(251,11,140,0.48)]">PTDT</span>
            <small className="absolute bottom-[25%] font-mono text-[10px] font-black uppercase tracking-[0.16em] text-ptdt-greenLight">Live Settlement</small>
          </div>
        </div>

        <div className="absolute left-[31vw] top-[24vw] aspect-square w-[18vw] max-w-[220px] rounded-full border border-ptdt-greenLight/55 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.16),rgba(251,11,140,0.05)_54%,rgba(0,0,0,0.14)_72%),repeating-linear-gradient(115deg,rgba(42,233,123,0.18)_0_2px,transparent_2px_14px)] opacity-75 mix-blend-screen shadow-[0_0_22px_rgba(42,233,123,0.28),inset_0_0_32px_rgba(251,11,140,0.18)]" />

        <svg className="absolute right-[9vw] top-[16vw] h-[200px] w-[330px] max-w-[26vw] overflow-visible drop-shadow-[0_0_18px_rgba(251,11,140,0.45)]" viewBox="0 0 330 200" fill="none">
          <path d="M18 155 C 52 155 52 120 82 120 C 112 120 118 95 148 85 C 178 75 198 95 220 85 C 242 75 268 58 305 58" stroke="#fb0b8c" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="420" />
          <circle cx="82" cy="120" r="4.5" fill="#fb0b8c" />
          <circle cx="148" cy="85" r="4.5" fill="#2ae97b" />
          <circle cx="220" cy="85" r="4.5" fill="#b993ff" />
          <circle cx="305" cy="58" r="6.5" fill="#fb0b8c" />
        </svg>
      </div>

      <div className="container relative z-10 py-20 md:py-24">
        <div className="max-w-[430px] md:ml-[8vw] xl:ml-[15vw]">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-ptdt-green/30 bg-ptdt-green/10 px-4 py-2 font-mono text-[11px] font-black uppercase tracking-[0.08em] text-ptdt-greenLight">
            <span className="pulse-dot" /> Settlement Protocol · BNB Chain · Live
          </div>
          <h1 className="mb-5 text-[clamp(2.15rem,3.45vw,3.25rem)] font-black leading-[1.06] tracking-[-0.05em] text-white">
            The <span className="text-ptdt-pink">Visa</span> for <br /> <span className="text-ptdt-greenLight">Ride-Hailing.</span>
          </h1>
          <p className="mb-6 max-w-[350px] text-[clamp(16px,1.32vw,20px)] leading-[1.72] text-white/80">
            PTDT is decentralized settlement infrastructure for global ride-hailing. Any platform. Any driver. Every fare settled on-chain.
          </p>
          <div className="mb-5 flex max-w-[380px] flex-wrap gap-2">
            {[
              "⚙ Settlement API",
              "🛡 Audit 9.2/10",
              "⌥ GitHub",
              "↓ Downloads",
            ].map((item) => (
              <a key={item} href="#ecosystem" className="inline-flex min-h-[34px] items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 font-mono text-[11px] font-extrabold text-white/75 transition hover:-translate-y-0.5 hover:border-ptdt-pink/40 hover:bg-ptdt-pink/20 hover:text-white">
                {item}
              </a>
            ))}
          </div>
          <div className="mb-5 flex flex-wrap gap-3">
            <a href="/stake" className="btn btn-primary">Stake PTDT</a>
            <a href="#protocol" className="btn btn-dark-ghost">Explore Protocol</a>
          </div>
          <div className="flex gap-6 border-t border-white/10 pt-5">
            {["100K|Hard Cap", "60%|Fee Burned", "9.2/10|Audit Score"].map((item) => {
              const [value, label] = item.split("|");
              return (
                <div key={item}>
                  <div className="text-[clamp(20px,2.5vw,28px)] font-black leading-none tracking-[-0.04em] text-white">{value}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.05em] text-white/40">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="border-b border-black/10 bg-white shadow-[0_2px_24px_rgba(16,16,24,0.05)]">
      <div className="container grid grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, tone, icon: Icon }, index) => (
          <div key={label} className={`px-4 py-8 text-center transition hover:bg-ptdt-mist ${index < stats.length - 1 ? "lg:border-r lg:border-black/10" : ""}`}>
            <div className={`mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-ptdt-mist ${tone}`}>
              <Icon size={18} />
            </div>
            <div className={`mb-1 text-[clamp(24px,2.5vw,32px)] font-black leading-none tracking-[-0.05em] ${tone}`}>{value}</div>
            <div className="text-xs font-bold uppercase tracking-[0.04em] text-ptdt-muted">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Settlement Protocol", "BNB Chain", "60% Burned", "40% to Stakers", "Ride-Hailing", "On-Chain", "PTDT Token", "Deflationary", "9.2/10 Audit", "Staking Live"];
  const repeated = useMemo(() => [...items, ...items], []);
  return (
    <div className="overflow-hidden bg-ptdt-ink py-3 text-[13px] font-bold uppercase tracking-[0.04em] text-white/45">
      <div className="ptdt-marquee-track">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-3"><i className="h-1.5 w-1.5 rounded-full bg-ptdt-pink" />{item}</span>
        ))}
      </div>
    </div>
  );
}

function Protocol() {
  return (
    <section id="protocol" className="section bg-white">
      <div className="container grid items-center gap-14 lg:grid-cols-2 xl:gap-20">
        <div className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_30%_20%,rgba(251,11,140,0.16),transparent_34%),radial-gradient(circle_at_75%_75%,rgba(42,233,123,0.18),transparent_32%),linear-gradient(135deg,#130d20,#101018)] p-8 shadow-softCard">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px] opacity-40" />
          <div className="relative rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <div className="font-mono text-[11px] font-black uppercase tracking-[0.12em] text-ptdt-greenLight">Protocol Settlement Trace</div>
                <div className="mt-1 text-sm text-white/45">Fare → Smart Contract → Burn + Staker Pool</div>
              </div>
              <Zap className="text-ptdt-pink" />
            </div>
            <div className="grid gap-4">
              {["Fare submitted by operator", "Settlement API routes fee", "60% burned permanently", "40% distributed to stakers"].map((row, index) => (
                <div key={row} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-white/80">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ptdt-pink/20 font-mono text-[11px] text-ptdt-pink">{index + 1}</span>
                  {row}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <span className="section-tag tag-pink">Why Peether</span>
          <h2 className="section-h2">Infrastructure, <em>not an app.</em></h2>
          <p className="section-sub mb-8">PTDT is designed as settlement infrastructure for ride-hailing ecosystems. The brand can start from Pink Taxi, but the protocol layer is built for any compatible operator or mobility platform.</p>
          <ul className="grid gap-4">
            {proofPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] leading-7 text-ptdt-ink2">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-ptdt-green/25 bg-green-50 text-ptdt-green"><Check size={11} /></span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-ptdt-ink2 p-4 text-white">
            <ShieldCheck className="shrink-0 text-ptdt-greenLight" size={22} />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.08em] text-white/35">Token Contract</div>
              <div className="truncate font-mono text-xs text-white/70">0x66c6Fc5E7F99272134a52DF9E88D94eD83E89278</div>
            </div>
            <span className="rounded-full border border-ptdt-greenLight/25 bg-ptdt-greenLight/10 px-3 py-1 font-mono text-[10px] font-black text-ptdt-greenLight">VERIFIED</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tokenomics() {
  return (
    <section id="tokenomics" className="section bg-ptdt-ink text-white">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <span className="section-tag tag-green">Tokenomics</span>
          <h2 className="section-h2 !text-white">Deflationary flow with <em>real settlement logic.</em></h2>
          <p className="section-sub !text-white/45">PTDT keeps the token model simple: capped supply, transparent fee routing, burn pressure and staker distribution from protocol fees.</p>
        </div>
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tokenCards.map(({ label, value, desc, icon: Icon, card, iconTone }) => (
            <div key={label} className={`rounded-[24px] border p-6 transition hover:-translate-y-1 ${card}`}>
              <div className={`mb-5 grid h-10 w-10 place-items-center rounded-xl ${iconTone}`}><Icon size={18} /></div>
              <div className="mb-1 text-3xl font-black tracking-[-0.05em]">{value}</div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.04em] text-white/40">{label}</div>
              <p className="text-xs leading-6 text-white/35">{desc}</p>
            </div>
          ))}
        </div>
        <div className="grid overflow-hidden rounded-[28px] border border-white/10 md:grid-cols-2">
          <div className="border-white/10 bg-ptdt-pink/5 p-10 md:border-r">
            <div className="mb-4 text-[clamp(56px,8vw,88px)] font-black leading-none tracking-[-0.07em] text-ptdt-pink">60%</div>
            <h3 className="mb-2 text-xl font-black">Burned Permanently</h3>
            <p className="text-sm leading-7 text-white/40">The majority of every protocol fee is removed from circulation through the burn mechanism.</p>
          </div>
          <div className="bg-ptdt-green/5 p-10">
            <div className="mb-4 text-[clamp(56px,8vw,88px)] font-black leading-none tracking-[-0.07em] text-ptdt-greenLight">40%</div>
            <h3 className="mb-2 text-xl font-black">Distributed to Stakers</h3>
            <p className="text-sm leading-7 text-white/40">Staker rewards are positioned around protocol fee flow, not token inflation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Staking() {
  return (
    <section id="staking" className="section bg-white">
      <div className="container">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="section-tag tag-purple">Staking Tiers</span>
            <h2 className="section-h2">Stake PTDT. <em>Earn protocol yield.</em></h2>
          </div>
          <p className="section-sub md:max-w-md">Three clean lock tiers for holders who want exposure to protocol fee distribution.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.name} className={`relative overflow-hidden rounded-[24px] border border-black/10 bg-ptdt-paper p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-softCard ${tier.name === "Gold" ? "border-ptdt-pink/25 bg-gradient-to-br from-pink-50 to-white" : ""}`}>
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tier.accent}`} />
              <span className={`mb-6 inline-flex rounded-full px-3 py-1 font-mono text-[11px] font-black uppercase tracking-[0.06em] ${tier.badge}`}>{tier.name}</span>
              <div className="mb-1 text-[52px] font-black leading-none tracking-[-0.06em] text-ptdt-pink">{tier.apy}<span className="text-lg font-semibold tracking-normal text-black/40"> APY</span></div>
              <p className="mb-5 text-sm font-bold text-ptdt-muted">Minimum stake: {tier.min}</p>
              <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-ptdt-mist px-3 py-2 text-xs font-bold text-ptdt-ink2">
                <Lock size={13} /> {tier.lock} lock
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ecosystem() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <section id="ecosystem" className={`section relative overflow-hidden transition ${dark ? "ecosystem-dark bg-[linear-gradient(90deg,#030306_0%,#0b0710_10%,#111018_50%,#06110b_90%,#020403_100%)]" : "bg-[radial-gradient(circle_at_12%_16%,rgba(251,11,140,0.16),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(42,233,123,0.13),transparent_30%),linear-gradient(135deg,#fff6fb_0%,#f7fff9_48%,#f5f0ff_100%)]"}`}>
      <div className="container relative z-10">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="section-tag tag-pink">Ecosystem</span>
          <h2 className="section-h2">One protocol. <em>Multiple public surfaces.</em></h2>
          <p className="section-sub mx-auto">Dashboard, docs, explorer, staking and public developer surfaces are structured around listing readiness and protocol verification.</p>
          <div className="mt-6 inline-flex rounded-full border border-black/10 bg-white/70 p-1 shadow-softCard">
            <button type="button" onClick={() => setDark(false)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.04em] ${!dark ? "bg-gradient-to-br from-ptdt-pink to-ptdt-purple text-white" : "text-ptdt-muted"}`}>Light</button>
            <button type="button" onClick={() => setDark(true)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.04em] ${dark ? "bg-gradient-to-br from-ptdt-greenLight to-ptdt-pink text-ptdt-ink" : "text-ptdt-muted"}`}>Dark</button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ecosystem.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActive(item.name)}
              className={`ptdt-eco-card ${item.glow} ${active === item.name ? "is-expanded" : ""}`}
            >
              <span className="ptdt-eco-icon">{item.icon}</span>
              <span className="ptdt-eco-name">{item.name}</span>
              <span className="ptdt-eco-sub">{item.sub}</span>
            </button>
          ))}
        </div>
        <div className="mt-10 rounded-[28px] border border-ptdt-pink/20 bg-white/90 p-8 shadow-softCard backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="font-mono text-[11px] font-black uppercase tracking-[0.12em] text-ptdt-pink">Selected Surface</div>
              <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ptdt-ink">{active}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-ptdt-muted">This section is ready to connect each ecosystem card to a dedicated Astro page, React island, or static verification surface.</p>
            </div>
            <a href="/dashboard" className="btn btn-primary">Open Surface <ArrowRight size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section id="roadmap" className="section bg-white">
      <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <span className="section-tag tag-gray">Roadmap</span>
          <h2 className="section-h2">From Pink Taxi to <em>global protocol.</em></h2>
          <p className="section-sub">The website rebuild should make PTDT feel like an infrastructure protocol from the first fold: clean, verifiable, fast and listing-ready.</p>
        </div>
        <div className="relative pl-9 before:absolute before:left-2.5 before:top-2 before:h-full before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-ptdt-pink before:via-ptdt-purple before:to-ptdt-green">
          {roadmap.map((item) => (
            <div key={item.title} className="relative mb-8 last:mb-0">
              <span className="absolute -left-[38px] top-1 h-5 w-5 rounded-full border-[3px] border-white bg-current shadow-[0_0_0_2px_currentColor]" />
              <div className={`mb-1 font-mono text-[10px] font-black uppercase tracking-[0.08em] ${item.tone}`}>{item.status}</div>
              <h3 className="mb-1 text-lg font-black tracking-[-0.02em] text-ptdt-ink">{item.title}</h3>
              <p className="text-sm leading-7 text-ptdt-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <footer className="bg-ptdt-ink px-4 py-16 text-white">
      <div className="container rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(251,11,140,0.24),transparent_34%),radial-gradient(circle_at_82%_42%,rgba(42,233,123,0.18),transparent_34%),rgba(255,255,255,0.04)] p-8 text-center shadow-softCard md:p-12">
        <Sparkles className="mx-auto mb-5 text-ptdt-pink" size={30} />
        <h2 className="mx-auto mb-4 max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-[-0.05em]">PTDT is infrastructure, not an application.</h2>
        <p className="mx-auto mb-8 max-w-2xl text-white/55">The token is the fuel. The API is the engine. The protocol is the settlement layer.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/developers" className="btn btn-primary">Developer Docs</a>
          <a href="https://github.com/pinkpeether" target="_blank" rel="noreferrer" className="btn btn-dark-ghost"><Github size={16} /> GitHub</a>
        </div>
      </div>
    </footer>
  );
}

export default function PTDTHomepage() {
  return (
    <div className="min-h-screen bg-white font-sans text-ptdt-ink">
      <Announcement />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <StatsBar />
        <Protocol />
        <Tokenomics />
        <Staking />
        <Ecosystem />
        <Roadmap />
        <FooterCTA />
      </main>
    </div>
  );
}
