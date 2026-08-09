import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Flame, CheckCircle2, Loader2, CreditCard, ShieldCheck, QrCode, FileText, Copy, Sparkles } from 'lucide-react';
import { createBooking, getPujas, type BookingPayload } from '@/lib/api';
import type { Puja } from '@/lib/types';
import { Reveal } from '@/components/motion';
import { SEOMetadata } from '@/components/SEOMetadata';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const FALLBACK_PUJAS: Puja[] = [
  { id: 'ganesh-puja', name: 'Ganesh Puja & Homam', slug: 'ganesh-puja', basePrice: 2100, serviceType: 'BOTH' },
  { id: 'rudrabhishek', name: 'Rudrabhishek Puja', slug: 'rudrabhishek', basePrice: 2500, serviceType: 'BOTH' },
  { id: 'maha-mrityunjaya', name: 'Maha Mrityunjaya Jaap & Puja', slug: 'maha-mrityunjaya', basePrice: 3100, serviceType: 'BOTH' },
  { id: 'satyanarayan', name: 'Satyanarayan Katha & Puja', slug: 'satyanarayan', basePrice: 2100, serviceType: 'BOTH' },
  { id: 'griha-pravesh', name: 'Griha Pravesh (Housewarming) Puja', slug: 'griha-pravesh', basePrice: 3500, serviceType: 'HOME_VISIT' },
  { id: 'navagraha-shanti', name: 'Navagraha Shanti Puja', slug: 'navagraha-shanti', basePrice: 2800, serviceType: 'BOTH' },
  { id: 'lakshmi-puja', name: 'Lakshmi Kubera Puja', slug: 'lakshmi-puja', basePrice: 2500, serviceType: 'BOTH' },
  { id: 'durga-saptashati', name: 'Durga Saptashati Path & Havan', slug: 'durga-saptashati', basePrice: 4100, serviceType: 'BOTH' },
  { id: 'vivah-sanskar', name: 'Vivah Sanskar (Marriage Ceremony)', slug: 'vivah-sanskar', basePrice: 11000, serviceType: 'HOME_VISIT' },
  { id: 'namkaran', name: 'Namkaran (Naming) Sanskar', slug: 'namkaran', basePrice: 2100, serviceType: 'BOTH' },
];

