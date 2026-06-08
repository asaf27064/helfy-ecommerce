import Container from './Container';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 py-10">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Helfy Shop — Premium Health &amp; Wellness.</p>
        <p>Built as an AI-orchestrated demo. Payments are mocked.</p>
      </Container>
    </footer>
  );
}
