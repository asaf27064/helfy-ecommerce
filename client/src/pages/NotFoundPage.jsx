import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Container from '../components/layout/Container';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-7xl font-black text-primary-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
        <p className="mt-2 text-slate-400">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="btn-primary mt-6">Back to shop</Link>
      </Container>
    </PageTransition>
  );
}
