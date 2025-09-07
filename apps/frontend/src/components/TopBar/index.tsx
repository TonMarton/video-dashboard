import { ReactNode } from 'react';

interface TopBarProps {
  children: ReactNode;
}

function TopBar({ children }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
}

export default TopBar;
