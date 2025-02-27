'use client'; // 👈 Must be a client component

import { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function SpotifyProfile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchSpotifyProfile() {
      const res = await fetch('/api/spotify'); // 👈 Calls your API route
      const data = await res.json();
      setProfile(data);
    }

    fetchSpotifyProfile();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome {profile?.display_name}!</CardTitle>
        <CardDescription>You are logged in!</CardDescription>
      </CardHeader>
    </Card>
  );
}
