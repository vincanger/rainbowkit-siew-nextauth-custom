import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import React from 'react';
import Layout from '../components/layout';
import AccessDenied from '../components/access-denied';

// server-side data fetching https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });
  const address = token?.sub ?? null;
  // If you have a value for "address" here, your
  // server knows the user is authenticated.
  // You can then pass any data you want
  // to the page component here.
  return {
    props: {
      address,
      session,
    },
  };
};

type AuthenticatedPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function AuthenticatedPage({ address, session }: AuthenticatedPageProps) {
  React.useEffect(() => {
    console.log('session: ', session);
    console.log('token.sub: ', address);
  }, []);

  if (!address) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }
  return (
    <Layout>
      <h2>Protected Page</h2>
      <p>
        This page fetches the data server-side via getServerSideProps. <br />
        If a session with a JWT with address is found, authorization to sub-page is granted.
      </p>
      <code style={{ background: '#D3D3D3' }}>{`const session = await getSession(context);`}</code>
      <br />
      <code style={{ background: '#D3D3D3' }}>{`const token = await getToken({ req: context.req });`}</code>
      <p>
        <strong>Authenticated as: {address}</strong>
      </p>
    </Layout>
  );
}
