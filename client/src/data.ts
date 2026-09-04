export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Basmati Rice (5 kg)',
    description: 'Premium long-grain, aged basmati',
    price: 450,
  },
  {
    id: 'p2',
    name: 'Toor Dal (1 kg)',
    description: 'Unpolished arhar dal',
    price: 165,
  },
  {
    id: 'p3',
    name: 'Whole Wheat Atta (5 kg)',
    description: 'Stone-ground chakki atta',
    price: 280,
  },
  {
    id: 'p4',
    name: 'Mustard Oil (1 L)',
    description: 'Cold-pressed kachi ghani',
    price: 185,
  },
  {
    id: 'p5',
    name: 'Cow Ghee (500 ml)',
    description: 'Pure desi ghee, bilona style',
    price: 320,
  },
  {
    id: 'p6',
    name: 'Assam Tea (500 g)',
    description: 'Strong leaf tea for daily chai',
    price: 210,
  },
  {
    id: 'p7',
    name: 'Sugar (1 kg)',
    description: 'Fine crystal white sugar',
    price: 55,
  },
  {
    id: 'p8',
    name: 'Masala Combo Pack',
    description: 'Haldi, mirchi, jeera & dhania (100 g each)',
    price: 199,
  },
];

export const STORAGE_KEYS = {
  signature: 'invoice_gen_signature',
  customer: 'invoice_gen_customer',
} as const;

export function nextInvoiceNumber(): string {
  const key = 'invoice_gen_counter';
  const current = Number(localStorage.getItem(key) || '1000');
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return `INV-${next}`;
}
