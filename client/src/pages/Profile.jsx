import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../hooks';
import { cn, formatDate, formatCurrency } from '../utils/helpers';
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

import { Button, Input, Badge, Modal, EmptyState, Skeleton, Divider } from '../components/ui';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const NAV_SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'personal',
    label: 'Personal Info',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: 'addresses',
    label: 'Address Book',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    id: 'security',
    label: 'Security',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const ADDRESS_LABELS = [
  { value: 'home', label: 'Home', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
  { value: 'office', label: 'Office', icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z' },
  { value: 'other', label: 'Other', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
];

/* ============================================
   TOAST COMPONENT
   ============================================ */
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

/* ============================================
   SIDEBAR NAV (Desktop)
   ============================================ */
function SidebarNav({ activeSection, onNavigate }) {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.profile);

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={cn(
      'hidden lg:flex flex-col w-64 flex-shrink-0 rounded-2xl border p-4 sticky top-28 h-fit',
      isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200'
    )}>
      {/* User info */}
      <div className="flex items-center gap-3 px-3 py-4 mb-2">
        <div className="relative">
          <div className={cn(
            'w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center',
            isDark ? 'bg-white/10' : 'bg-surface-100'
          )}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className={cn('text-lg font-bold', isDark ? 'text-white/40' : 'text-surface-400')}>
                {initials}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-surface-900')}>
            {user?.name || 'Loading...'}
          </p>
          <p className={cn('text-xs truncate', isDark ? 'text-white/40' : 'text-surface-500')}>
            {user?.email}
          </p>
        </div>
      </div>

      <Divider className="mb-2" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              activeSection === section.id
                ? isDark
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'bg-brand-50 text-brand-600 border border-brand-200'
                : isDark
                  ? 'text-white/50 hover:text-white/70 hover:bg-white/[0.04] border border-transparent'
                  : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50 border border-transparent'
            )}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </nav>

      <Divider className="my-2" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          'text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 border border-transparent',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-500'
        )}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Sign Out
      </button>
    </div>
  );
}

/* ============================================
   MOBILE TAB BAR
   ============================================ */
