'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import './page.scss';

type LoginForm = {
  email: string;
  password: string;
};

export default function Page() {
  const [form, setForm] = React.useState<LoginForm>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn('credentials', form).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className="AuthLogin">
      <h2>Log In</h2>
      <form className="AuthLogin__form" autoComplete="off" onSubmit={handleSubmit}>
        <div className="flex flex-column gap-4 w-100">
          <div className="AuthLogin__formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="AuthLogin__formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </div>
        </div>
        <button type="submit" className="AuthLogin__button">
          Continue
        </button>
      </form>
    </div>
  );
}
