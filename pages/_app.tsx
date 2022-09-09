import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import './styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { RainbowKitProvider, connectorsForWallets, wallet } from '@rainbow-me/rainbowkit';
import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import RainbowKitCustomAuthProvider from '../components/auth-adapter';
import { alchemyProvider } from 'wagmi/providers/alchemy';

// for use with the default RainbowKitSiweNextAuthProvider, NOT with custom authentication adapter
// const getSiweMessageOptions: GetSiweMessageOptions = () => ({
//   statement: 'custom SIWE-RainbowKit message:)',
// });

const { chains, provider } = configureChains(
  [chain.polygon, chain.mainnet],
  [alchemyProvider({ apiKey: '<YOUR-API-KEY>' })]
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
        {/* <RainbowKitSiweNextAuthProvider> */}
        <RainbowKitCustomAuthProvider>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitCustomAuthProvider>
        {/* </RainbowKitSiweNextAuthProvider> */}
      </SessionProvider>
    </WagmiConfig>
  );
}
