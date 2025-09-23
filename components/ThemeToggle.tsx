'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" disabled className="w-24">
        &nbsp;
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="w-24 justify-start gap-2"
    >
      {resolvedTheme === 'light' ? (
        <>
          <Moon className="size-4" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun className="size-4" />
          <span>Light</span>
        </>
      )}
    </Button>
  );
}