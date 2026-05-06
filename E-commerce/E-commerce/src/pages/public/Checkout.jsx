import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useToastCtx } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { placeOrder } = useOrders();
  const { show } = useToastCtx();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [shipping, setShipping] = useState({ name: currentUser?.name || '', address: '', city: '', phone: '', email: currentUser?.email || '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '' });

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => { const d = val.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const shippingValid = Object.values(shipping).every((v) => v.trim());
  const paymentValid = payment.cardNumber.replace(/\s/g, '').length === 16 && payment.expiry.length === 5 && payment.cvv.length >= 3;

  const handleNext = () => {
    if (step === 0 && !shippingValid) { show('Please fill all shipping fields.', 'error'); return; }
    if (step === 1 && !paymentValid) { show('Please enter valid payment details.', 'error'); return; }
    setStep((s) => s + 1);
  };

  const handlePlace = () => {
    const order = placeOrder(items, currentUser, shipping, payment);
    clearCart();
    show('Order placed successfully!', 'success');
    navigate('/order-success', { state: { order } });
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200 focus:-translate-y-px';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-4xl font-bold text-primary mb-8 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i < step ? 'bg-success text-white' : i === step ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 transition-all duration-300 ${i < step ? 'bg-success' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-scaleIn">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-heading font-semibold text-xl mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">Full Name</label>
                    <input className={inputCls} value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} placeholder="John Doe" /></div>
                  <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">Phone</label>
                    <input className={inputCls} value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="+1 555 000 0000" /></div>
                </div>
                <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">Email</label>
                  <input className={inputCls} type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} placeholder="you@email.com" /></div>
                <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">Street Address</label>
                  <input className={inputCls} value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="123 Main Street" /></div>
                <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">City</label>
                  <input className={inputCls} value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="New York" /></div>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-heading font-semibold text-xl mb-6">Payment Details</h2>
                <div className="bg-gradient-to-br from-primary to-blue-900 rounded-2xl p-6 text-white mb-6">
                  <p className="text-xs tracking-widest mb-6 opacity-60">CREDIT CARD</p>
                  <p className="font-mono text-xl tracking-widest mb-4">{payment.cardNumber || '•••• •••• •••• ••••'}</p>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">{shipping.name || 'Cardholder Name'}</span>
                    <span>{payment.expiry || 'MM/YY'}</span>
                  </div>
                </div>
                <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">Card Number</label>
                  <input className={inputCls} placeholder="1234 5678 9012 3456" value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: formatCard(e.target.value) })} maxLength={19} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">Expiry (MM/YY)</label>
                    <input className={inputCls} placeholder="MM/YY" value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })} maxLength={5} /></div>
                  <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">CVV</label>
                    <input className={inputCls} placeholder="•••" type="password" value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} maxLength={4} /></div>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">🔒 Your payment info is encrypted and secure</p>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div>
                <h2 className="font-heading font-semibold text-xl mb-6">Review Your Order</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                      <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                      </div>
                      <span className="font-semibold text-sm">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5 mb-6">
                  <div className="flex justify-between"><span className="text-gray-500">Ship to</span><span className="font-medium">{shipping.address}, {shipping.city}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Card</span><span className="font-medium">•••• {payment.cardNumber.slice(-4)}</span></div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>
                <button onClick={handlePlace} className="w-full bg-success text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200 text-lg">
                  Place Order ✓
                </button>
              </div>
            )}

            {step < 2 && (
              <div className="flex justify-between mt-8">
                {step > 0 ? <button onClick={() => setStep((s) => s - 1)} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">← Back</button> : <div />}
                <button onClick={handleNext} className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-200">
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="font-heading font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-500 truncate mr-2">{item.name} ×{item.qty}</span>
                <span className="font-medium shrink-0">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            {items.length > 3 && <p className="text-xs text-gray-400">+{items.length - 3} more items</p>}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
