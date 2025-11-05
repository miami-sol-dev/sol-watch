'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, Info } from 'lucide-react';

interface TooltipProps {
  content: ReactNode;
  children?: ReactNode;
  icon?: 'help' | 'info';
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ 
  content, 
  children, 
  icon = 'help',
  position = 'top' 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // 80 * 4 (w-80)
      const tooltipHeight = 200; // Approximate
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - tooltipHeight - 8;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - 8;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + 8;
          break;
      }

      // Keep within viewport
      if (left < 8) left = 8;
      if (left + tooltipWidth > window.innerWidth - 8) {
        left = window.innerWidth - tooltipWidth - 8;
      }
      if (top < 8) top = rect.bottom + 8; // Flip to bottom if too high

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  const Icon = icon === 'help' ? HelpCircle : Info;

  const tooltipContent = isVisible && mounted ? (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 lg:hidden"
        style={{ zIndex: 999998 }}
        onClick={() => setIsVisible(false)}
      />
      
      {/* Tooltip */}
      <div
        className="fixed w-72 md:w-80 p-4 rounded-lg border shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-hover)',
          zIndex: 999999,
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {content}
        </div>

        {/* Close hint on mobile */}
        <div className="lg:hidden mt-3 pt-3 border-t text-xs text-center" style={{ 
          borderColor: 'var(--border-default)',
          color: 'var(--text-secondary)' 
        }}>
          Tap anywhere to close
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      <div className="relative inline-flex items-center" ref={triggerRef}>
        {children ? (
          <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={() => setIsVisible(!isVisible)}
            className="cursor-help"
          >
            {children}
          </div>
        ) : (
          <button
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={() => setIsVisible(!isVisible)}
            className="inline-flex items-center justify-center transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="More information"
          >
            <Icon className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {mounted && createPortal(tooltipContent, document.body)}
    </>
  );
}

// Preset tooltip content components for consistency
export function TooltipTitle({ children }: { children: ReactNode }) {
  return (
    <div className="font-bold mb-2 gradient-miami-text">
      {children}
    </div>
  );
}

export function TooltipSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      {title && (
        <div className="font-semibold mb-1" style={{ color: 'var(--text-accent)' }}>
          {title}
        </div>
      )}
      <div style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </div>
  );
}

export function TooltipExample({ children }: { children: ReactNode }) {
  return (
    <div 
      className="mt-2 p-2 rounded text-xs font-mono"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      💡 {children}
    </div>
  );
}