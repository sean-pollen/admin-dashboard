import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import { Artist } from 'app/api/spotify/top-artists/route';

export const ArtistCard = (artist: Artist) => {
  // 'id' | 'name' | 'images' | 'genres' | 'popularity' | 'uri'

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
          <CardTitle className="text-3xl font-bold">{artist.name}</CardTitle>
        </CardContent>
      </div>
    </Card>
  );
};
