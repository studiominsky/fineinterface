'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: 190, height: 80 }} />;
  }

  const src =
    resolvedTheme === 'dark'
      ? '/fineinterface-dark.svg'
      : '/fineinterface-light.svg';

  return (
    <Link href="/" scroll={false}>
      <span className="flex items-center">
        <Image
          src={src}
          alt="Fine Interface Logo"
          width={190}
          height={40}
          priority
          className="h-[40px] w-[190px]"
        />
      </span>
    </Link>
  );
};

export default Logo;