import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import './styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { RainbowKitProvider, connectorsForWallets, wallet } from '@rainbow-me/rainbowkit';
import RainbowKitCustomAuthProvider from '../components/auth-adapter';
import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';

// for use with the RainbowKitSiweNextAuthProvider, NOT with custom authentication adapter
// const getSiweMessageOptions: GetSiweMessageOptions = () => ({
//   statement: 'SIWE via RainbowKit :)',
// });

const { chains, provider } = configureChains(
  [chain.polygon, chain.mainnet],
  [
    alchemyProvider({ apiKey: '5i38PznIJoCxXZLaD0d2wU28aXQrwpP-', priority: 0 }),
    jsonRpcProvider({
      priority: 1,
      rpc: (chain) => ({
        http: 'https://white-snowy-breeze.matic-testnet.discover.quiknode.pro/7677ba3e0b8940a9866fbecc159fb7efe2445d3e/',
      }),
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.metaMask({ chains }),
      wallet.rainbow({ chains }),
      wallet.walletConnect({ chains }),
      wallet.coinbase({
        appName: 'SIWE Example',
        chains,
      }),
      wallet.ledger({
        chains,
      }),
    ],
  },
]);

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <RainbowKitCustomAuthProvider>
        {/* <RainbowKitSiweNextAuthProvider> */}
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        {/* </RainbowKitSiweNextAuthProvider> */}
        </RainbowKitCustomAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
