'use client';

import { Album } from 'app/api/spotify/albums/route';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent
} from '../../../../components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Skeleton } from '../../../../components/ui/skeleton';
import { AlertCircle, User } from 'lucide-react';

interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  country: string;
  product: string;
  type: string;
  uri: string;
}

async function fetchSpotifyProfile(): Promise<SpotifyProfile> {
  const res = await fetch('/api/spotify');
  if (!res.ok) {
    throw new Error('Failed to fetch Spotify profile');
  }
  return res.json();
}

export default function SpotifyProfile() {
  const { 
    data: profile, 
    isLoading, 
    error,
    isError 
  } = useQuery({
    queryKey: ['spotifyProfile'],
    queryFn: fetchSpotifyProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  if (isLoading) {
    return (
      <Card className="container my-4">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="container my-4 border-destructive">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Error Loading Profile</CardTitle>
          </div>
          <CardDescription>
            {error instanceof Error ? error.message : 'Failed to load Spotify profile'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const profileImage = profile?.images?.[0]?.url;
  const displayName = profile?.display_name || 'Spotify User';
  const followerCount = profile?.followers?.total || 0;
  const country = profile?.country || 'Unknown';
  const accountType = profile?.product || 'Free';

  return (
    <Card className="container my-4">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profileImage} alt={displayName} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{displayName}</CardTitle>
            <CardDescription>
              Welcome to your Spotify dashboard
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {followerCount.toLocaleString()} followers
          </Badge>
          {country !== 'Unknown' && (
            <Badge variant="outline">
              {country}
            </Badge>
          )}
          <Badge variant={accountType === 'premium' ? 'default' : 'secondary'}>
            {accountType} account
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
