import { createAuthenticationAdapter, RainbowKitAuthenticationProvider } from '@rainbow-me/rainbowkit';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { SiweMessage } from 'siwe';

interface RainbowKitSiweNextAuthProviderProps {
  enabled?: boolean;
  children: ReactNode;
}

export default function authAdapter({ children, enabled }: RainbowKitSiweNextAuthProviderProps) {
  const { status } = useSession();
  const authAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const response = await getCsrfToken();
      return response ?? '';
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'SIWE via Custom Rainbowkit Auth',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: ({ message, signature }) => {
      signIn('credentials', {
        message: JSON.stringify(message),
        signature, // <-- comment this out to throw an error & reach the error page ./pages/auth/signin.tsx
        redirect: true,
        callbackUrl: window.location.origin + '/rainbow-protected',
      });
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
    signOut: async () => {
      await fetch('/api/auth/signout');
    },
  });

  return (
    <RainbowKitAuthenticationProvider adapter={authAdapter} enabled={enabled} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
}
