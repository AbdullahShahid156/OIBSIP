import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendMessage, fetchSuggestions, addUserMessage, clearMessages } from '../../store/slices/assistantSlice';
import { loadPreset } from '../../store/slices/builderSlice';
import { togglePanel, closePanel } from '../../store/slices/assistantSlice';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestionChips from './SuggestionChips';
import PIZZA_CONFIGS from '../../data/pizzaConfigs';

export default function AssistantPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, suggestions, isOpen, isTyping } = useSelector((s) => s.assistant);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSuggestions());
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, dispatch]);

  function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;

    dispatch(addUserMessage(msg));
    dispatch(sendMessage({ message: msg }));
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSuggestionSelect(text) {
    handleSend(text);
  }

  function handleCustomize(pizza) {
    const config = PIZZA_CONFIGS[pizza.name];
    if (config) {
      dispatch(loadPreset({ config, basePrice: pizza.basePrice || 8.99, name: pizza.name }));
      navigate('/builder');
      dispatch(closePanel());
    }
  }

  function handleAddToCart(pizza) {
    // ProductCard handles this internally via dispatch
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
            onClick={() => dispatch(closePanel())}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[60]
              top-20 bottom-20 right-4 left-4 sm:left-auto
              sm:top-20 sm:bottom-24 sm:right-6
              sm:w-[400px]
              rounded-2xl overflow-hidden
              bg-white dark:bg-dark-900
              border border-surface-200 dark:border-white/[0.08]
              shadow-2xl shadow-black/10 dark:shadow-black/40
              flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-white/[0.06] bg-gradient-to-r from-brand-500 to-brand-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L12 18l-3.7-3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z" />
                    <circle cx="12" cy="9" r="2" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">PizzaCraft Assistant</h3>
                  <p className="text-2xs text-white/70">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => dispatch(clearMessages())}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
                <button
                  onClick={() => dispatch(closePanel())}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onCustomize={handleCustomize}
                  onAddToCart={handleAddToCart}
                />
              ))}

              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && !isTyping && (
              <SuggestionChips suggestions={suggestions} onSelect={handleSuggestionSelect} />
            )}

            {/* Input */}
            <div className="p-3 border-t border-surface-200 dark:border-white/[0.06]">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about our pizzas..."
                    rows={1}
                    className="w-full resize-none rounded-xl px-4 py-2.5 text-sm
                      bg-surface-50 dark:bg-white/[0.06]
                      border border-surface-200 dark:border-white/[0.08]
                      text-surface-900 dark:text-white
                      placeholder-surface-400 dark:placeholder-white/30
                      focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50
                      transition-all duration-200
                      max-h-20 overflow-y-auto"
                    style={{ minHeight: '42px' }}
                  />
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white
                    hover:from-brand-400 hover:to-brand-500
                    disabled:opacity-40 disabled:cursor-not-allowed
                    shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40
                    transition-all duration-200 active:scale-95 flex-shrink-0"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>
              <p className="text-center text-2xs text-surface-400 dark:text-white/20 mt-2">
                Powered by PizzaCraft AI
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
