import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import Container from '../components/layout/Container';
import Price from '../components/ui/Price';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { ordersApi } from '../api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { items, subtotal, reload } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [shipping, setShipping] = useState({
    name: '', street1: '', street2: '', city: '', state: '', postalCode: '', country: '',
  });

  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shippingCost + tax;

  const set = (k) => (e) => setShipping((s) => ({ ...s, [k]: e.target.value }));
  const shippingValid = shipping.name && shipping.street1 && shipping.city && shipping.postalCode && shipping.country;

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { order } = await ordersApi.create(shipping);
      await reload();
      toast.success('Order placed successfully!');
      navigate('/account', { state: { highlightOrder: order.id } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState icon="🛒" title="Nothing to check out" subtitle="Your cart is empty."
          action={<Link to="/" className="btn-primary">Browse products</Link>} />
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container className="py-10">
        <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>

        {/* Stepper */}
        <div className="mb-10 flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  i <= step ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-500'}`}>{i + 1}</span>
                <span className={`text-sm font-medium ${i <= step ? 'text-white' : 'text-slate-500'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`mx-3 h-px flex-1 ${i < step ? 'bg-primary-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="card p-6 lg:col-span-2">
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Shipping details</h2>
                <div><label className="label">Full name</label><input className="input" value={shipping.name} onChange={set('name')} /></div>
                <div><label className="label">Address line 1</label><input className="input" value={shipping.street1} onChange={set('street1')} /></div>
                <div><label className="label">Address line 2 (optional)</label><input className="input" value={shipping.street2} onChange={set('street2')} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">City</label><input className="input" value={shipping.city} onChange={set('city')} /></div>
                  <div><label className="label">State / Region</label><input className="input" value={shipping.state} onChange={set('state')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Postal code</label><input className="input" value={shipping.postalCode} onChange={set('postalCode')} /></div>
                  <div><label className="label">Country</label><input className="input" value={shipping.country} onChange={set('country')} /></div>
                </div>
                <Button disabled={!shippingValid} onClick={() => setStep(1)} className="w-full">Continue to payment</Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Payment</h2>
                <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm text-primary-200">
                  Demo mode — payment is mocked. No card is charged.
                </div>
                <div><label className="label">Card number</label><input className="input" placeholder="4242 4242 4242 4242" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Expiry</label><input className="input" placeholder="12 / 28" /></div>
                  <div><label className="label">CVC</label><input className="input" placeholder="123" /></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-secondary flex-1">Back</button>
                  <Button onClick={() => setStep(2)} className="flex-1">Review order</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Review &amp; place order</h2>
                <div className="rounded-xl bg-slate-800/50 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">{shipping.name}</p>
                  <p>{shipping.street1}{shipping.street2 ? `, ${shipping.street2}` : ''}</p>
                  <p>{shipping.city}{shipping.state ? `, ${shipping.state}` : ''} {shipping.postalCode}</p>
                  <p>{shipping.country}</p>
                </div>
                <div className="divide-y divide-slate-800">
                  {items.map((it) => (
                    <div key={it.productId} className="flex items-center gap-3 py-3">
                      <img src={it.image} alt={it.name} className="h-12 w-12 rounded-lg object-cover" />
                      <span className="flex-1 text-sm text-white">{it.name} × {it.quantity}</span>
                      <Price value={it.price * it.quantity} className="text-sm font-semibold text-white" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                  <Button onClick={placeOrder} loading={placing} className="flex-1">Place order</Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Summary */}
          <div className="card sticky top-24 h-fit space-y-3 p-6">
            <h2 className="text-lg font-semibold text-white">Order summary</h2>
            <div className="flex justify-between text-sm text-slate-400"><span>Subtotal</span><Price value={subtotal} /></div>
            <div className="flex justify-between text-sm text-slate-400"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : <Price value={shippingCost} />}</span></div>
            <div className="flex justify-between text-sm text-slate-400"><span>Tax (8%)</span><Price value={tax} /></div>
            <div className="flex justify-between border-t border-slate-800 pt-3 text-base font-bold text-white"><span>Total</span><Price value={total} /></div>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}
