import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Price from './ui/Price';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const toast = useToast();

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await add(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card group overflow-hidden"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-slate-800">
          <img
            src={product.primaryImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-4">
          {product.categoryName && (
            <span className="text-xs font-medium uppercase tracking-wide text-primary-400">{product.categoryName}</span>
          )}
          <h3 className="line-clamp-1 font-semibold text-white">{product.name}</h3>
          <div className="flex items-center justify-between">
            <Price value={product.price} className="text-lg font-bold text-white" />
            <button onClick={handleAdd} className="btn-primary !px-3 !py-2 text-xs">Add</button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
