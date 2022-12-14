import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './header.module.css';
import { useDisconnect } from 'wagmi';

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect();
  const loading = status === 'loading';

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p className={`nojs-show ${!session && loading ? styles.loading : styles.loaded}`}>
          {!session && (
            <>
              <span className={styles.notSignedInText}>You are not signed in</span>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span style={{ backgroundImage: `url('${session.user.image}')` }} className={styles.avatar} />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                // href={`/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault();
                  disconnect();
                  signOut();
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href='/'>
              <a>Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href='/auth/signin'>
              <a>SIWE - "Sign In With Ethereum" - RainbowKit</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href='/protected'>
              <a>Protected Path Example - client-side </a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href='/rainbow-protected'>
              <a>Protected Path Example - server-side </a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}