function MobileTabBar({ activeSection, onNavigate }) {
  const { isDark } = useDarkMode();

  return (
    <div className="lg:hidden flex gap-1 p-1 rounded-2xl overflow-x-auto mb-6" style={{ scrollbarWidth: 'none' }}>
      {NAV_SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => onNavigate(section.id)}
          className={cn(
            'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            activeSection === section.id
              ? isDark ? 'text-white' : 'text-surface-900'
              : isDark ? 'text-white/40 hover:text-white/60' : 'text-surface-500 hover:text-surface-700'
          )}
        >
          {activeSection === section.id && (
            <motion.div
              layoutId="mobileActiveTab"
              className={cn(
                'absolute inset-0 rounded-xl border',
                isDark ? 'bg-white/[0.08] border-white/[0.08]' : 'bg-white border-surface-200 shadow-sm'
              )}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{section.icon}</span>
          <span className="relative z-10">{section.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ============================================
   OVERVIEW SECTION
   ============================================ */
function OverviewSection() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, addresses } = useSelector((s) => s.profile);
  const { isDark: isDarkMode } = useSelector((s) => s.ui);

  const stats = [
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      ),
      label: 'Total Orders',
      value: '0',
      gradient: 'from-brand-500 to-brand-600',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Total Spent',
      value: formatCurrency(0),
      gradient: 'from-accent-500 to-amber-500',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      label: 'Saved Addresses',
      value: String(addresses.length),
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      label: 'Loyalty Tier',
      value: 'Bronze',
      gradient: 'from-amber-500 to-yellow-500',
    },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className={cn(
              'relative p-5 rounded-2xl border overflow-hidden',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
            )}
          >
            <div className={cn('absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20', s.gradient.replace('from-', 'bg-gradient-to-br from-').replace(' to-', ' to-'))} />
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br', s.gradient)}>
              {s.icon}
            </div>
            <p className={cn('text-xs font-medium mb-1', isDark ? 'text-white/40' : 'text-surface-500')}>{s.label}</p>
            <p className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-surface-900')}>{s.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Account Details */}
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
            { label: 'Email Status', value: user?.isEmailVerified ? 'Verified' : 'Not verified', badge: user?.isEmailVerified ? 'success' : 'warning' },
            { label: 'Member Since', value: user?.createdAt ? formatDate(user.createdAt) : '—' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-dashed last:border-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : undefined }}>
              <span className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-surface-500')}>{item.label}</span>
              {item.badge ? (
                <Badge variant={item.badge} size="sm" dot>{item.value}</Badge>
              ) : (
                <span className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-surface-900')}>{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('font-display font-bold mb-4', isDark ? 'text-white' : 'text-surface-900')}>Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" onClick={() => navigate('/builder')} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }>
            Order Pizza
          </Button>
          <Button variant="outline" onClick={() => navigate('/menu')} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
            </svg>
          }>
            Browse Menu
          </Button>
          <Button variant="outline" onClick={() => navigate('/orders')} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          }>
            View Orders
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   PERSONAL INFO SECTION
   ============================================ */
function PersonalInfoSection() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { user, isSaving, error, successMessage } = useSelector((s) => s.profile);
  const fileInputRef = useRef(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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

  useEffect(() => {
    if (!isEditing && user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [isEditing, user]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const formData = new FormData();
    formData.append('avatar', file);
    dispatch(uploadAvatar(formData));
    e.target.value = '';
  }, [dispatch]);

  const handleRemoveAvatar = useCallback(() => {
    dispatch(removeAvatar());
  }, [dispatch]);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, phone })).then((res) => {
      if (!res.error) setIsEditing(false);
    });
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      <AnimatePresence>
        {successMessage && <Toast message={successMessage} type="success" onClose={() => dispatch(clearProfileSuccess())} />}
        {error && <Toast message={error} type="error" onClose={() => dispatch(clearProfileError())} />}
      </AnimatePresence>

      {/* Avatar Section */}
      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6 sm:p-8',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('text-lg font-display font-bold mb-6', isDark ? 'text-white' : 'text-surface-900')}>Profile Picture</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <button
              onClick={handleAvatarClick}
              className={cn(
                'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 overflow-hidden flex items-center justify-center transition-all duration-300',
                isDark ? 'bg-dark-800 border-dark-900' : 'bg-surface-100 border-white',
                'hover:ring-2 hover:ring-brand-500/50 hover:ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
              )}
              aria-label="Change profile picture"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className={cn('text-3xl font-bold', isDark ? 'text-white/30' : 'text-surface-400')}>
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
          <div className="text-center sm:text-left">
            <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>
              Upload a profile picture. Max size: 5MB.
            </p>
            <p className={cn('text-xs mt-1', isDark ? 'text-white/25' : 'text-surface-400')}>
              JPG, PNG or GIF
            </p>
          </div>
        </div>
      </motion.div>

      {/* Personal Details */}
      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6 sm:p-8',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={cn('text-lg font-display font-bold', isDark ? 'text-white' : 'text-surface-900')}>Personal Details</h3>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            }>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-5">
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
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              helperText="Email cannot be changed"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" loading={isSaving}>Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: user?.name || '—' },
              { label: 'Email', value: user?.email || '—', locked: true },
              { label: 'Phone', value: user?.phone || 'Not set' },
              { label: 'Email Verified', value: user?.isEmailVerified ? 'Yes' : 'No', badge: user?.isEmailVerified ? 'success' : 'warning' },
              { label: 'Member Since', value: user?.createdAt ? formatDate(user.createdAt) : '—' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-dashed last:border-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : undefined }}>
                <span className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-surface-500')}>{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge ? (
                    <Badge variant={item.badge} size="sm" dot>{item.value}</Badge>
                  ) : (
                    <span className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-surface-900')}>{item.value}</span>
                  )}
                  {item.locked && (
                    <svg className={cn('w-4 h-4', isDark ? 'text-white/20' : 'text-surface-300')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   ADDRESS BOOK SECTION
   ============================================ */
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editingAddress) {
      result = await dispatch(updateAddress({ id: editingAddress._id, data: form }));
    } else {
      result = await dispatch(createAddress(form));
    }
    if (!result.error) {
      onClose();
    }
  };

  const inputClass = cn(
    'w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-900 placeholder-surface-400',
    'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all',
    'dark:bg-dark-850 dark:border-white/[0.08] dark:text-white dark:placeholder-white/30'
  );
  const labelClass = cn('block text-xs font-medium mb-1', isDark ? 'text-white/50' : 'text-surface-500');

  return (
    <Modal open={open} onClose={onClose} title={editingAddress ? 'Edit Address' : 'Add New Address'} size="sm" className="sm:max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Name *</label>
            <input className={inputClass} value={form.recipientName} onChange={(e) => handleChange('recipientName', e.target.value)} required placeholder="John Doe" />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input className={inputClass} value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required placeholder="+1 555 0000" />
          </div>
        </div>
        <div>
          <label className={labelClass}>House / Flat *</label>
          <input className={inputClass} value={form.houseFlat} onChange={(e) => handleChange('houseFlat', e.target.value)} required placeholder="Apt 4B, House 12" />
        </div>
        <div>
          <label className={labelClass}>Street *</label>
          <input className={inputClass} value={form.street} onChange={(e) => handleChange('street', e.target.value)} required placeholder="123 Main Street" />
        </div>
        <div>
          <label className={labelClass}>Area</label>
          <input className={inputClass} value={form.area} onChange={(e) => handleChange('area', e.target.value)} placeholder="Downtown (optional)" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>City *</label>
            <input className={inputClass} value={form.city} onChange={(e) => handleChange('city', e.target.value)} required placeholder="New York" />
          </div>
          <div>
            <label className={labelClass}>Postal Code *</label>
            <input className={inputClass} value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} required placeholder="10001" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Label</label>
          <div className="flex gap-1.5">
            {ADDRESS_LABELS.map((lbl) => (
              <button
                key={lbl.value}
                type="button"
                onClick={() => handleChange('label', lbl.value)}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all',
                  form.label === lbl.value
                    ? isDark ? 'border-brand-500/30 bg-brand-500/10 text-brand-400' : 'border-brand-200 bg-brand-50 text-brand-600'
                    : isDark ? 'border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white/60' : 'border-surface-200 bg-surface-50 text-surface-500 hover:text-surface-700'
                )}
              >
                {lbl.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => handleChange('isDefault', e.target.checked)}
            className={cn(
              'w-3.5 h-3.5 rounded border-2 text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0 cursor-pointer',
              isDark ? 'border-white/20 bg-dark-850' : 'border-surface-300 bg-white'
            )}
          />
          <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-surface-500')}>Default address</span>
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={isSaving}>{editingAddress ? 'Update' : 'Add Address'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function AddressBookSection() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { addresses, isSaving } = useSelector((s) => s.profile);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  const handleEdit = (addr) => { setEditingAddress(addr); setShowForm(true); };
  const handleAdd = () => { setEditingAddress(null); setShowForm(true); };
  const handleClose = () => { setShowForm(false); setEditingAddress(null); };
  const handleDelete = (id) => { setDeletingAddressId(id); };
  const confirmDelete = async () => {
    if (deletingAddressId) {
      const result = await dispatch(deleteAddress(deletingAddressId));
      if (!result.error) {
        setDeletingAddressId(null);
      }
    }
  };
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
            icon={<svg className="w-10 h-10 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
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

      <Modal open={!!deletingAddressId} onClose={cancelDelete} size="sm" title="Delete Address">
        <p className={cn('text-sm mb-6', isDark ? 'text-white/50' : 'text-surface-500')}>
          Are you sure you want to delete this address? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <Button variant="ghost" onClick={cancelDelete}>Cancel</Button>
          <Button variant="danger" loading={isSaving} onClick={confirmDelete}>Delete Address</Button>
        </div>
      </Modal>
    </motion.div>
  );
}

/* ============================================
   SECURITY SECTION
   ============================================ */
function SecuritySection() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { isSaving, error, successMessage } = useSelector((s) => s.profile);
  const { user } = useSelector((s) => s.profile);
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

      {/* Email Verification Status */}
      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            user?.isEmailVerified ? 'bg-success-50 dark:bg-success-500/10' : 'bg-warning-50 dark:bg-warning-500/10'
          )}>
            {user?.isEmailVerified ? (
              <svg className="w-6 h-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className={cn('font-semibold', isDark ? 'text-white' : 'text-surface-900')}>Email Verification</h4>
            <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>
              {user?.isEmailVerified ? 'Your email is verified' : 'Please verify your email address'}
            </p>
          </div>
          {!user?.isEmailVerified && (
            <Button variant="outline" size="sm">Resend Verification</Button>
          )}
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6 sm:p-8',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('text-lg font-display font-bold mb-6', isDark ? 'text-white' : 'text-surface-900')}>Change Password</h3>
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

/* ============================================
   PREFERENCES SECTION
   ============================================ */
function PreferencesSection() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const dispatch = useDispatch();

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Appearance */}
      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('text-lg font-display font-bold mb-6', isDark ? 'text-white' : 'text-surface-900')}>Appearance</h3>

        <div className="flex items-center justify-between py-3 border-b border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : undefined }}>
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'
            )}>
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {isDark ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </>
                )}
              </svg>
            </div>
            <div>
              <p className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-surface-900')}>Dark Mode</p>
              <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>
                {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleDark}
            className={cn(
              'relative w-12 h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              isDark ? 'bg-brand-500' : 'bg-surface-300'
            )}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
          >
            <motion.div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
              animate={{ x: isDark ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Notifications placeholder */}
      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border p-6',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-surface-200'
      )}>
        <h3 className={cn('text-lg font-display font-bold mb-6', isDark ? 'text-white' : 'text-surface-900')}>Notifications</h3>

        {[
          { label: 'Order Updates', description: 'Receive notifications about your order status', enabled: true },
          { label: 'Promotions', description: 'Get notified about deals and special offers', enabled: false },
          { label: 'Newsletter', description: 'Weekly newsletter with pizza tips and recipes', enabled: false },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-dashed last:border-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : undefined }}>
            <div>
              <p className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-surface-900')}>{item.label}</p>
              <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>{item.description}</p>
            </div>
            <button
              className={cn(
                'relative w-12 h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                item.enabled ? 'bg-brand-500' : 'bg-surface-300 dark:bg-white/10'
              )}
              role="switch"
              aria-checked={item.enabled}
              aria-label={`Toggle ${item.label}`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: item.enabled ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={fadeUp} className={cn(
        'rounded-2xl border border-danger-200 dark:border-danger-500/20 p-6',
        isDark ? 'bg-danger-500/5' : 'bg-danger-50/50'
      )}>
        <h3 className={cn('text-lg font-display font-bold mb-2 text-danger-600 dark:text-danger-400')}>Danger Zone</h3>
        <p className={cn('text-sm mb-4', isDark ? 'text-white/40' : 'text-surface-500')}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="danger" size="sm" disabled>
          Delete Account
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   MAIN PROFILE PAGE
   ============================================ */
export default function Profile() {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { user, isLoading } = useSelector((s) => s.profile);
  const [activeSection, setActiveSection] = useState('overview');

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
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-6">
            <div className="hidden lg:block w-64">
              <Skeleton className="h-96 rounded-2xl" />
            </div>
            <div className="flex-1 space-y-6">
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'personal': return <PersonalInfoSection />;
      case 'addresses': return <AddressBookSection />;
      case 'security': return <SecuritySection />;
      case 'preferences': return <PreferencesSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Title */}
          <div className="mb-6">
            <h1 className={cn('text-2xl sm:text-3xl font-display font-bold', isDark ? 'text-white' : 'text-surface-900')}>
              Account Center
            </h1>
            <p className={cn('text-sm mt-1', isDark ? 'text-white/40' : 'text-surface-500')}>
              Manage your profile, addresses, and preferences
            </p>
          </div>

          <MobileTabBar activeSection={activeSection} onNavigate={setActiveSection} />

          <div className="flex gap-6">
            <SidebarNav activeSection={activeSection} onNavigate={setActiveSection} />

            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div key={activeSection}>
                  {renderSection()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
