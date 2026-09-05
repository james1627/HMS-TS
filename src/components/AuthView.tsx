import type { SubmitEvent } from 'react';
import Field from './Field';

export default function AuthView({
  register,
  onLogin,
  onRegister,
}: {
  register: boolean;
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
}) {
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    register
      ? onRegister(
          String(data.get('name')),
          String(data.get('email')),
          String(data.get('password')),
        )
      : onLogin(String(data.get('email')), String(data.get('password')));
  };
  return (
    <main className="auth-page">
      <section className="auth-card fade-in">
        <div className="brand-mark">PV</div>
        <h1>{register ? 'Create Account' : 'ProjectVault'}</h1>
        <p>
          {register ? 'Start managing your projects today' : 'Manage projects, prices & receipts'}
        </p>
        <form onSubmit={submit} className="form-stack">
          {register && <Field label="Full Name *" name="name" placeholder="John Doe" />}
          <Field
            label="Email *"
            name="email"
            type="email"
            placeholder="you@example.com"
            defaultValue={register ? undefined : 'demo@projectvault.com'}
          />
          <Field
            label="Password *"
            name="password"
            type="password"
            placeholder="••••••••"
            minLength={6}
            defaultValue={register ? undefined : 'demo123'}
          />
          <button className="button primary" type="submit">
            {register ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        {!register && (
          <div className="demo-note">
            <strong>Demo:</strong> demo@projectvault.com / demo123
          </div>
        )}
        <p className="auth-switch">
          {register ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth'))}>
            {register ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </section>
    </main>
  );
}
