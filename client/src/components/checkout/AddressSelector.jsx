import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useDarkMode } from '../../hooks';
import { cn } from '../../utils/helpers';
import { Modal } from '../ui';

export default function AddressSelector({ selectedAddressId, onSelect }) {
  const { isDark } = useDarkMode();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const addresses = user?.addresses || [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleSelect = useCallback((addressId) => {
    onSelect(addressId);
  }, [onSelect]);

  const handleEdit = useCallback((address) => {
    setEditingAddress(address);
    setShowAddModal(true);
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      onSelect(defaultAddress._id);
    }
  }, [selectedAddressId, defaultAddress, onSelect]);

  const labelIcons = {
    home: '🏠',
    office: '🏢',
    other: '📍',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          'text-sm font-display font-bold uppercase tracking-wider',
          isDark ? 'text-white/50' : 'text-surface-400'
        )}>
          Delivery Address
        </h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditingAddress(null); setShowAddModal(true); }}
          className={cn(
            'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all',
            isDark
              ? 'text-brand-400 hover:bg-brand-500/10'
              : 'text-brand-600 hover:bg-brand-50'
          )}
        >
          + Add New
        </motion.button>
      </div>

      {addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-6 rounded-2xl border-2 border-dashed text-center',
            isDark
              ? 'border-white/[0.08] bg-white/[0.02]'
              : 'border-surface-200 bg-surface-50'
          )}
        >
          <div className={cn(
            'w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3',
            isDark ? 'bg-white/[0.04]' : 'bg-surface-100'
          )}>
            <span className="text-2xl">📍</span>
          </div>
          <p className={cn('text-sm font-medium mb-1', isDark ? 'text-white/60' : 'text-surface-600')}>
            No saved addresses
          </p>
          <p className={cn('text-xs mb-4', isDark ? 'text-white/30' : 'text-surface-400')}>
            Add a delivery address to continue
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Address
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {addresses.map((address) => (
            <motion.button
              key={address._id}
              layout
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => handleSelect(address._id)}
              className={cn(
                'w-full text-left p-4 rounded-2xl border transition-all duration-300',
                selectedAddressId === address._id
                  ? isDark
                    ? 'bg-brand-500/10 border-brand-500/30 shadow-lg shadow-brand-500/5'
                    : 'bg-brand-50/50 border-brand-200 shadow-sm'
                  : isDark
                    ? 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
                    : 'bg-white border-surface-200 hover:border-surface-300'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg',
                  selectedAddressId === address._id
                    ? isDark ? 'bg-brand-500/20' : 'bg-brand-100'
                    : isDark ? 'bg-white/[0.06]' : 'bg-surface-100'
                )}>
                  {labelIcons[address.label?.toLowerCase()] || '📍'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-sm font-semibold capitalize',
                      isDark ? 'text-white' : 'text-surface-900'
                    )}>
                      {address.label || 'Address'}
                    </span>
                    {address.isDefault && (
                      <span className={cn(
                        'px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md',
                        isDark
                          ? 'bg-success-500/15 text-success-400'
                          : 'bg-success-50 text-success-600'
                      )}>
                        Default
                      </span>
                    )}
                    {selectedAddressId === address._id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/40' : 'text-surface-500')}>
                    {address.recipientName && <>{address.recipientName}, </>}
                    {address.houseFlat && <>{address.houseFlat}, </>}
                    {address.street && <>{address.street}, </>}
                    {address.area && <>{address.area}, </>}
                    {address.city}{address.postalCode ? ` ${address.postalCode}` : ''}
                  </p>
                  {address.phone && (
                    <p className={cn('text-xs mt-1', isDark ? 'text-white/25' : 'text-surface-400')}>
                      {address.phone}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(address); }}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors flex-shrink-0',
                    isDark
                      ? 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]'
                      : 'text-surface-400 hover:text-surface-600 hover:bg-surface-100'
                  )}
                  aria-label={`Edit ${address.label} address`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AddressModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingAddress(null); }}
        editingAddress={editingAddress}
      />
    </div>
  );
}

function AddressModal({ open, onClose, editingAddress }) {
  const { isDark } = useDarkMode();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    recipientName: '',
    phone: '',
    houseFlat: '',
    street: '',
    area: '',
    city: '',
    postalCode: '',
    label: 'home',
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
      });
    } else {
      setForm({
        recipientName: user?.name || '',
        phone: user?.phone || '',
        houseFlat: '',
        street: '',
        area: '',
        city: '',
        postalCode: '',
        label: 'home',
      });
    }
  }, [editingAddress, user, open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In Phase 10 this will dispatch to profileSlice to add/edit address
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editingAddress ? 'Edit Address' : 'Add New Address'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={cn('text-xs font-medium mb-1.5 block', isDark ? 'text-white/50' : 'text-surface-500')}>
              Recipient Name
            </label>
            <input
              type="text"
              value={form.recipientName}
              onChange={handleChange('recipientName')}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/30'
                  : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
              )}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className={cn('text-xs font-medium mb-1.5 block', isDark ? 'text-white/50' : 'text-surface-500')}>
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/30'
                  : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
              )}
              placeholder="Phone number"
            />
          </div>
        </div>
        <div>
          <label className={cn('text-xs font-medium mb-1.5 block', isDark ? 'text-white/50' : 'text-surface-500')}>
            House / Flat
          </label>
          <input
            type="text"
            value={form.houseFlat}
            onChange={handleChange('houseFlat')}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50',
              isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/30'
                : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
            )}
            placeholder="Apt, suite, floor, etc."
          />
        </div>
        <div>
          <label className={cn('text-xs font-medium mb-1.5 block', isDark ? 'text-white/50' : 'text-surface-500')}>
            Street Address
          </label>
          <input
            type="text"
            value={form.street}
            onChange={handleChange('street')}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50',
              isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/30'
                : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
            )}
            placeholder="Street address"
          />
        </div>
        <div>
          <label className={cn('text-xs font-medium mb-1.5 block', isDark ? 'text-white/50' : 'text-surface-500')}>
            Area / Neighborhood
          </label>
          <input
            type="text"
            value={form.area}
            onChange={handleChange('area')}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50',
              isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/30'
                : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
            )}
            placeholder="Area or neighborhood"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={cn('text-xs font-medium mb-1.5 block', isDark ? 'text-white/50' : 'text-surface-500')}>
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={handleChange('city')}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/30'
                  : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
              )}
              placeholder="City"
            />
          </div>
          <div>
            <label className={cn('text-xs font-medium mb-1.5 block', isDark ? 'text-white/50' : 'text-surface-500')}>
              Postal Code
            </label>
            <input
              type="text"
              value={form.postalCode}
              onChange={handleChange('postalCode')}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/30'
                  : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
              )}
              placeholder="Postal code"
            />
          </div>
        </div>
        <div>
          <label className={cn('text-xs font-medium mb-1.5 block', isDark ? 'text-white/50' : 'text-surface-500')}>
            Label
          </label>
          <div className="flex gap-2">
            {['home', 'office', 'other'].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, label }))}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all',
                  form.label === label
                    ? isDark
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                      : 'bg-brand-50 text-brand-600 border border-brand-200'
                    : isDark
                      ? 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:border-white/[0.12]'
                      : 'bg-surface-50 text-surface-500 border border-surface-200 hover:border-surface-300'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex-1 py-3 rounded-xl text-sm font-semibold transition-all',
              isDark
                ? 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] border border-white/[0.06]'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-surface-200'
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300"
          >
            {editingAddress ? 'Save Changes' : 'Add Address'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
