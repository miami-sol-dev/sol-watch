'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      className={`rounded-xl p-6 border ${
        hover ? 'hover:scale-[1.02] transition-transform cursor-pointer' : ''
      } ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
}

export function CardHeader({ icon, title, subtitle, badge, children }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {badge && (
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          {badge}
        </span>
      )}
      {children}
    </div>
  );
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export function CardSection({ children, className = '' }: CardSectionProps) {
  return (
    <div
      className={`border-t pt-6 mt-6 ${className}`}
      style={{ borderColor: 'var(--border-default)' }}
    >
      {children}
    </div>
  );
}