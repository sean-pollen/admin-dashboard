'use client';

import { useQuery } from '@tanstack/react-query';
import { Artist } from 'app/api/spotify/top-artists/route';
import { ArtistCard } from './artist-card';

const fetchTopArtists = async () => {
  const res = await fetch('/api/spotify/top-artists');
  return res.json();
};

const ArtistsList = () => {
  const { data } = useQuery<Artist[]>({
    queryKey: ['spotifyTopArtists'],
    queryFn: fetchTopArtists,
    staleTime: 1000 * 60 * 5
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Your Top Artists</h1>
      {data?.map((artist, idx) => {
        return <ArtistCard rank={idx} key={artist.uri} {...artist} />;
      })}
    </div>
  );
};

export default ArtistsList;
