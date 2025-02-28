import { auth } from '@/lib/auth';
import { release } from 'os';

const params = new URLSearchParams({
  limit: '50'
});

// Returns a users saved albums
export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchResponse = await fetch(
    `https://api.spotify.com/v1/me/albums?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      }
    }
  );

  if (!searchResponse.ok) {
    return Response.json(
      { error: 'Failed to fetch' },
      { status: searchResponse.status }
    );
  }

  const data = await searchResponse.json();

  const albums: Album[] = data.items.map((item: SpotifyAlbumResponse) => {
    return {
      id: item.album.id,
      name: item.album.name,
      artist: item.album.artists.map((artist) => artist.name).join(', '),
      image: item.album.images[0].url,
      releaseDate: item.album.release_date,
      totalTracks: item.album.total_tracks
    };
  });

  return Response.json(albums);
}

export type Album = {
  id: string;
  name: string;
  artist: string;
  image: string;
  releaseDate: string;
  totalTracks: number;
};

export type SpotifyAlbumResponse = {
  added_at: string;
  album: {
    album_type: string;
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: Array<{
      height: number;
      url: string;
      width: number;
    }>;
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
  };
};
