import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../hooks';
import { cn, formatDate } from '../utils/helpers';
import { logout } from '../store/slices/authSlice';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  clearProfileError,
  clearProfileSuccess,
} from '../store/slices/profileSlice';
import { Button, Input, Card, Badge, Modal, EmptyState, Skeleton, Spinner } from '../components/ui';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
];

const ADDRESS_LABELS = [
  { value: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { value: 'office', label: 'Office', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { value: 'other', label: 'Other', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
];

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={cn(
        'fixed top-24 left-1/2 z-[60] px-5 py-3 rounded-xl shadow-lg border text-sm font-medium',
        type === 'success' && 'bg-success-50 text-success-700 border-success-200 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20',
        type === 'error' && 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-500/10 dark:text-danger-400 dark:border-danger-500/20'
      )}
    >
      {message}
    </motion.div>
  );
}

function StatCard({ icon, label, value, gradient }) {
  const { isDark } = useDarkMode();
  return (
    <motion.div variants={fadeUp} className={cn(
      'relative p-5 rounded-2xl border overflow-hidden',
      isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
    )}>
      <div className={cn('absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20', gradient)} />
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', gradient.replace('from-', 'bg-').replace(' to-*', ''))}>
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <p className={cn('text-xs font-medium mb-1', isDark ? 'text-white/40' : 'text-surface-500')}>{label}</p>
      <p className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-surface-900')}>{value}</p>
    </motion.div>
  );
}

function ProfileHeader() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { user, isSaving } = useSelector((s) => s.profile);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      dispatch(clearProfileError());
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    dispatch(uploadAvatar(formData));
    e.target.value = '';
  }, [dispatch]);

  const handleRemoveAvatar = useCallback(() => {
    dispatch(removeAvatar());
  }, [dispatch]);

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <motion.div variants={fadeUp} className={cn(
      'relative rounded-3xl border overflow-hidden',
      isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
    )}>
      <div className="h-32 sm:h-40 bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      <div className="px-6 sm:px-8 pb-6 -mt-16 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
          <div className="relative group">
            <button
              onClick={handleAvatarClick}
              className={cn(
                'w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 overflow-hidden flex items-center justify-center transition-all duration-300',
                isDark ? 'bg-dark-800 border-dark-900' : 'bg-surface-100 border-white',
                'hover:ring-2 hover:ring-brand-500/50 hover:ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
              )}
              aria-label="Change profile picture"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className={cn('text-3xl sm:text-4xl font-bold', isDark ? 'text-white/30' : 'text-surface-400')}>
                  {initials}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {user?.avatar && (
              <button
                onClick={handleRemoveAvatar}
                disabled={isSaving}
                className={cn(
                  'absolute -bottom-2 -right-2 w-8 h-8 rounded-lg border flex items-center justify-center transition-all',
                  isDark ? 'bg-dark-800 border-white/10 text-white/60 hover:text-danger-400 hover:border-danger-500/30' : 'bg-white border-surface-200 text-surface-400 hover:text-danger-500 hover:border-danger-200'
                )}
                aria-label="Remove profile picture"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex-1 sm:pb-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className={cn('text-2xl sm:text-3xl font-display font-bold', isDark ? 'text-white' : 'text-surface-900')}>
                {user?.name || 'Loading...'}
              </h1>
              {user?.isEmailVerified && (
                <Badge variant="success" size="sm" dot>Verified</Badge>
              )}
            </div>
            <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>
              {user?.email}
            </p>
            <p className={cn('text-xs mt-1', isDark ? 'text-white/25' : 'text-surface-400')}>
              Member since {user?.createdAt ? formatDate(user.createdAt) : '—'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OverviewTab() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, addresses } = useSelector((s) => s.profile);
  const { user: authUser } = useSelector((s) => s.auth);

  const stats = [
    { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', label: 'Favorite Pizza', value: 'Coming Soon', gradient: 'from-pink-500 to-rose-500' },
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Total Orders', value: '0', gradient: 'from-brand-500 to-brand-600' },
    { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Total Spent', value: '$0.00', gradient: 'from-accent-500 to-amber-500' },
    { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', label: 'Loyalty Tier', value: 'Bronze', gradient: 'from-amber-500 to-yellow-500' },
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Saved Addresses', value: String(addresses.length), gradient: 'from-emerald-500 to-teal-500' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('font-display font-bold mb-4', isDark ? 'text-white' : 'text-surface-900')}>Account Details</h3>
        <div className="space-y-4">
          {[
            { label: 'Full Name', value: user?.name || '—' },
            { label: 'Email', value: user?.email || '—' },
            { label: 'Phone', value: user?.phone || 'Not set' },
            { label: 'Email Status', value: user?.isEmailVerified ? 'Verified' : 'Not verified' },
            { label: 'Member Since', value: user?.createdAt ? formatDate(user.createdAt) : '—' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-dashed last:border-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : undefined }}>
              <span className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-surface-500')}>{item.label}</span>
              <span className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-surface-900')}>{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('font-display font-bold mb-4', isDark ? 'text-white' : 'text-surface-900')}>Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" onClick={() => navigate('/builder')} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}>
            Order Pizza
          </Button>
          <Button variant="outline" onClick={() => navigate('/menu')} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}>
            Browse Menu
          </Button>
          <Button variant="danger" onClick={handleLogout} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>}>
            Logout
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EditProfileTab() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { user, isSaving, error, successMessage } = useSelector((s) => s.profile);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(() => { dispatch(clearProfileSuccess()); dispatch(clearProfileError()); }, 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, phone }));
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <AnimatePresence>
        {successMessage && <Toast message={successMessage} type="success" onClose={() => dispatch(clearProfileSuccess())} />}
        {error && <Toast message={error} type="error" onClose={() => dispatch(clearProfileError())} />}
      </AnimatePresence>

      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6 sm:p-8',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('text-lg font-display font-bold mb-6', isDark ? 'text-white' : 'text-surface-900')}>Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
          <div className="flex justify-end">
            <Button type="submit" loading={isSaving}>Save Changes</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function AddressCard({ address, onEdit, onSetDefault, onDelete }) {
  const { isDark } = useDarkMode();
  const labelInfo = ADDRESS_LABELS.find((l) => l.value === address.label) || ADDRESS_LABELS[2];

  return (
    <motion.div
      layout
      variants={fadeUp}
      className={cn(
        'relative rounded-2xl border p-5 transition-all duration-300',
        address.isDefault
          ? isDark ? 'border-brand-500/30 bg-brand-500/5' : 'border-brand-200 bg-brand-50/50'
          : isDark ? 'border-white/[0.06] bg-white/[0.03]' : 'border-surface-200 bg-white'
      )}
    >
      {address.isDefault && (
        <div className="absolute top-3 right-3">
          <Badge variant="brand" size="sm">Default</Badge>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
          isDark ? 'bg-white/[0.06]' : 'bg-surface-100'
        )}>
          <svg className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-surface-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={labelInfo.icon} />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-surface-900')}>{address.recipientName}</span>
            <Badge variant="neutral" size="sm">{labelInfo.label}</Badge>
          </div>
          <p className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-surface-500')}>{address.phone}</p>
        </div>
      </div>

      <p className={cn('text-sm mb-1', isDark ? 'text-white/60' : 'text-surface-600')}>
        {address.houseFlat}, {address.street}
        {address.area ? `, ${address.area}` : ''}
      </p>
      <p className={cn('text-sm', isDark ? 'text-white/60' : 'text-surface-600')}>
        {address.city} {address.postalCode}
      </p>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : undefined }}>
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address._id)}
            className={cn('text-xs font-medium transition-colors', isDark ? 'text-brand-400 hover:text-brand-300' : 'text-brand-600 hover:text-brand-700')}
          >
            Set as Default
          </button>
        )}
        <span className={isDark ? 'text-white/10' : 'text-surface-300'}>|</span>
        <button
          onClick={() => onEdit(address)}
          className={cn('text-xs font-medium transition-colors', isDark ? 'text-white/40 hover:text-white/60' : 'text-surface-500 hover:text-surface-700')}
        >
          Edit
        </button>
        <span className={isDark ? 'text-white/10' : 'text-surface-300'}>|</span>
        <button
          onClick={() => onDelete(address._id)}
          className="text-xs font-medium text-danger-500 hover:text-danger-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}

