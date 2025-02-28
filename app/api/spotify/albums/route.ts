import { auth } from '@/lib/auth';

// Returns a users saved albums
export async function GET() {
  const session = await auth();

  const searchResponse = await fetch('https://api.spotify.com/v1/me/albums', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.accessToken}`
    }
  });

  if (!searchResponse.ok) {
    return Response.json(
      { error: 'Failed to fetch' },
      { status: searchResponse.status }
    );
  }

  const data = await searchResponse.json();
  return Response.json(data);
}
