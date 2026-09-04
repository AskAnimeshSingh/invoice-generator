import { useEffect, useState } from 'react';
import { CustomerDetails, STORAGE_KEYS } from '../data';

interface CustomerFormProps {
  value: CustomerDetails;
  onChange: (customer: CustomerDetails) => void;
}

const empty: CustomerDetails = {
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
};

export default function CustomerForm({ value, onChange }: CustomerFormProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.customer);
      if (raw) {
        const parsed = JSON.parse(raw) as CustomerDetails;
        onChange({ ...empty, ...parsed });
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.customer, JSON.stringify(value));
  }, [value, loaded]);

  function update(field: keyof CustomerDetails, v: string) {
    onChange({ ...value, [field]: v });
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Customer details</h2>
        <p>Who should this invoice be billed to?</p>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Full name *</span>
          <input
            type="text"
            value={value.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Alex Rivera"
            required
          />
        </label>
        <label className="field">
          <span>Company</span>
          <input
            type="text"
            value={value.company}
            onChange={(e) => update('company', e.target.value)}
            placeholder="Rivera Studio"
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={value.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="alex@example.com"
          />
        </label>
        <label className="field">
          <span>Phone</span>
          <input
            type="tel"
            value={value.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+1 (555) 010-2233"
          />
        </label>
        <label className="field field-full">
          <span>Billing address</span>
          <textarea
            value={value.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="123 Market Street, Portland, OR 97201"
            rows={2}
          />
        </label>
      </div>
    </section>
  );
}
