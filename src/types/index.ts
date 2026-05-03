export type StakingTier = "bronze" | "silver" | "gold";

export interface TierConfig {
  id:        StakingTier;
  label:     string;
  apy:       number;       // e.g. 12
  minStake:  number;       // PTDT
  lockDays:  number;
  color:     string;       // CSS color
}

export const TIER_CONFIGS: TierConfig[] = [
  { id:"bronze", label:"Bronze", apy:12, minStake:10,  lockDays:30, color:"#cd7f32" },
  { id:"silver", label:"Silver", apy:15, minStake:100, lockDays:60, color:"#94a3b8" },
  { id:"gold",   label:"Gold",   apy:18, minStake:500, lockDays:90, color:"#fb0b8c" },
];

export interface AuthView {
  mode: "signin" | "signup" | "forgot";
}
