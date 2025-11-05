'use client';

import { ReactNode, useState } from 'react';
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

  const Icon = icon === 'help' ? HelpCircle : Info;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex items-center" style={{ zIndex: isVisible ? 99999 : 'auto' }}>
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

      {isVisible && (
        <>
          {/* Backdrop for mobile - clicking outside closes */}
          <div
            className="fixed inset-0 lg:hidden"
            style={{ zIndex: 99998 }}
            onClick={() => setIsVisible(false)}
          />
          
          {/* Tooltip */}
          <div
            className={`absolute w-72 md:w-80 p-4 rounded-lg border shadow-xl ${positionClasses[position]}`}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-hover)',
              zIndex: 99999,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow */}
            <div
              className="absolute w-2 h-2 rotate-45"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-hover)',
                zIndex: 99998,
                ...(position === 'top' && {
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  borderRight: '1px solid',
                  borderBottom: '1px solid',
                }),
                ...(position === 'bottom' && {
                  top: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  borderLeft: '1px solid',
                  borderTop: '1px solid',
                }),
                ...(position === 'left' && {
                  right: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(45deg)',
                  borderTop: '1px solid',
                  borderRight: '1px solid',
                }),
                ...(position === 'right' && {
                  left: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(45deg)',
                  borderBottom: '1px solid',
                  borderLeft: '1px solid',
                }),
              }}
            />

            {/* Content */}
            <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', position: 'relative', zIndex: 99999 }}>
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
      )}
    </div>
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