import Link from "next/link"
import styles from "./footer.module.css"
import packageJSON from "../package.json"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href='https://docs.login.xyz/'>SIWE</a>
        </li>
        <li className={styles.navItem}>
          <a href='https://next-auth.js.org'>NextAuth</a>
        </li>
        <li className={styles.navItem}>
          <a href='https://www.rainbowkit.com/'>RainbowKit</a>
        </li>
        <li className={styles.navItem}>
          <a href='https://wagmi.sh/'>Wagmi</a>
        </li>
        <li className={styles.navItem}>
          <Link href='/policy'>
            <a>Policy</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <em>next-auth@{packageJSON.dependencies['next-auth']}</em>
        </li>
        <li className={styles.navItem}>
          <em>wagmi@{packageJSON.dependencies['wagmi']}</em>
        </li>
        <li className={styles.navItem}>
          {/* @ts-ignore*/}
          <em>rainbow-kit-siwe@{packageJSON.dependencies['@rainbow-me/rainbowkit']}</em>
        </li>
      </ul>
    </footer>
  );
}
