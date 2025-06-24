import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>🎓 Sense StudyHub</div>
      <nav>
        <Link href="/auth">Login / Register</Link>
      </nav>
    </header>
  );
}
