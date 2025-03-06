import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Top artists or tracks for a user
export async function GET(request: NextRequest) {
  const session = await auth();
  const { searchParams } = request.nextUrl;

  const time_range = searchParams.get('time_range') || 'short_term';
  const limit = searchParams.get('limit') || '50';
  const offset = searchParams.get('offset') || '0';

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchResponse = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}&offset=${offset}`,
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

  const response = await searchResponse.json();
  const data: SpotifyTrackResponse[] = response.items;

  const tracks: Track[] = data.map((item) => ({
    album: {
      artists: item.album.artists.map((artist) => {
        return {
          id: artist.id,
          name: artist.name
        };
      }),
      available_markets: item.album.available_markets,
      id: item.album.id,
      images: item.album.images,
      name: item.album.name,
      release_date: item.album.release_date,
      total_tracks: item.album.total_tracks
    },
    artists: item.artists.map((artist) => {
      return {
        id: artist.id,
        name: artist.name
      };
    }),
    available_markets: item.available_markets,
    duration_ms: item.duration_ms,
    explicit: item.explicit,
    id: item.id,
    name: item.name,
    popularity: item.popularity,
    preview_url: item.preview_url,
    track_number: item.track_number,
    uri: item.uri
  }));

  return NextResponse.json(tracks);
}

export type SpotifyTrackResponse = {
  album: {
    album_type: string;
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      height: number;
      url: string;
      width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
  };
  artists: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};

export type Track = {
  album: {
    artists: {
      id: string;
      name: string;
    }[];
    available_markets: string[];
    id: string;
    images: {
      height: number;
      url: string;
      width: number;
    }[];
    name: string;
    release_date: string;
    total_tracks: number;
  };
  artists: {
    id: string;
    name: string;
  }[];
  available_markets: string[];
  duration_ms: number;
  explicit: boolean;
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  uri: string;
};
