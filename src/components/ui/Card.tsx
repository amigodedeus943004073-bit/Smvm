import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
}

export function Card({ children, className, title, icon }: CardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm", className)}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <div className="p-2 bg-zinc-100 rounded-lg">{icon}</div>}
          {title && <h3 className="font-semibold text-zinc-700">{title}</h3>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
