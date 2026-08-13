import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn } from '../../utils/helpers';

const paymentMethods = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    label: 'TEST MODE',
    description: 'Credit/Debit Card, UPI',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    label: 'SANDBOX',
    description: 'Mobile Account, Card',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
];

export default function PaymentMethodSelector({ selectedMethod, onSelect }) {
  const { isDark } = useDarkMode();

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <motion.button
            key={method.id}
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(method.id)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left',
              isSelected
                ? isDark
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-brand-500 bg-brand-50'
                : isDark
                  ? 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                  : 'border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50'
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
              isSelected
                ? 'bg-brand-500 text-white'
                : isDark
                  ? 'bg-white/[0.06] text-white/40'
                  : 'bg-surface-100 text-surface-400'
            )}>
              {method.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'font-display font-bold text-sm',
                  isSelected
                    ? isDark ? 'text-white' : 'text-surface-900'
                    : isDark ? 'text-white/70' : 'text-surface-700'
                )}>
                  {method.name}
                </span>
                <span className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                  method.id === 'razorpay'
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'bg-emerald-500/10 text-emerald-500'
                )}>
                  {method.label}
                </span>
              </div>
              <p className={cn(
                'text-xs mt-0.5',
                isDark ? 'text-white/30' : 'text-surface-400'
              )}>
                {method.description}
              </p>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
              isSelected
                ? 'border-brand-500 bg-brand-500'
                : isDark
                  ? 'border-white/20'
                  : 'border-surface-300'
            )}>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-white"
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