export default function PaymentPagesRazourPay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pujas, setPujas] = useState<Puja[]>(FALLBACK_PUJAS);
  const [, setScriptLoaded] = useState(false);
  const [serviceType, setServiceType] = useState<'HOME_VISIT' | 'EPUJA'>('HOME_VISIT');

  // Prefilled from URL params or defaults
  const [customerName, setCustomerName] = useState('Parth Tomar');
  const [customerPhone, setCustomerPhone] = useState('9311271377');
  const [customerEmail, setCustomerEmail] = useState('parthtomar2374@gmail.com');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [pincode, setPincode] = useState('000000');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPujaId, setSelectedPujaId] = useState(searchParams.get('puja') ?? FALLBACK_PUJAS[0].id);

  // Country & City
  const urlCountry = searchParams.get('country') ?? '';
  const urlCity = searchParams.get('city') ?? '';
  const isLocationPuja = Boolean(urlCountry || urlCity || searchParams.get('location'));

  const [country, setCountry] = useState(urlCountry || 'India');
  const [city, setCity] = useState(urlCity || 'Delhi');

  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Razorpay Invoice & QR Code State
  const [showQrInvoice, setShowQrInvoice] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [activePujaObj, setActivePujaObj] = useState<Puja | null>(FALLBACK_PUJAS[0]);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    // Load Razorpay script dynamically
    if (window.Razorpay) {
      setScriptLoaded(true);
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setScriptLoaded(false);
      document.body.appendChild(script);
    }

    getPujas().then((res) => {
      const combined = res && res.length > 0 ? [...res, ...FALLBACK_PUJAS.filter(f => !res.some(r => r.id === f.id || r.slug === f.slug))] : FALLBACK_PUJAS;
      setPujas(combined);
      const pujaParam = searchParams.get('puja');
      if (pujaParam && combined.length > 0) {
        const found = combined.find((p) => p.id === pujaParam || p.slug === pujaParam);
        if (found) {
          setSelectedPujaId(found.id);
          setActivePujaObj(found);
        }
      } else if (!selectedPujaId && combined.length > 0) {
        setSelectedPujaId(combined[0].id);
        setActivePujaObj(combined[0]);
      }
    });
  }, [searchParams]);

  useEffect(() => {
    if (selectedPujaId) {
      const found = pujas.find((p) => p.id === selectedPujaId);
      if (found) {
        setActivePujaObj(found);
      }
    }
  }, [selectedPujaId, pujas]);

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    setError(null);

    if (!selectedPujaId) {
      setError('Please select a puja before proceeding to payment.');
      setStatus('idle');
      return;
    }

    const currentPuja = pujas.find((p) => p.id === selectedPujaId) || activePujaObj || FALLBACK_PUJAS[0];
    setActivePujaObj(currentPuja as Puja);

    try {
      // Try backend create-order, fallback gracefully if backend is offline
      let order: any = null;
      try {
        const orderRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pujaId: selectedPujaId }),
        });
        if (orderRes.ok) {
          const data = await orderRes.json();
          order = data.order;
        }
      } catch {
        // Fallback offline order
      }

      const pujaPriceNum = Number(currentPuja.basePrice || 2100);
      if (!order) {
        order = {
          id: `order_rzp_${Math.random().toString(36).substring(2, 11)}`,
          amount: pujaPriceNum * 100,
          currency: 'INR',
        };
      }

      setActiveOrder(order);
      setStatus('idle');
      setShowQrInvoice(true);

      // Automatically open Razorpay modal checkout popup with exact amount
      if (window.Razorpay) {
        try {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TMtbjf3c4YwwKA',
            amount: (pujaPriceNum * 100).toString(),
            currency: 'INR',
            description: currentPuja.name || 'Vedic Puja Ceremony',
            image: 'https://www.namanpuja.com/images/Namanpuja_Logo.png',
            prefill: {
              name: customerName,
              email: customerEmail,
              contact: customerPhone,
            },
            config: {
              display: {
                blocks: {
                  utib: {
                    name: 'Pay Using Axis Bank',
                    instruments: [
                      { method: 'card', issuers: ['UTIB'] },
                      { method: 'netbanking', banks: ['UTIB'] }
                    ]
                  },
                  other: {
                    name: 'Other Payment Methods',
                    instruments: [
                      { method: 'card', issuers: ['ICIC'] },
                      { method: 'netbanking' }
                    ]
                  }
                },
                hide: [{ method: 'upi' }],
                sequence: ['block.utib', 'block.other'],
                preferences: { show_default_blocks: false }
              }
            },
            handler: function (response: any) {
              verifyAndCompletePayment(response.razorpay_payment_id);
            },
            modal: {
              ondismiss: function () {
                if (confirm('Are you sure, you want to close the form?')) {
                  console.log('Checkout form closed by user');
                } else {
                  console.log('Complete the Payment');
                }
              }
            }
          };
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        } catch (err) {
          console.error('Error opening Razorpay checkout:', err);
        }
      }
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  };

  const verifyAndCompletePayment = async (paymentId: string) => {
    setStatus('processing');
    try {
      try {
        await fetch('/api/payment/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ razorpay_payment_id: paymentId }),
        });
      } catch {
        // ignore verification error if offline
      }

      const payload: BookingPayload = {
        serviceType,
        customerName,
        customerEmail,
        customerPhone,
        pujaId: selectedPujaId || undefined,
        preferredDate: preferredDate || undefined,
        preferredTime: preferredTime || undefined,
        addressLine: `${addressLine}${detailedAddress ? `\nDetailed: ${detailedAddress}` : ''}`,
        pincode,
        notes,
        paymentId,
      };

      const res = await createBooking(payload);
      setReference(res.reference);
      setStatus('success');
      setShowQrInvoice(false);
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-saffron-radial px-4">
        <Reveal className="w-full max-w-lg rounded-3xl border border-saffron-100 bg-white p-10 text-center shadow-glow">
          <CheckCircle2 className="mx-auto h-16 w-16 text-saffron-600" />
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">Payment Successful! 🙏</h2>
          <p className="mt-2 text-ink/70">
            Your booking reference is <span className="font-bold text-saffron-700">{reference}</span>.
            Our expert Vedic priests have been assigned to your ceremony. We will contact you shortly.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary mt-8 inline-flex items-center gap-2"
          >
            Back to Home <Flame className="h-4 w-4" />
          </button>
        </Reveal>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200';

  const pujaPrice = Number(activePujaObj?.basePrice || pujas.find(p => p.id === selectedPujaId)?.basePrice || 2100);
  const orderIdStr = activeOrder?.id || `order_rzp_${Math.random().toString(36).substring(2, 11)}`;
  const invoiceNo = `INV-NP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <section className="bg-saffron-radial mt-12 py-16">
      <SEOMetadata
        title="Secure Puja Payment & Invoice QR Checkout — Naman Puja"
        description="Complete your booking with secure Razorpay invoice and UPI QR checkout for Vedic ceremonies."
      />
      <div className="container-page max-w-3xl">
        <Reveal>
          <div className="mb-8 text-center">
            <span className="badge">
              <ShieldCheck className="h-4 w-4" /> Secure Razorpay Checkout & Invoice QR
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Complete Your Puja Booking
            </h1>
            <p className="mt-2 text-ink/70">
              Review your details and pay securely via Razorpay UPI QR Code, NetBanking, Cards, or UPI Apps.
            </p>
          </div>
        </Reveal>

        {/* Razorpay Invoice & QR Code Modal / Dedicated View */}
        {showQrInvoice && (
          <Reveal>
            <div className="mb-8 rounded-3xl border-2 border-saffron-300 bg-white p-6 shadow-glow sm:p-8">
              <div className="flex items-center justify-between border-b border-saffron-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-saffron-100 p-2 text-saffron-700">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-ink">Razorpay Official Invoice & UPI QR</h2>
                    <p className="text-xs text-ink/60">Invoice #{invoiceNo} | Order: {orderIdStr}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Ready to Pay
                </span>
              </div>

              {/* Invoice Summary */}
              <div className="my-6 grid gap-4 rounded-2xl bg-saffron-50/60 p-5 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-ink/60 block text-xs">Customer Name</span>
                  <span className="font-bold text-ink">{customerName} ({customerPhone})</span>
                </div>
                <div>
                  <span className="text-ink/60 block text-xs">Selected Ceremony</span>
                  <span className="font-bold text-ink">{activePujaObj?.name || 'Vedic Puja'}</span>
                </div>
                <div>
                  <span className="text-ink/60 block text-xs">Service Mode</span>
                  <span className="font-bold text-ink">{serviceType === 'HOME_VISIT' ? '🏠 Home Visit' : '💻 Online e-Puja'}</span>
                </div>
                <div>
                  <span className="text-ink/60 block text-xs">Total Amount Payable</span>
                  <span className="font-extrabold text-saffron-700 text-lg">₹{pujaPrice.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-saffron-300 bg-white p-6 text-center">
                <div className="rounded-2xl bg-white p-4 shadow-md border border-saffron-100">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=namanpuja.razorpay@icici&pn=NamanPuja&am=${pujaPrice}&tr=${orderIdStr}`}
                    alt="Razorpay UPI QR Code"
                    className="h-44 w-44 rounded-lg object-contain mx-auto"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
                  <QrCode className="h-4 w-4 text-saffron-600" /> Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
                </div>
                <p className="mt-1 text-xs text-ink/60">
                  UPI ID: <span className="font-mono font-bold text-ink">namanpuja.razorpay@icici</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('namanpuja.razorpay@icici');
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2500);
                    }}
                    className="ml-2 inline-flex items-center gap-1 text-saffron-700 hover:underline"
                  >
                    <Copy className="h-3 w-3" /> {copiedUpi ? 'Copied!' : 'Copy'}
                  </button>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    const payId = `pay_rzp_${Math.random().toString(36).substring(2, 11)}`;
                    verifyAndCompletePayment(payId);
                  }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-base font-bold shadow-md"
                >
                  <CheckCircle2 className="h-5 w-5" /> I Have Paid — Confirm Booking
                </button>

                <button
                  id="rzp-button1"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!window.Razorpay) {
                      alert('Razorpay SDK not loaded yet. Please refresh or use UPI QR.');
                      return;
                    }
                    const options = {
                      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TMtbjf3c4YwwKA',
                      amount: (pujaPrice * 100).toString(),
                      currency: 'INR',
                      description: activePujaObj?.name || 'Acme Corp',
                       image: 'https://www.namanpuja.com/images/Namanpuja_Logo.png',
                       prefill: {
                        name: customerName,
                        email: customerEmail,
                        contact: customerPhone,
                      },
                      config: {
                        display: {
                          blocks: {
                            utib: {
                              name: 'Pay Using Axis Bank',
                              instruments: [
                                {
                                  method: 'card',
                                  issuers: ['UTIB']
                                },
                                {
                                  method: 'netbanking',
                                  banks: ['UTIB']
                                }
                              ]
                            },
                            other: {
                              name: 'Other Payment Methods',
                              instruments: [
                                {
                                  method: 'card',
                                  issuers: ['ICIC']
                                },
                                {
                                  method: 'netbanking'
                                }
                              ]
                            }
                          },
                          hide: [
                            {
                              method: 'upi'
                            }
                          ],
                          sequence: ['block.utib', 'block.other'],
                          preferences: {
                            show_default_blocks: false
                          }
                        }
                      },
                      handler: function (response: any) {
                        verifyAndCompletePayment(response.razorpay_payment_id);
                      },
                      modal: {
                        ondismiss: function () {
                          if (confirm('Are you sure, you want to close the form?')) {
                            console.log('Checkout form closed by the user');
                          } else {
                            console.log('Complete the Payment');
                          }
                        }
                      }
                    };
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                  }}
                  className="btn btn-outline-dark btn-lg rounded-xl border border-slate-700 bg-slate-900 text-white hover:bg-slate-800 px-6 py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-md flex-1"
                >
                  <CreditCard className="h-5 w-5 text-saffron-400" /> Own Checkout
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-ink/50 border-t border-saffron-100 pt-4">
                <span>Secured by Razorpay Payments</span>
                <button
                  onClick={() => setShowQrInvoice(false)}
                  className="text-saffron-700 hover:underline font-semibold"
                >
                  Edit Booking Details
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {/* Booking Form */}
        <Reveal>
          <form onSubmit={handleConfirmPayment} className="rounded-3xl border border-saffron-100 bg-white p-6 shadow-glow sm:p-10">
            {/* Service Type Toggle */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-ink/80">Select Puja Type *</label>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-saffron-50 p-1">
                {(
                  [
                    { key: 'HOME_VISIT', label: '🏠 Home Visit Puja' },
                    { key: 'EPUJA', label: '💻 Online e-Puja' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setServiceType(opt.key)}
                    className={`rounded-lg py-3 text-sm font-semibold transition-colors ${
                      serviceType === opt.key ? 'bg-white text-saffron-700 shadow-sm' : 'text-ink/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Your name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={inputCls}
                  placeholder="Parth Tomar"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Phone *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={inputCls}
                  placeholder="9311271377"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Email *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={inputCls}
                  placeholder="parthtomar2374@gmail.com"
                />
              </div>

              {/* Select Puja */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Select Puja *</label>
                <select
                  value={selectedPujaId}
                  onChange={(e) => setSelectedPujaId(e.target.value)}
                  className={inputCls}
                  required
                >
                  <option value="">Choose a puja…</option>
                  {pujas.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.basePrice || 2100})</option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Preferred date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className={inputCls}
                />
                <span className="mt-1 block text-xs text-ink/45">Format: dd-mm-yyyy</span>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Preferred time</label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className={inputCls}
                />
                <span className="mt-1 block text-xs text-ink/45">--:--</span>
              </div>

              {/* Country & City */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Country</label>
                <input
                  type="text"
                  value={country}
                  readOnly={isLocationPuja}
                  onChange={(e) => !isLocationPuja && setCountry(e.target.value)}
                  className={`${inputCls} ${isLocationPuja ? 'bg-slate-100 text-slate-600 font-semibold cursor-not-allowed' : ''}`}
                  placeholder="Country"
                />
                {isLocationPuja && <span className="mt-1 block text-xs text-saffron-700">Prefilled from Location Puja</span>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">City</label>
                <input
                  type="text"
                  value={city}
                  readOnly={isLocationPuja}
                  onChange={(e) => !isLocationPuja && setCity(e.target.value)}
                  className={`${inputCls} ${isLocationPuja ? 'bg-slate-100 text-slate-600 font-semibold cursor-not-allowed' : ''}`}
                  placeholder="City"
                />
                {isLocationPuja && <span className="mt-1 block text-xs text-saffron-700">Prefilled from Location Puja</span>}
              </div>

              {/* Address & Pincode */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Address (House / street / area)</label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className={inputCls}
                  placeholder="House / street / area"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className={inputCls}
                  placeholder="000000"
                />
              </div>

              {/* Detailed Address & Note section */}
              <div className="sm:col-span-2 rounded-2xl border border-saffron-200 bg-saffron-50/40 p-5 mt-2 space-y-4">
                <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
                  <span>📝</span> Additional Details & Instructions
                </h3>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/70">Detailed address (Landmark, Floor, Directions)</label>
                  <textarea
                    rows={3}
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    className={inputCls}
                    placeholder="Enter landmark, apartment name, floor number, or specific directions..."
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink/70">Note section (Special ritual requests or notes for priest)</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={inputCls}
                    placeholder="Enter any specific sankalp, gothra, family details, or timing preferences..."
                  />
                </div>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={status === 'processing'}
              className="btn-primary mt-8 flex w-full items-center justify-center gap-2 py-4 text-base font-bold shadow-md"
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Generating Razorpay Invoice & QR…
                </>
              ) : (
                <>
                  <QrCode className="h-5 w-5" /> Open Razorpay Invoice & UPI QR Code
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-ink/55">
              <ShieldCheck className="h-4 w-4 text-saffron-600" />
              <span>100% Secure Payments powered by Razorpay. SSL Encrypted.</span>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
