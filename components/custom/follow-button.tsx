'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Check, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  initialFollowing?: boolean;
  userId: string;
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function FollowButton({
  initialFollowing = false,
  userId,
  onFollow,
  onUnfollow,
  size = 'default',
  className
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    setIsLoading(true);

    try {
      if (isFollowing) {
        onUnfollow && (await onUnfollow(userId));
      } else {
        onFollow && (await onFollow(userId));
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size={size}
      className={className}
      onClick={handleToggleFollow}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </>
      ) : isFollowing ? (
        <>
          {isHovering ? (
            <span className="text-destructive">Unfollow</span>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Following
            </>
          )}
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
