'use client';

import * as React from 'react';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUser, login } from '~/lib/actions';
import './page.scss';

type SignupForm = {
  email: string;
  password1: string;
  password2: string;
};

const specialCharacters = '!@#\\$%\\^&\\*\\(\\)_\\-=\\+\\[\\]\\{\\};:\'"\\\\|,.<>\\/?~';

export default function Page() {
  const [form, setForm] = React.useState<SignupForm>({
    email: '',
    password1: '',
    password2: '',
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [passwordComplexity, setPasswordComplexity] = React.useState<{
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    length: boolean;
  }>({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    length: false,
  });

  const router = useRouter();

  React.useEffect(() => {
    if (form.password1) {
      setPasswordComplexity({
        uppercase: /[A-Z]/.test(form.password1),
        lowercase: /[a-z]/.test(form.password1),
        number: /\d/.test(form.password1),
        special: new RegExp(`[${specialCharacters}]`).test(form.password1),
        length: form.password1.length >= 8,
      });
    } else {
      setPasswordComplexity({
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        length: false,
      });
    }
  }, [form.password1]);

  const passwordComplexityMet = () => Object.values(passwordComplexity).every((v) => v);

  const formInvalid = () => {
    return !form.email || !form.password1 || form.password1 !== form.password2 || !passwordComplexityMet();
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

    try {
      const str = await createUser(form.email, form.password1, form.password2);
      await login(form.email, form.password1);
      router.push('/verify');
    } catch (err: any) {
      setError(err.message);
      setForm((p) => ({ ...p, password1: '', password2: '' }));
    } finally {
      setLoading(false);
    }
  };

  function renderPasswordInfo() {
    const renderItem = (valid: boolean, text: string) => (
      <p
        className={clsx('AuthSignup__passwordComplexity__item', {
          'AuthSignup__passwordComplexity__item--valid': valid,
        })}
      >
        {valid ? <CheckIcon /> : <Cross2Icon />} {text}
      </p>
    );

    return (
      <div className="AuthSignup__passwordInfo">
        <p className="AuthSignup__passwordInfo__message mb-2">
          Passwords must have at least 8 characters and must contain at least one uppercase letter, one lowercase
          letter, one number, and one special character.
        </p>
        <div className="AuthSignup__passwordComplexity">
          {renderItem(passwordComplexity.lowercase, 'Lowercase')}
          {renderItem(passwordComplexity.uppercase, 'Uppercase')}
          {renderItem(passwordComplexity.number, 'Number')}
          {renderItem(passwordComplexity.special, 'Special character')}
          {renderItem(passwordComplexity.length, 'Length')}
        </div>
      </div>
    );
  }

  return (
    <div className="AuthSignup">
      <h2 className='mb-8'>Sign Up</h2>
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
          {/* <p>{!passwordComplexityMet() ? 'Password not complex' : 'Password Complex'}</p> */}
          {renderPasswordInfo()}
        </div>
        {error && <div className="AuthSignup__error">{error}</div>}
        <button type="submit" className="AuthSignup__button" disabled={loading || formInvalid()}>
          {loading ? 'Submitting...' : 'Continue'}
        </button>
      </form>
      <div className="flex align-center gap-2 mt-4">
        <p className="text-size-s text-color-600">Already have an account?</p>
        <Link className="text-size-s" href="/login">
          Log in
        </Link>
      </div>
    </div>
  );
}
