import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('demo@helfy.shop');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(location.state?.from ?? '/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Container className="flex min-h-[70vh] items-center justify-center py-12">
        <div className="card w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="mt-1 text-sm text-slate-400">Welcome back to Helfy Shop.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" loading={loading} className="w-full">Sign in</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            No account?{' '}
            <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300">Create one</Link>
          </p>
          <p className="mt-4 rounded-lg bg-slate-800/60 px-3 py-2 text-center text-xs text-slate-400">
            Demo: demo@helfy.shop / Password123!
          </p>
        </div>
      </Container>
    </PageTransition>
  );
}
