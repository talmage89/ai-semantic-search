'use client';

import * as React from 'react';
import { createUser } from '~/actions/auth-actions';
import { sendVerificationEmail } from '~/actions/email-actions';
import { ActionResponse, ActionResponseStatus } from '~/actions/class';
import './page.scss';
import { User } from '@prisma/client';

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const formInvalid = () => {
    return !form.email || !form.password1 || !form.password2;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password1 !== form.password2) {
      setError('Passwords do not match');
      setForm((p) => ({ ...p, password1: '', password2: '' }));
      return;
    }
    setError(null);
    setLoading(true);
    createUser(form.email, form.password1, form.password2)
      .then((str) => {
        const res = ActionResponse.fromJSON<User>(str);
        if (res.type === ActionResponseStatus.ERROR) {
          setError(res.message);
          setForm((p) => ({ ...p, password1: '', password2: '' }));
          return;
        }
      })
      .finally(() => setLoading(false));
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
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="AuthSignup__formGroup">
            <label htmlFor="password1">Password</label>
            <input
              type="password"
              id="password1"
              value={form.password1}
              onChange={(e) => setForm((p) => ({ ...p, password1: e.target.value }))}
            />
          </div>
          <div className="AuthSignup__formGroup">
            <label htmlFor="password">Retype Password</label>
            <input
              type="password"
              id="password2"
              value={form.password2}
              onChange={(e) => setForm((p) => ({ ...p, password2: e.target.value }))}
            />
          </div>
        </div>
        {error && <div className="AuthSignup__error">{error}</div>}
        <button type="submit" className="AuthSignup__button" disabled={loading || formInvalid()}>
          {loading ? 'Submitting...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
