import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`
    }
  });

  if (!response.ok) {
    return Response.json(
      { error: 'Failed to fetch' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data);
}
