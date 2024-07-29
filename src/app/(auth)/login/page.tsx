'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '~/lib/actions';
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
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const router = useRouter();

  const formInvalid = () => {
    return !form.email || !form.password;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(form.email, form.password);
      router.push('/verify');
    } catch (err: any) {
      setError(err.message);
      setForm((p) => ({ ...p, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AuthLogin">
      <h2 className="mb-8">Log In</h2>
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
        {error && <div className="AuthLogin__error">{error}</div>}
        <button type="submit" className="AuthLogin__button" disabled={loading || formInvalid()}>
          {loading ? 'Verifying...' : 'Continue'}
        </button>
      </form>
      <div className="flex align-center gap-2 mt-4">
        <p className="text-size-s text-color-600">Don't have an account yet?</p>
        <Link className="text-size-s" href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
