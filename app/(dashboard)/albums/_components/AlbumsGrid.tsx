'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Album } from 'app/api/spotify/albums/route';
import Image from 'next/image';

export const fetchSpotifyAlbums = async () => {
  const res = await fetch('/api/spotify/albums');
  return res.json();
};

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <Card className="bg-gray-200 shadow-none">
        <CardHeader className="p-0">
          <div className="bg-gray-300 w-full h-64 rounded-t-lg" />
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AlbumsGrid() {
  const {
    data: albums,
    isError,
    isLoading
  } = useQuery<Album[]>({
    queryKey: ['spotifyAlbums'],
    queryFn: fetchSpotifyAlbums,
    staleTime: 1000 * 60 * 5
  });

  if (isLoading || !albums) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonLoader key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-center text-red-500">Failed to fetch albums</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
      {albums.map((album) => (
        <Card key={album.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            <Image
              src={album.image}
              alt={album.name}
              width={300}
              height={300}
              className="w-full h-auto rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg font-medium">{album.name}</CardTitle>
            <p className="text-sm text-gray-500">{album.artist}</p>
            <p className="text-xs text-gray-400">{album.releaseDate}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
