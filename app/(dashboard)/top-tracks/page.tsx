'use client';

import { useQuery } from '@tanstack/react-query';
import TrackList from './_components/TrackList';

const fetchTracks = async () => {
  const response = await fetch('/api/spotify/top-tracks');
  const data = await response.json();
  return data;
};

const TopTracksPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['top-tracks'],
    queryFn: fetchTracks
  });

  return <TrackList tracks={data} isLoading={isLoading} />;
};

export default TopTracksPage;
