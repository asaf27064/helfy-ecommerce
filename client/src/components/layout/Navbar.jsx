import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from './Container';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 shadow-glow">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Helfy<span className="text-primary-400">Shop</span></span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/" className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-primary-400' : 'text-slate-300 hover:text-white'}`
          }>
            Shop
          </NavLink>
          {user && (
            <NavLink to="/account" className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-primary-400' : 'text-slate-300 hover:text-white'}`
            }>
              Account
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative rounded-xl p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white" aria-label="Cart">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1 text-xs font-bold text-white"
              >
                {count}
              </motion.span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-400 md:block">Hi, {user.firstName || 'there'}</span>
              <button onClick={handleLogout} className="btn-ghost !px-3 !py-2 text-sm">Log out</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !px-4 !py-2 text-sm">Sign in</Link>
          )}
        </div>
      </Container>
    </header>
  );
}
