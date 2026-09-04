import { CartItem, PRODUCTS } from '../data';

interface ProductSelectProps {
  cart: CartItem[];
  onChange: (cart: CartItem[]) => void;
}

export default function ProductSelect({ cart, onChange }: ProductSelectProps) {
  function qtyOf(id: string) {
    return cart.find((c) => c.id === id)?.quantity ?? 0;
  }

  function setQty(productId: string, quantity: number) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      onChange(cart.filter((c) => c.id !== productId));
      return;
    }

    const existing = cart.find((c) => c.id === productId);
    if (existing) {
      onChange(
        cart.map((c) => (c.id === productId ? { ...c, quantity } : c))
      );
    } else {
      onChange([...cart, { ...product, quantity }]);
    }
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Select products</h2>
        <p>Choose items and quantities for this invoice.</p>
      </div>

      <ul className="product-list">
        {PRODUCTS.map((product) => {
          const qty = qtyOf(product.id);
          const selected = qty > 0;
          return (
            <li
              key={product.id}
              className={`product-row${selected ? ' is-selected' : ''}`}
            >
              <div className="product-info">
                <strong>{product.name}</strong>
                <span className="product-desc">{product.description}</span>
              </div>
              <div className="product-price">₹{product.price.toFixed(2)}</div>
              <div className="qty-control">
                <button
                  type="button"
                  className="qty-btn"
                  aria-label={`Decrease ${product.name}`}
                  onClick={() => setQty(product.id, qty - 1)}
                  disabled={qty === 0}
                >
                  −
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  type="button"
                  className="qty-btn"
                  aria-label={`Increase ${product.name}`}
                  onClick={() => setQty(product.id, qty + 1)}
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="cart-summary">
        <span>
          {cart.length === 0
            ? 'No products selected'
            : `${cart.reduce((n, i) => n + i.quantity, 0)} item(s) selected`}
        </span>
        <strong>Subtotal ₹{subtotal.toFixed(2)}</strong>
      </div>
    </section>
  );
}
