import { createConfig, http } from "wagmi";
import { bsc } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "@wagmi/connectors";

const projectId = import.meta.env.PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const wagmiConfig = createConfig({
  chains: [bsc],
  connectors: [
    injected(),                                          // MetaMask / Trust Wallet
    walletConnect({ projectId }),                        // WalletConnect v2
    coinbaseWallet({ appName: "Peether PTDT" }),
  ],
  transports: {
    [bsc.id]: http(import.meta.env.PUBLIC_BSC_RPC_URL ?? "https://bsc-dataseed.binance.org/"),
  },
});