function AddressFormModal({ open, onClose, editingAddress }) {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { isSaving } = useSelector((s) => s.profile);

  const [form, setForm] = useState({
    recipientName: '', phone: '', houseFlat: '', street: '', area: '', city: '', postalCode: '', label: 'home', isDefault: false,
  });

  useEffect(() => {
    if (editingAddress) {
      setForm({
        recipientName: editingAddress.recipientName || '',
        phone: editingAddress.phone || '',
        houseFlat: editingAddress.houseFlat || '',
        street: editingAddress.street || '',
        area: editingAddress.area || '',
        city: editingAddress.city || '',
        postalCode: editingAddress.postalCode || '',
        label: editingAddress.label || 'home',
        isDefault: editingAddress.isDefault || false,
      });
    } else {
      setForm({ recipientName: '', phone: '', houseFlat: '', street: '', area: '', city: '', postalCode: '', label: 'home', isDefault: false });
    }
  }, [editingAddress, open]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      dispatch(updateAddress({ id: editingAddress._id, data: form }));
    } else {
      dispatch(createAddress(form));
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editingAddress ? 'Edit Address' : 'Add New Address'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Recipient Name" value={form.recipientName} onChange={(e) => handleChange('recipientName', e.target.value)} required placeholder="John Doe" />
          <Input label="Phone Number" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required placeholder="+1 (555) 000-0000" />
        </div>
        <Input label="House / Flat" value={form.houseFlat} onChange={(e) => handleChange('houseFlat', e.target.value)} required placeholder="Apt 4B, House 12" />
        <Input label="Street" value={form.street} onChange={(e) => handleChange('street', e.target.value)} required placeholder="123 Main Street" />
        <Input label="Area" value={form.area} onChange={(e) => handleChange('area', e.target.value)} placeholder="Downtown, Sector 5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="City" value={form.city} onChange={(e) => handleChange('city', e.target.value)} required placeholder="New York" />
          <Input label="Postal Code" value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} required placeholder="10001" />
        </div>

        <div>
          <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-white/60' : 'text-surface-600')}>Address Label</label>
          <div className="flex gap-2">
            {ADDRESS_LABELS.map((lbl) => (
              <button
                key={lbl.value}
                type="button"
                onClick={() => handleChange('label', lbl.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
                  form.label === lbl.value
                    ? isDark ? 'border-brand-500/30 bg-brand-500/10 text-brand-400' : 'border-brand-200 bg-brand-50 text-brand-600'
                    : isDark ? 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white/60' : 'border-surface-200 bg-surface-50 text-surface-500 hover:text-surface-700'
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={lbl.icon} />
                </svg>
                {lbl.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => handleChange('isDefault', e.target.checked)}
            className={cn(
              'w-4 h-4 rounded border-2 text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0 cursor-pointer transition-all duration-200',
              isDark ? 'border-white/20 bg-dark-850' : 'border-surface-300 bg-white'
            )}
          />
          <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-surface-600')}>Set as default address</span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSaving}>{editingAddress ? 'Update Address' : 'Add Address'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function AddressesTab() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { addresses, isSaving } = useSelector((s) => s.profile);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  const handleEdit = (addr) => { setEditingAddress(addr); setShowForm(true); };
  const handleAdd = () => { setEditingAddress(null); setShowForm(true); };
  const handleClose = () => { setShowForm(false); setEditingAddress(null); };
  const handleDelete = (id) => { setDeletingAddressId(id); };
  const confirmDelete = () => { if (deletingAddressId) { dispatch(deleteAddress(deletingAddressId)); setDeletingAddressId(null); } };
  const cancelDelete = () => setDeletingAddressId(null);
  const handleSetDefault = (id) => dispatch(setDefaultAddress(id));

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h3 className={cn('text-lg font-display font-bold', isDark ? 'text-white' : 'text-surface-900')}>Saved Addresses</h3>
          <p className={cn('text-sm mt-1', isDark ? 'text-white/40' : 'text-surface-500')}>
            {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'} saved
          </p>
        </div>
        <Button onClick={handleAdd} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}>
          Add Address
        </Button>
      </motion.div>

      {addresses.length === 0 ? (
        <motion.div variants={fadeUp}>
          <EmptyState
            icon={<svg className="w-10 h-10 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            title="No addresses yet"
            description="Add your first delivery address to get started"
            action={<Button onClick={handleAdd}>Add Your First Address</Button>}
          />
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              address={addr}
              onEdit={handleEdit}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      <AddressFormModal open={showForm} onClose={handleClose} editingAddress={editingAddress} />

      {/* Delete confirmation modal */}
      <Modal open={!!deletingAddressId} onClose={cancelDelete} size="sm" title="Delete Address">
        <p className={cn('text-sm mb-6', isDark ? 'text-white/50' : 'text-surface-500')}>
          Are you sure you want to delete this address? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <Button variant="ghost" onClick={cancelDelete}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Address</Button>
        </div>
      </Modal>
    </motion.div>
  );
}

function SecurityTab() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { isSaving, error, successMessage } = useSelector((s) => s.profile);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(() => { dispatch(clearProfileSuccess()); dispatch(clearProfileError()); }, 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, dispatch]);

  const passwordStrength = useCallback((pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }, []);

  const strength = passwordStrength(newPassword);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent'];
  const strengthColors = ['', 'bg-danger-500', 'bg-warning-500', 'bg-accent-500', 'bg-success-400', 'bg-success-500', 'bg-success-600'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    dispatch(changePassword({ newPassword })).then((res) => {
      if (!res.error) {
        setNewPassword('');
        setConfirmPassword('');
      }
    });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <AnimatePresence>
        {successMessage && <Toast message={successMessage} type="success" onClose={() => dispatch(clearProfileSuccess())} />}
        {error && <Toast message={error} type="error" onClose={() => dispatch(clearProfileError())} />}
      </AnimatePresence>

      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6 sm:p-8',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('text-lg font-display font-bold mb-6', isDark ? 'text-white' : 'text-surface-900')}>Set New Password</h3>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
          <div className="relative">
            <Input
              label="New Password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className={cn('absolute right-3 top-9 transition-colors duration-200', isDark ? 'text-white/40 hover:text-white/70' : 'text-surface-400 hover:text-surface-600')} tabIndex={-1}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {showNew
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                }
              </svg>
            </button>
          </div>

          {newPassword && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-all', i <= strength ? strengthColors[strength] : isDark ? 'bg-white/10' : 'bg-surface-200')} />
                ))}
              </div>
              <p className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-surface-500')}>
                Strength: {strengthLabels[strength] || 'Too weak'}
              </p>
            </div>
          )}

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              error={validationError || (confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : '')}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className={cn('absolute right-3 top-9 transition-colors duration-200', isDark ? 'text-white/40 hover:text-white/70' : 'text-surface-400 hover:text-surface-600')} tabIndex={-1}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {showConfirm
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                }
              </svg>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={isSaving}>Update Password</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Profile() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { user, isLoading } = useSelector((s) => s.profile);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(getProfile());
  }, [dispatch, isAuthenticated, navigate]);

  if (isLoading && !user) {
    return (
      <div className="min-h-screen pt-24 pb-16 container">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <ProfileHeader />

          <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  activeTab === tab.id
                    ? isDark ? 'text-white' : 'text-surface-900'
                    : isDark ? 'text-white/40 hover:text-white/60' : 'text-surface-500 hover:text-surface-700'
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={cn(
                      'absolute inset-0 rounded-xl border',
                      isDark ? 'bg-white/[0.08] border-white/[0.08]' : 'bg-white border-surface-200 shadow-sm'
                    )}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab key="overview" />}
            {activeTab === 'addresses' && <AddressesTab key="addresses" />}
            {activeTab === 'security' && <SecurityTab key="security" />}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
