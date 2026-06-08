import { useEffect, useState } from 'react';
import PageTransition from '../components/layout/PageTransition';
import Container from '../components/layout/Container';
import Price from '../components/ui/Price';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { ordersApi, profileApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../lib/formatters';

const STATUS_STYLES = {
  pending: 'bg-amber-500/15 text-amber-300',
  processing: 'bg-blue-500/15 text-blue-300',
  shipped: 'bg-primary-500/15 text-primary-300',
  delivered: 'bg-primary-500/15 text-primary-300',
  cancelled: 'bg-red-500/15 text-red-300',
};

export default function AccountPage() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    ordersApi.list()
      .then((d) => setOrders(d.data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const d = await profileApi.update(profile);
      setUser((u) => ({ ...u, ...d.user }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <PageTransition>
      <Container className="py-10">
        <h1 className="mb-8 text-3xl font-bold text-white">My Account</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile */}
          <div className="lg:col-span-1">
            <form onSubmit={saveProfile} className="card space-y-4 p-6">
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <div><label className="label">Email</label><input className="input opacity-60" value={user?.email ?? ''} disabled /></div>
              <div><label className="label">First name</label><input className="input" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} /></div>
              <div><label className="label">Last name</label><input className="input" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} /></div>
              <Button type="submit" loading={savingProfile} className="w-full">Save changes</Button>
            </form>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-white">Order History</h2>
            {loadingOrders ? (
              <div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
            ) : orders.length === 0 ? (
              <EmptyState icon="📦" title="No orders yet" subtitle="Your completed orders will appear here." />
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-white">Order #{order.id}</span>
                        <span className="ml-3 text-sm text-slate-500">{formatDate(order.createdAt)}</span>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status] ?? 'bg-slate-800 text-slate-300'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-4 divide-y divide-slate-800/70">
                      {order.items?.map((it) => (
                        <div key={it.id} className="flex justify-between py-2 text-sm">
                          <span className="text-slate-300">{it.productName} × {it.quantity}</span>
                          <Price value={it.lineTotal} className="text-slate-400" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between border-t border-slate-800 pt-3">
                      <span className="text-sm text-slate-400">Total</span>
                      <Price value={order.total} className="font-bold text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}
