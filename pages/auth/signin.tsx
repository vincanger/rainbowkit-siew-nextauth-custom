import React from 'react';
import Layout from '../../components/layout';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from 'next/router';

function Siwe() {
  const [query, setQuery] = React.useState<ParsedUrlQuery>({});
  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      setQuery(router.query);
    }
  }, [router.isReady]);

  return (
    <Layout>
      <div style={{ margin: '1rem' }}>
        <ConnectButton
          label={'Sign in with Ethereum'}
          accountStatus={'full'}
          chainStatus={'icon'}
          showBalance={false}
          />
          {query.error && (
            <p style={{color: 'red'}}>Woh there, partner. Try signing again</p>
          )}
      </div>
    </Layout>
  );
}

Siwe.Layout = Layout;

export default Siwe;
