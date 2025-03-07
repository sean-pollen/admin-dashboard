import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { BoldIcon as ExplicitIcon, Music2Icon, PlayIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Track } from 'app/api/spotify/top-tracks/route';
import { Skeleton } from '@/components/ui/skeleton';

import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import TimePeriodSelector, {
  TimePeriod
} from '@/components/ui/time-period-selector';

const fetchTracks: QueryFunction<Track[]> = async ({
  queryKey
}) => {
  const [, timePeriod] = queryKey as [string, TimePeriod]; // Type assertion
  const queryParam = new URLSearchParams({ time_range: timePeriod });

  const response = await fetch(`/api/spotify/top-tracks?${queryParam}`);
  if (!response.ok) throw new Error('Failed to fetch tracks');

  return response.json();
};

export default function TrackList() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<TimePeriod>('short_term');

  const { data: tracks, isLoading } = useQuery<Track[], Error>({
    queryKey: ['top-tracks', selectedPeriod],
    queryFn: fetchTracks,
    staleTime: 1000 * 60 * 5
  });

  // Format duration from milliseconds to minutes:seconds
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number.parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  // Format release date to relative time
  const formatReleaseDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const TrackSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="w-full sm:w-[150px] h-[150px]" />
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex flex-col items-end justify-between">
              <Skeleton className="h-4 w-12" />
              <div className="w-24 space-y-1">
                <Skeleton className="h-1.5 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Your Top Tracks</h1>
        <TimePeriodSelector
          value={selectedPeriod}
          onChange={setSelectedPeriod}
        />
      </div>
      <div className="grid gap-4">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => <TrackSkeleton key={index} />)
          : tracks?.map((track) => (
              <Card key={track.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-auto sm:min-w-[150px] h-[150px]">
                    <Image
                      src={
                        track.album.images[0]?.url ||
                        '/placeholder.svg?height=150&width=150'
                      }
                      alt={track.album.name}
                      fill
                      className="object-cover"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-2 right-2 rounded-full opacity-90 hover:opacity-100"
                    >
                      <PlayIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="flex-1 p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-semibold">
                            {track.name}
                          </h2>
                          {track.explicit && (
                            <Badge variant="outline" className="text-xs">
                              <ExplicitIcon className="h-3 w-3 mr-1" />
                              Explicit
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {track.artists
                            .map((artist) => artist.name)
                            .join(', ')}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Music2Icon className="h-4 w-4" />
                          <span>{track.album.name}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span>
                            {formatReleaseDate(track.album.release_date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="text-sm">
                          {formatDuration(track.duration_ms)}
                        </div>
                        <div className="w-24 space-y-1">
                          <Progress
                            value={track.popularity}
                            className="h-1.5"
                          />
                          <p className="text-xs text-right text-muted-foreground">
                            Popularity: {track.popularity}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
