import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Container from '../components/layout/Container';
import Price from '../components/ui/Price';
import QuantityStepper from '../components/ui/QuantityStepper';
import EmptyState from '../components/ui/EmptyState';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, subtotal, update, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goCheckout = () => {
    if (!user) navigate('/login', { state: { from: '/checkout' } });
    else navigate('/checkout');
  };

  return (
    <PageTransition>
      <Container className="py-10">
        <h1 className="mb-8 text-3xl font-bold text-white">Your Cart</h1>

        {items.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            subtitle="Browse our catalog and add some wellness essentials."
            action={<Link to="/" className="btn-primary">Start shopping</Link>}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div key={item.productId} className="card flex items-center gap-4 p-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/products/${item.productId}`} className="font-semibold text-white hover:text-primary-300">{item.name}</Link>
                    <div className="mt-1"><Price value={item.price} className="text-sm text-slate-400" /></div>
                    <button onClick={() => remove(item)} className="mt-2 text-xs text-slate-500 hover:text-red-400">Remove</button>
                  </div>
                  <QuantityStepper value={item.quantity} onChange={(q) => update(item, q)} />
                  <Price value={item.price * item.quantity} className="w-20 text-right font-bold text-white" />
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card sticky top-24 space-y-4 p-6">
                <h2 className="text-lg font-semibold text-white">Summary</h2>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span><Price value={subtotal} />
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Shipping</span><span>{subtotal >= 50 ? 'Free' : '$5.99'}</span>
                </div>
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-base font-bold text-white">
                    <span>Estimated total</span>
                    <Price value={subtotal + (subtotal >= 50 ? 0 : 5.99) + subtotal * 0.08} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Taxes calculated at checkout.</p>
                </div>
                <button onClick={goCheckout} className="btn-primary w-full">Proceed to checkout</button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </PageTransition>
  );
}
