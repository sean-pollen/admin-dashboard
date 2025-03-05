'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../components/ui/card';
import { useQuery } from '@tanstack/react-query';

async function fetchSpotifyProfile() {
  const res = await fetch('/api/spotify');
  const data = await res.json();
  return data;
}

export default function SpotifyProfile() {
  const { data: profile } = useQuery({
    queryKey: ['spotifyProfile'],
    queryFn: fetchSpotifyProfile,
    staleTime: 1000 * 60 * 5
  });

  return (
    <Card className={'w-1/2'}>
      <CardHeader>
        <CardTitle>Welcome {profile?.display_name}!</CardTitle>
        <CardDescription>You are logged in!</CardDescription>
      </CardHeader>
    </Card>
  );
}
