import { createAuthenticationAdapter, RainbowKitAuthenticationProvider } from '@rainbow-me/rainbowkit';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { SiweMessage } from 'siwe';

interface RainbowKitSiweNextAuthProviderProps {
  enabled?: boolean;
  children: ReactNode;
}

export default function RainbowKitSiweNextAuthProvider({ children, enabled }: RainbowKitSiweNextAuthProviderProps) {
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
    verify: async ({ message, signature }) => {
      const response = await signIn('credentials', {
        message: JSON.stringify(message),
        signature, 
        // redirect: false,
        callbackUrl: window.location.origin + '/rainbow-protected',
      });
      return response?.ok ?? false;
    },
    signOut: async () => {
      await fetch('/siwe');
    },
  });

  return (
    <RainbowKitAuthenticationProvider adapter={authAdapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
}
