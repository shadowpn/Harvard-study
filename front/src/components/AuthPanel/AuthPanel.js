'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AuthPanel.module.css';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function AuthPanel() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? `${BASE_URL}/login/`
      : `${BASE_URL}/register/`;

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password
        }
      : {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('❌ Ответ не JSON:', text);
        alert('Invalid server response. Try again later.');
        return;
      }

      if (res.ok) {
        if (isLogin) {
          // ✅ Сохраняем токены
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);

          // ✅ Получаем userData
          try {
            const resUser = await fetch(`${BASE_URL}/user/`, {
              headers: {
                Authorization: `Bearer ${data.access}`
              }
            });

            if (resUser.ok) {
              const user = await resUser.json();
              localStorage.setItem('userData', JSON.stringify(user));
            }
          } catch (e) {
            console.warn('Cant came is userData:', e);
          }

          router.push('/dashboard');
        } else {
          alert('Registration successful! Please log in.');
          setIsLogin(true);
        }
      } else {
        console.log('❌ Error in login or password:', data);
        alert(data.detail || data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error');
    }
  };

  return (
    <div className={`${styles.wrapper}`}> 
      <div className={styles.panel}>
        <div
          className={`${styles.quarterCircle} ${
            isLogin ? styles.topLeft : styles.bottomRight
          }`}
        >
          <h2 className={`${styles.heading} ${!isLogin ? styles.rotated : ''}`}>
            {isLogin ? 'Welcome' : 'Join with us'}
          </h2>
        </div>

        <div
          className={`${styles.formBlock} ${
            isLogin ? styles.rightForm : styles.leftForm
          }`}
        >
          <h3>{isLogin ? 'Login to StudyHub' : 'Register for StudyHub'}</h3>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  className={styles.input}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  className={styles.input}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  className={styles.input}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.button}>
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <p className={styles.switch}>
            {isLogin ? (
              <>
                Don’t have an account?{' '}
                <span onClick={() => setIsLogin(false)}>Sign up here</span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span onClick={() => setIsLogin(true)}>Sign in here</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
