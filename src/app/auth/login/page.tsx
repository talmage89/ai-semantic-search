import './page.scss';

type LoginForm = {
  email: string;
  password: string;
};

export default function Page() {
  const submitForm = async (formData: FormData) => {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log({ email, password });
  };

  return (
    <div className="AuthLogin">
      <h2>Log In</h2>
      <form className="AuthLogin__form" autoComplete="off" action={submitForm}>
        <div className="flex flex-column gap-4 w-100">
          <div className="AuthLogin__formGroup">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" required />
          </div>
          <div className="AuthLogin__formGroup">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required />
          </div>
        </div>
        <button type="submit" className="AuthLogin__button">
          Continue
        </button>
      </form>
    </div>
  );
}
