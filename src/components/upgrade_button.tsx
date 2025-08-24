import React from 'react';
import { Zap } from 'lucide-react';

interface UpgradeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

const UpgradeButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, UpgradeButtonProps>(
  ({ asChild, children, className = "", ...props }, ref) => {
    const buttonClasses = `group relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-black dark:via-gray-900 dark:to-gray-800 text-white font-bold py-2 px-4 rounded-xl shadow-xl hover:shadow-gray-600/50 dark:hover:shadow-gray-400/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 ${className}`;

    const buttonEffects = (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 rounded-xl transform translate-x-0.5 translate-y-0.5 -z-10"></div>
        <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
        <div className="absolute inset-1 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-lg pointer-events-none"></div>
        <div className="absolute bottom-0 left-2 right-2 h-1 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-400 dark:via-gray-300 dark:to-gray-400 rounded-full blur-sm opacity-60"></div>
      </>
    );

    if (asChild && React.isValidElement(children)) {
      const childProps = children.props as any;
      const combinedClassName = `${buttonClasses} ${childProps.className || ''}`;
      
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        className: combinedClassName,
        children: (
          <>
            {buttonEffects}
            <div className="relative z-10 flex items-center gap-2">
              {childProps.children}
            </div>
          </>
        )
      });
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={buttonClasses} {...props}>
        {buttonEffects}
        <div className="relative z-10 flex items-center gap-2">
          {children || (
            <>
              <Zap size={16} />
              <span className="font-bold">Upgrade</span>
            </>
          )}
        </div>
      </button>
    );
  }
);

UpgradeButton.displayName = "UpgradeButton";

export default UpgradeButton;