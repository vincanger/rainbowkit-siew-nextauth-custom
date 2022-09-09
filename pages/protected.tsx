import { useState, useEffect } from 'react';
import Layout from '../components/layout';
import AccessDenied from '../components/access-denied';

//client-side data fetching https://nextjs.org/docs/basic-features/data-fetching/client-side
export default function ProtectedPage() {
  const [address, setAddress] = useState();
  
  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/examples/jwt');
      const token = await res.json();
      if (token) {
        setAddress(token.sub);
      }
    };
    fetchData();
  }, []);

  // If no address exists, display access denied message
  if (!address) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  // If address exists, display content
  return (
    <Layout>
      <h2>Protected Page</h2>
      <p>
        This protected page calls an endpoint on the server from the client-side to retrieve the JWT.
        <br />
        You need to manually setup an endpoint on your server for this to work.
      </p>
      <code style={{ background: '#D3D3D3' }}>{`const res = await fetch("/api/examples/jwt")`}</code>
      {}
      <p>
        <strong>{address && 'Authenticated as: ' + address}</strong>
      </p>
    </Layout>
  );
}
