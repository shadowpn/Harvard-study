"use client";
import { useState } from "react";
import styles from "./auth.module.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.toggle}>
        <button onClick={() => setIsLogin(true)} className={isLogin ? styles.active : ""}>Login</button>
        <button onClick={() => setIsLogin(false)} className={!isLogin ? styles.active : ""}>Register</button>
      </div>
      
      {isLogin ? (
        <form className={styles.form}>
          <h2>Login to StudyHub</h2>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form className={styles.form}>
          <h2>Register for StudyHub</h2>
          <input type="text" placeholder="First Name" required />
          <input type="text" placeholder="Last Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
}
