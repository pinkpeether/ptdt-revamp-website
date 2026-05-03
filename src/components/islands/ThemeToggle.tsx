import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("ptdt-theme");
    const isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ptdt-theme", next ? "dark" : "light");
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      width:38, height:38, borderRadius:"50%", background:"#f6f4f8",
      border:"1px solid rgba(16,16,24,0.08)", display:"grid", placeItems:"center",
      cursor:"pointer", color:"#706a7d", transition:"background 0.2s",
    }}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
