'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useCallback } from 'react';

interface Album {
  id: string;
  name: string;
  artist: string;
  image: string;
  releaseDate: string;
  totalTracks: number;
}

interface FetchSpotifyAlbumsResponse {
  albums: Album[];
  nextOffset: number | null;
}

const fetchSpotifyAlbums = async ({
  pageParam = 0
}): Promise<FetchSpotifyAlbumsResponse> => {
  const res = await fetch(`/api/spotify/albums?offset=${pageParam}`);
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
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ['albums'],
    queryFn: fetchSpotifyAlbums,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? null,
    staleTime: 1000 * 60 * 60
  });

  const albums = data?.pages.flatMap((page) => page.albums) ?? [];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: '100px',
      threshold: 0.1
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
        {Array.from({ length: 10 }).map((_, idx) => (
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

      {/* Intersection Observer target for infinite scroll */}
      <div ref={loadMoreRef} className="col-span-full flex justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex items-center space-x-2">
            <Loader className="h-5 w-5 animate-spin" />
            <span className="text-sm text-gray-500">Loading more albums...</span>
          </div>
        )}
        {!hasNextPage && albums.length > 0 && (
          <p className="text-sm text-gray-500">You've reached the end of your albums</p>
        )}
      </div>
    </div>
  );
}
