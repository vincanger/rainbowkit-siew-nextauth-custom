import React from 'react';
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { useConnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import Layout from '../components/layout';

function Siwe() {
  const [isSignedIn, setSignedIn] = React.useState<boolean>(false);
  const { connectAsync } = useConnect({ connector: new InjectedConnector() });
  const { signMessageAsync } = useSignMessage();
  const { data: session } = useSession();

  React.useEffect(() => {
    console.log(isSignedIn, 'is signed in !??!');
    console.log('session [][][]: ', session);
    session?.user ? setSignedIn(true) : '';
  }, [session]);

  const handleLogin = async () => {
    try {
      const res = await connectAsync();
      const nonce = await getCsrfToken();
      const callbackUrl = '/protected';
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.account,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: res.chain.id,
        nonce,
      });
      const signature = await signMessageAsync({ message: message.prepareMessage() });
      const signedInInfo = await signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
      signedInInfo?.status == 200 && setSignedIn(true);
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <Layout>
      {!isSignedIn ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          'Sign-In with Ethereum'
        </button>
      ) : (
        <span>Bill Murray is Proud of You</span>
      )}
    </Layout>
  );
}

Siwe.Layout = Layout;

export default Siwe;
