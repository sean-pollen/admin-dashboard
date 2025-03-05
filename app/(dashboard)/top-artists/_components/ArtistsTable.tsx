'use client';

import { useQuery } from '@tanstack/react-query';
import { Artist } from 'app/api/spotify/top-artists/route';
import { ArtistCard } from './ArtistCard';

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

  return data?.map((artist) => {
    return <ArtistCard key={artist.uri} {...artist} />;
  });
};

export default ArtistsList;
