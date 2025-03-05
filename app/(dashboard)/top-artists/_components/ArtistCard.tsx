import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Artist } from 'app/api/spotify/top-artists/route';
import { Badge } from '@/components/ui/badge';

export const ArtistCard = (artist: Artist & { rank: number }) => {
  const title = `${artist.name}`;
  return (
    <Card
      key={artist.name}
      className="hover:shadow-lg transition-shadow sm:w-full m:w-1/2 lg:w-1/2 m-auto"
    >
      <div className={'flex flex-row'}>
        <Image
          src={artist.images[0]?.url}
          alt={artist.name}
          width={600}
          height={600}
          className="w-1/3 p-4 rounded-sm"
        />
        <CardContent className="p-4 w-2/3">
          <div className="flex flex-row items-center">
            <div>
              <CardTitle className="text-3xl font-bold">{title}</CardTitle>
              <GenreBadges genres={artist.genres} />
            </div>
            <Badge className="px-6 py-2 text-xl font-bold ml-auto">
              {artist.rank + 1}
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const GenreBadges = ({ genres }: { genres: string[] }) => {
  return (
    <div className="flex flex-row gap-2 my-3">
      {genres.map((genre) => (
        <Badge className={'px-2 py-1'} key={genre} variant={'secondary'}>
          {genre
            .split(' ')
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ')}
        </Badge>
      ))}
    </div>
  );
};
