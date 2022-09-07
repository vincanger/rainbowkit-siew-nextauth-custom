import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import './styles.css';
import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { providers } from 'ethers';

const { chains, provider } = configureChains(
  [chain.localhost],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: 'http://localhost:8545',
      }),
    }),
    // jsonRpcProvider({
    //   priority: 0,
    //   rpc: (chain) => ({
    //     http: 'https://white-snowy-breeze.matic-testnet.discover.quiknode.pro/7677ba3e0b8940a9866fbecc159fb7efe2445d3e/',
    //   }),
    // }),
    // alchemyProvider({ alchemyId: '5i38PznIJoCxXZLaD0d2wU28aXQrwpP-', priority: 1 }),
  ]
);

// const localhostProvider = new providers.JsonRpcProvider('http://localhost:8545', {
//   name: 'dev',
//   chainId: 1337,
//   ensAddress: undefined,
// });

// Give wagmi our provider config and allow it to autoconnect wallet
const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider: provider,
});

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Component {...pageProps} />
      </SessionProvider>
    </WagmiConfig>
  );
}
