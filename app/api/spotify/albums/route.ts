import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Returns a users saved albums

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const offset = searchParams.get('offset')
    ? parseInt(searchParams.get('offset')!)
    : 0;
  const limit = 20;

  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

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
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: searchResponse.status }
    );
  }

  const data = await searchResponse.json();

  const albums: Album[] = data.items.map((item: SpotifyAlbumResponse) => ({
    id: item.album.id,
    name: item.album.name,
    artist: item.album.artists.map((artist) => artist.name).join(', '),
    image: item.album.images[0].url,
    releaseDate: item.album.release_date,
    totalTracks: item.album.total_tracks
  }));

  // Determine next offset
  const nextOffset = data.next ? offset + limit : null;

  return NextResponse.json({ albums, nextOffset });
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
