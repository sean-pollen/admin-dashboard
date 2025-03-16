'use client';

import type React from 'react';

import { forwardRef } from 'react';
import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LinkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isExternal?: boolean;
  openInNewTab?: boolean;
  showExternalIcon?: boolean;
  className?: string;
  children: React.ReactNode;
}

const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(
  (
    {
      href,
      variant = 'default',
      size = 'default',
      isExternal,
      openInNewTab,
      showExternalIcon = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Check if the link is external
    const isExternalLink =
      isExternal || href.startsWith('http') || href.startsWith('//');

    // Determine if we should open in a new tab
    const shouldOpenNewTab = openInNewTab || false;

    // External link attributes for security
    const externalLinkProps =
      isExternalLink && shouldOpenNewTab
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {};

    // Button content with optional external icon
    const buttonContent = (
      <>
        {children}
        {isExternalLink && shouldOpenNewTab && showExternalIcon && (
          <ExternalLink className="ml-2 h-4 w-4" />
        )}
      </>
    );

    // For external links or when explicitly requested to open in a new tab
    if (isExternalLink) {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={size}
          className={cn('cursor-pointer', className)}
          asChild
          {...props}
        >
          <a href={href} {...externalLinkProps}>
            {buttonContent}
          </a>
        </Button>
      );
    }

    // For internal links, use Next.js Link component
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('cursor-pointer', className)}
        asChild
        {...props}
      >
        <Link href={href} {...externalLinkProps}>
          {buttonContent}
        </Link>
      </Button>
    );
  }
);

LinkButton.displayName = 'LinkButton';

export { LinkButton };
