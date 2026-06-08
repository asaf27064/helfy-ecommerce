import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Container from '../components/layout/Container';
import Price from '../components/ui/Price';
import QuantityStepper from '../components/ui/QuantityStepper';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { productsApi } from '../api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { add } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    productsApi.get(id)
      .then((d) => { setProduct(d.product); setActive(0); setQty(1); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    try {
      await add(product, qty);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-16">
        <EmptyState title="Product not found" action={<Link to="/" className="btn-primary">Back to shop</Link>} />
      </Container>
    );
  }

  const images = product.images?.length ? product.images : [{ url: product.primaryImage, alt: product.name }];

  return (
    <PageTransition>
      <Container className="py-10">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-slate-400 hover:text-white">← Back</button>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="card overflow-hidden">
              <img src={images[active]?.url} alt={images[active]?.alt ?? product.name} className="aspect-square w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${i === active ? 'border-primary-500' : 'border-slate-800'}`}>
                    <img src={img.url} alt={img.alt ?? ''} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.categoryName && (
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-400">{product.categoryName}</span>
            )}
            <h1 className="mt-2 text-3xl font-bold text-white">{product.name}</h1>
            <Price value={product.price} className="mt-3 block text-2xl font-bold text-primary-300" />
            <p className="mt-6 leading-relaxed text-slate-400">{product.description}</p>

            <div className="mt-6 text-sm">
              {product.stockQuantity > 0
                ? <span className="text-primary-400">● In stock ({product.stockQuantity} available)</span>
                : <span className="text-red-400">● Out of stock</span>}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, product.stockQuantity)} />
              <Button onClick={handleAdd} disabled={product.stockQuantity <= 0} className="flex-1">Add to cart</Button>
            </div>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}
