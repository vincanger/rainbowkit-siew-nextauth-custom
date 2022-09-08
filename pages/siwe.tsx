import React from 'react';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { useConnect, useSignMessage, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import Layout from '../components/layout';

import { ConnectButton } from '@rainbow-me/rainbowkit';

function Siwe() {
  const [isSignedIn, setSignedIn] = React.useState<boolean>(false);
  const { data: connectData, connectAsync } = useConnect({ connector: new InjectedConnector() });
  const { signMessageAsync } = useSignMessage();
  const { data: session } = useSession();

  React.useEffect(() => {
    session?.user ? setSignedIn(true) : setSignedIn(false);
  }, [session]);

  // This is the logic we need to configure for Wagmi/Ethers
  // it's a lot more, but we can configure messages and redirect/callbackURLs directly
  const handleLogin = async () => {
    try {
      const res = await connectAsync({ connector: new InjectedConnector({ chains: [chain.mainnet, chain.polygon]}), chainId: 137 });
      const nonce = await getCsrfToken();
      const callbackUrl = '/protected'; // redirect path. you can also change this to /rainbow-protected
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.account,
        statement: 'SIWE via Ethers/Wagmi!',
        uri: window.location.origin,
        version: '1',
        chainId: res.chain.id,
        nonce,
      });
      const signature = await signMessageAsync({ message: message.prepareMessage() });
      const signedInInfo = await signIn('credentials', {
        message: JSON.stringify(message),
        redirect: true, // true to redirect automatically to callbackUrl path
        signature,
        callbackUrl,
      });
      console.log('signedInfo: ', signedInInfo)
      signedInInfo?.status == 200 && setSignedIn(true);
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <Layout>
      <div style={{ margin: '1rem' }}>
        <span>this is the Wagmi/Ethers implementation: </span>
        <br/>
        {!isSignedIn ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin();``
            }}
          >
            'Sign-In with Ethereum'
          </button>
        ) : (
          <span>
            <em>You're signed in. Bill Murray is proud of you!</em>
          </span>
        )}
      </div>
      <div style={{ margin: '1rem' }}>
        <span>and this is the RainbowKit implementation</span>
        <ConnectButton 
          label={'Sign in with Ethereum'}
          accountStatus={'full'}
          chainStatus={'icon'}
          showBalance={false}
        />
      </div>
    </Layout>
  );
}

Siwe.Layout = Layout;

export default Siwe;
