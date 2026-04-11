import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Package, User, X, CheckCircle, Minus, Plus,
  Trash2, MapPin, CreditCard, ClipboardList, ChevronRight,
  Smartphone, Building2, Banknote, AlertCircle,
} from 'lucide-react';
import { getProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── static products ─────────────────────────────────────────────────── */
const STATIC_PRODUCTS = [
  { _id: '1', name: 'Bamboo Basket', description: 'Beautifully crafted round bamboo basket for home utility.', price: 550, images: ['/handicrafts/item5.png'], sellerId: { name: 'Tribal Craft SHG' } },
  { _id: '2', name: 'Classic Bamboo Pen Holder', description: 'Functional and eco-friendly bamboo pen holder for your desk.', price: 250, images: ['/handicrafts/item1.png'], sellerId: { name: 'Raju Craftsman' } },
  { _id: '3', name: 'Bamboo Flower Vase', description: 'Beautiful handcrafted bamboo vase shown with artificial red flowers.', price: 450, images: ['/handicrafts/item2.png'], sellerId: { name: 'Meena Devi' } },
  { _id: '4', name: 'Floral Bamboo Wall Hanging', description: 'Decorative bamboo grid wall hanging featuring pink artificial flowers.', price: 650, images: ['/handicrafts/item3.png'], sellerId: { name: 'Anita Decoratives' } },
  { _id: '5', name: 'Bamboo Pen Stand Set', description: 'Handcrafted bamboo pen stand set with multiple compartments.', price: 750, images: ['/handicrafts/item4.png'], sellerId: { name: 'Kamla Devi' } },
  { _id: '6', name: 'Grid Bamboo Wall Decor', description: 'Decorative diamond grid wall piece made of natural bamboo.', price: 600, images: ['/handicrafts/item6.png'], sellerId: { name: 'Tribal Artisans' } },
  { _id: '7', name: 'Diamond Bamboo Wall Decor', description: 'Intricate diamond-shaped bamboo wall decor piece for home interiors.', price: 850, images: ['/handicrafts/item7.jpg'], sellerId: { name: 'Kamla Devi' } },
];

/* ─── step config ─────────────────────────────────────────────────────── */
const STEPS = [
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review',  label: 'Review',  icon: ClipboardList },
];

/* ─── payment options ─────────────────────────────────────────────────── */
const PAYMENT_METHODS = [
  { id: 'cod',        label: 'Cash on Delivery', icon: Banknote,   desc: 'Pay when you receive your order' },
  { id: 'upi',        label: 'UPI',               icon: Smartphone, desc: 'Google Pay, PhonePe, BHIM, etc.' },
  { id: 'debit',      label: 'Debit Card',        icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'credit',     label: 'Credit Card',       icon: CreditCard, desc: 'All major credit cards accepted' },
  { id: 'netbanking', label: 'Net Banking',        icon: Building2,  desc: 'Internet banking of any bank' },
];

/* ═══════════════════════════════════════════════════════════════════════
   MODULE-LEVEL COMPONENTS
   CRITICAL: These MUST live outside CheckoutModal so React never
   re-creates their identity on re-render → no focus loss on keypress.
═══════════════════════════════════════════════════════════════════════ */

/* ─── Step Indicator ──────────────────────────────────────────────────── */
function StepIndicator({ current }) {
  const idx = STEPS.findIndex(s => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-6 px-2">
      {STEPS.map((step, i) => {
        const Icon  = step.icon;
        const done  = i < idx;
        const active = i === idx;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                ${done   ? 'bg-green-500 text-white' :
                  active ? 'bg-amber-600 text-white ring-4 ring-amber-200' :
                           'bg-gray-100 text-gray-400'}`}>
                {done ? <CheckCircle size={16} /> : <Icon size={16} />}
              </div>
              <span className={`text-xs mt-1 font-medium
                ${active ? 'text-amber-700' : done ? 'text-green-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-14 mb-4 mx-1 transition-all
                ${i < idx ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Single field row ────────────────────────────────────────────────── */
/*
  Props:
    label       – visible label string
    name        – key inside the address object
    placeholder – hint text
    required    – show red asterisk
    type        – input type (default 'text')
    half        – if true render in half-width grid col
    value       – controlled value from parent
    error       – error string (or '')
    onChange    – (name, value) => void
*/
function Field({ label, name, placeholder, required, type = 'text', value, error, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={e => onChange(name, e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all
          ${error
            ? 'border-red-400 focus:ring-red-200 bg-red-50'
            : 'border-gray-200 focus:ring-amber-200 focus:border-amber-400'
          }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

/* ─── Address form panel ─────────────────────────────────────────────── */
/*
  Stable, module-level component. Receives address + errors from parent,
  calls onFieldChange(name, value) — never recreates state on its own.
*/
function AddressForm({ address, errors, onFieldChange, onNext }) {
  return (
    <motion.div
      key="address-step"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {/* Full-width fields */}
        <div className="col-span-2">
          <Field
            label="Full Name" name="fullName" placeholder="e.g. Arjun Singh"
            required value={address.fullName} error={errors.fullName}
            onChange={onFieldChange}
          />
        </div>

        {/* Half-width fields on same row */}
        <div className="col-span-1">
          <Field
            label="Mobile Number" name="mobile" placeholder="10-digit number"
            required type="tel" value={address.mobile} error={errors.mobile}
            onChange={onFieldChange}
          />
        </div>
        <div className="col-span-1">
          <Field
            label="Email (optional)" name="email" placeholder="you@email.com"
            type="email" value={address.email} error={errors.email}
            onChange={onFieldChange}
          />
        </div>

        {/* Full-width */}
        <div className="col-span-2">
          <Field
            label="House / Street" name="houseStreet"
            placeholder="House no, Street, Colony"
            required value={address.houseStreet} error={errors.houseStreet}
            onChange={onFieldChange}
          />
        </div>

        <div className="col-span-1">
          <Field
            label="City" name="city" placeholder="Ranchi"
            required value={address.city} error={errors.city}
            onChange={onFieldChange}
          />
        </div>
        <div className="col-span-1">
          <Field
            label="State" name="state" placeholder="Jharkhand"
            required value={address.state} error={errors.state}
            onChange={onFieldChange}
          />
        </div>

        <div className="col-span-1">
          <Field
            label="Pincode" name="pincode" placeholder="6 digits"
            required type="tel" value={address.pincode} error={errors.pincode}
            onChange={onFieldChange}
          />
        </div>
        <div className="col-span-1">
          <Field
            label="Landmark (optional)" name="landmark"
            placeholder="Near park, temple…"
            value={address.landmark} error=""
            onChange={onFieldChange}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold mt-5 transition-colors flex items-center justify-center gap-2"
      >
        Continue to Payment <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CHECKOUT MODAL
═══════════════════════════════════════════════════════════════════════ */
function CheckoutModal({ cart, onClose, onSuccess }) {
  /* ── step state ── */
  const [step, setStep] = useState('address'); // 'address'|'payment'|'review'|'success'

  /* ── address state (persistent, never recreated) ── */
  const [address, setAddress] = useState({
    fullName: '', mobile: '', email: '',
    houseStreet: '', city: '', state: '', pincode: '', landmark: '',
  });
  const [addrErrors, setAddrErrors] = useState({});

  /* ── payment state ── */
  const [payment, setPayment] = useState('');
  const [payError, setPayError] = useState('');

  /* Price calculations */
  const subtotal    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const platformFee = Math.round(subtotal * 0.2);
  const total       = subtotal + platformFee;

  /* ── Stable field-change handler (doesn't change reference on re-render) ── */
  const handleFieldChange = useCallback((name, value) => {
    setAddress(prev => ({ ...prev, [name]: value }));
    /* Clear that field's error as soon as user types */
    setAddrErrors(prev => prev[name] ? { ...prev, [name]: '' } : prev);
  }, []);

  /* ── Address validation (run only when clicking Next) ── */
  function validateAddress() {
    const errs = {};
    if (!address.fullName.trim())              errs.fullName    = 'Full name is required';
    if (!/^\d{10}$/.test(address.mobile))      errs.mobile      = 'Enter a valid 10-digit mobile number';
    if (address.email && !/\S+@\S+\.\S+/.test(address.email))
                                               errs.email       = 'Enter a valid email address';
    if (!address.houseStreet.trim())           errs.houseStreet = 'Street address is required';
    if (!address.city.trim())                  errs.city        = 'City is required';
    if (!address.state.trim())                 errs.state       = 'State is required';
    if (!/^\d{6}$/.test(address.pincode))      errs.pincode     = 'Enter a valid 6-digit pincode';
    return errs;
  }

  function handleAddressNext() {
    const errs = validateAddress();
    if (Object.keys(errs).length) { setAddrErrors(errs); return; }
    setAddrErrors({});
    setStep('payment');
  }

  function handlePaymentNext() {
    if (!payment) { setPayError('Please select a payment method to continue'); return; }
    setPayError('');
    setStep('review');
  }

  function handlePlaceOrder() {
    const errs = validateAddress();
    if (Object.keys(errs).length || !payment) return;
    onSuccess();
    setStep('success');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
      />

      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden max-h-[90vh] flex flex-col"
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* ── header ── */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-500 text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold">
              {step === 'address' ? '📍 Delivery Address'
               : step === 'payment' ? '💳 Payment Method'
               : step === 'review'  ? '📋 Review Order'
               : '🎉 Order Placed!'}
            </h2>
            {step !== 'success' && (
              <p className="text-amber-100 text-xs mt-0.5">Handicrafts Checkout</p>
            )}
          </div>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* ── step indicator ── */}
        {step !== 'success' && (
          <div className="px-6 pt-5 flex-shrink-0">
            <StepIndicator current={step} />
          </div>
        )}

        {/* ── scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">

            {/* ════ STEP 1 – ADDRESS ════ */}
            {step === 'address' && (
              <AddressForm
                address={address}
                errors={addrErrors}
                onFieldChange={handleFieldChange}
                onNext={handleAddressNext}
              />
            )}

            {/* ════ STEP 2 – PAYMENT ════ */}
            {step === 'payment' && (
              <motion.div key="payment-step"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map(pm => {
                    const Icon = pm.icon;
                    const sel  = payment === pm.id;
                    return (
                      <button
                        key={pm.id}
                        onClick={() => { setPayment(pm.id); setPayError(''); }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                          ${sel
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-100 hover:border-amber-200 hover:bg-amber-50/40'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                          ${sel ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm ${sel ? 'text-amber-700' : 'text-gray-800'}`}>
                            {pm.label}
                          </p>
                          <p className="text-gray-400 text-xs">{pm.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${sel ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}>
                          {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {payError && (
                  <p className="text-red-500 text-sm mt-3 flex items-center gap-1.5">
                    <AlertCircle size={14} />{payError}
                  </p>
                )}

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setStep('address')}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePaymentNext}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════ STEP 3 – REVIEW ════ */}
            {step === 'review' && (
              <motion.div key="review-step"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>

                {/* items */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Items</p>
                <div className="space-y-2 mb-4 max-h-36 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item._id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5">
                      <img src={item.images?.[0]} alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs">by {item.sellerId?.name} · Qty: {item.qty}</p>
                      </div>
                      <span className="font-bold text-amber-700 text-sm">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* address summary */}
                <div className="bg-blue-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin size={12} /> Delivery Address
                  </p>
                  <p className="text-sm text-gray-700 font-semibold">{address.fullName} · {address.mobile}</p>
                  <p className="text-sm text-gray-600">{address.houseStreet}</p>
                  <p className="text-sm text-gray-600">{address.city}, {address.state} – {address.pincode}</p>
                  {address.landmark && <p className="text-xs text-gray-400">Near: {address.landmark}</p>}
                </div>

                {/* payment summary */}
                <div className="bg-purple-50 rounded-xl p-3 mb-4">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CreditCard size={12} /> Payment
                  </p>
                  <p className="text-sm text-gray-700 font-semibold">
                    {PAYMENT_METHODS.find(p => p.id === payment)?.label}
                  </p>
                </div>

                {/* price breakdown */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Platform Fee (20%)</span><span>₹{platformFee}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
                    <span>Total Amount</span>
                    <span className="text-amber-700">₹{total}</span>
                  </div>
                </div>

                <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-5">
                  🎨 +{cart.reduce((s, i) => s + i.qty, 0) * 10} Eco-Points will be credited for supporting local artisans!
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('payment')}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    ✅ Confirm &amp; Place Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════ SUCCESS ════ */}
            {step === 'success' && (
              <motion.div key="success-step"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                >
                  <CheckCircle size={72} className="text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed! 🎉</h3>
                <p className="text-gray-500 mb-1">Thank you for supporting tribal artisans.</p>
                <p className="text-gray-400 text-sm mb-5">Your order will be delivered in 5–7 business days.</p>

                <div className="bg-blue-50 rounded-xl px-4 py-3 text-blue-700 text-sm mb-3">
                  <p className="font-semibold">{address.fullName}</p>
                  <p>{address.houseStreet}, {address.city} – {address.pincode}</p>
                </div>
                <div className="bg-green-50 rounded-xl px-4 py-3 text-green-700 font-semibold text-sm mb-6">
                  🌱 Eco-Points added to your account!
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN HANDICRAFTS PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function Handicrafts() {
  const { addEcoPoints } = useAuth();
  const [products, setProducts]         = useState(STATIC_PRODUCTS);
  const [cart, setCart]                 = useState([]);
  const [showCart, setShowCart]         = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    getProducts()
      .then(({ data }) => { if (data.length > 0) setProducts(data); })
      .catch(() => {});
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i => i._id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleCheckoutSuccess = () => {
    addEcoPoints?.(totalItems * 10);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-light">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-500 text-white py-16 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Tribal Handicrafts Market
        </motion.h1>
        <p className="text-lg text-amber-100">Support local artisans. Every purchase empowers a family.</p>
        <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-amber-200">
          <span>🎨 +10 Eco-Points per item</span>
          <span>🚚 Pan-India Shipping</span>
          <span>💯 Authentic &amp; Certified</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Cart toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowCart(v => !v)}
            className="relative flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-green-900 transition-colors shadow-md"
          >
            <ShoppingCart size={18} /> Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-dark text-xs h-5 w-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Cart panel */}
        <AnimatePresence>
          {showCart && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold">Your Cart ({totalItems} items)</h2>
                  <button onClick={() => setShowCart(false)}>
                    <X size={20} className="text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 py-6">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-5">
                      {cart.map(item => (
                        <div key={item._id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                          <img src={item.images?.[0]} alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-dark text-sm truncate">{item.name}</p>
                            <p className="text-gray-400 text-xs">{item.sellerId?.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item._id, -1)}
                              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                              {item.qty === 1 ? <Trash2 size={12} className="text-red-400" /> : <Minus size={12} />}
                            </button>
                            <span className="w-6 text-center font-medium text-sm">{item.qty}</span>
                            <button onClick={() => updateQty(item._id, 1)}
                              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-bold text-dark text-sm w-16 text-right">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center font-bold text-lg border-t pt-4">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold mt-4 hover:bg-amber-700 transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="h-52 overflow-hidden relative">
                <img src={product.images?.[0]} alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 bg-white/90 text-xs font-bold px-2.5 py-1 rounded-full text-amber-600">
                  🌱 +10 pts
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                  <User size={12} /> {product.sellerId?.name}
                </div>
                <h3 className="font-bold text-lg text-dark mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-primary">₹{product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-900 transition-colors flex items-center gap-1.5"
                  >
                    <Package size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && cart.length > 0 && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
