import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Top artists for a user
export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchResponse = await fetch(
    `https://api.spotify.com/v1/me/top/artists`,
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

  const artists: Artist[] = data.items.map((item: SpotifyArtistResponse) => {
    return {
      id: item.id,
      name: item.name,
      genres: item.genres,
      images: item.images,
      popularity: item.popularity,
      uri: item.uri
    };
  });

  return NextResponse.json(artists);
}

export type SpotifyArtistResponse = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

export type Artist = Pick<
  SpotifyArtistResponse,
  'id' | 'name' | 'images' | 'genres' | 'popularity' | 'uri'
>;

export type Image = {
  height: number;
  url: string;
  width: number;
};
