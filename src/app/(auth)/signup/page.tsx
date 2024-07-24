'use client';

import * as React from 'react';
import { createUser } from '~/actions/auth-actions';
import './page.scss';
import { sendVerificationEmail } from '~/actions/email-actions';

type SignupForm = {
  email: string;
  password1: string;
  password2: string;
};

export default function Page() {
  const [form, setForm] = React.useState<SignupForm>({
    email: '',
    password1: '',
    password2: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password1 !== form.password2) {
      return;
    }

    const user = await createUser(form.email, form.password1, form.password2);

    if (!user) {
      alert('Failed to create user');
      return;
    }

    sendVerificationEmail(user.email, user.emailValidationToken);
  };

  return (
    <div className="AuthSignup">
      <h2>Sign Up</h2>
      <form className="AuthSignup__form" autoComplete="off" onSubmit={handleSubmit}>
        <div className="flex flex-column gap-4 w-100">
          <div className="AuthSignup__formGroup">
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
          <div className="AuthSignup__formGroup">
            <label htmlFor="password1">Password</label>
            <input
              type="password"
              id="password1"
              required
              value={form.password1}
              onChange={(e) => setForm((p) => ({ ...p, password1: e.target.value }))}
            />
          </div>
          <div className="AuthSignup__formGroup">
            <label htmlFor="password">Retype Password</label>
            <input
              type="password"
              id="password2"
              required
              value={form.password2}
              onChange={(e) => setForm((p) => ({ ...p, password2: e.target.value }))}
            />
          </div>
        </div>
        <button type="submit" className="AuthSignup__button">
          Continue
        </button>
      </form>
    </div>
  );
}
