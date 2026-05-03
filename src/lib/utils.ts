import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(addr: string, chars = 4): string {
  return `${addr.slice(0, chars + 2)}…${addr.slice(-chars)}`;
}

export function formatPTDT(value: bigint, decimals = 18): string {
  const n = Number(value) / 10 ** decimals;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}
