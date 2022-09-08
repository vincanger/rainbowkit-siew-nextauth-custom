import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import React from 'react';
import Layout from '../components/layout';
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

export default function AuthenticatedPage({ address }: AuthenticatedPageProps) {
  return (
    <Layout>
      {address ? (
        <>
          <p>
            we can pull the session and address within JWT from getServerSideProps. If a JWT with address is found,
            authorization to sub-page is granted.
          </p>
          <code style={{ background: '#D3D3D3' }}>{`const session = await getSession(context);`}</code>
          <br />
          <code style={{ background: '#D3D3D3' }}>{`const token = await getToken({ req: context.req });`}</code>
          <h1>Authenticated as {address}</h1>
        </>
      ) : (
        <h1>unauthenticated sadness :(</h1>
      )}
    </Layout>
  );
}
