import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'min(900px, calc(100vw - 48px))',
  className = '',
  overlayClassName = '',
  reportBodyRef
}) {
  const internalBodyRef = useRef(null);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scrolling on both document.body and .app-main
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const appMain = document.querySelector('.app-main');
    const originalAppMainOverflow = appMain ? appMain.style.overflowY : '';

    document.body.style.overflow = 'hidden';
    if (appMain) {
      appMain.style.overflowY = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      if (appMain) {
        appMain.style.overflowY = originalAppMainOverflow;
      }
    };
  }, [isOpen]);

  // Force scroll position to top whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const resetScroll = () => {
        if (internalBodyRef.current) {
          internalBodyRef.current.scrollTo({ top: 0, behavior: 'instant' });
          internalBodyRef.current.scrollTop = 0;
        }
        if (reportBodyRef?.current) {
          reportBodyRef.current.scrollTo({ top: 0, behavior: 'instant' });
          reportBodyRef.current.scrollTop = 0;
        }
      };

      resetScroll();
      // Double check in the next animation frame for asynchronous rendering
      const frameId = requestAnimationFrame(resetScroll);
      return () => cancelAnimationFrame(frameId);
    }
  }, [isOpen, title, reportBodyRef]);

  if (!isOpen) return null;

  return (
    <div
      className={`report-modal-overlay modal-backdrop ${overlayClassName}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`report-modal modal-dialog ${className}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: Fixed within modal, always visible */}
        <div className="report-modal-header modal-header">
          <div>
            <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="no-print"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.04)',
              transition: 'background var(--transition-fast)'
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Flex 1, independently scrollable, min-height: 0 */}
        <div
          ref={(node) => {
            internalBodyRef.current = node;
            if (typeof reportBodyRef === 'function') reportBodyRef(node);
            else if (reportBodyRef) reportBodyRef.current = node;
          }}
          className="report-modal-body modal-body"
        >
          {children}
        </div>

        {/* Modal Footer: Fixed within modal */}
        {footer && (
          <div className="report-modal-footer modal-footer no-print">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
