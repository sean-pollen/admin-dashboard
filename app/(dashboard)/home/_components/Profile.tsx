'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Link, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/custom/link-button';

interface Album {
  id: string;
  name: string;
  artist: string;
  image: string;
  releaseDate: string;
  totalTracks: number;
}

interface Profile {
  username: string;
  top4: Album[];
  location: string;
  followers: number;
  following: number;
  bio: string;
}

// Mock data for demonstration - replace with actual API call
const fetchProfile = async (): Promise<Profile> => {
  // In a real app, this would be a fetch call to your API
  return {
    username: 'seanpollen',
    location: 'Toronto, ON',
    followers: 1248,
    following: 567,
    bio: 'Those who go to sleep with itchy bumb, shall wake up with smelly finger!',
    top4: [
      {
        id: '1',
        name: 'In Rainbows',
        artist: 'Radiohead',
        image:
          'https://i.scdn.co/image/ab67616d0000b27334733f87148c2fbe0176abdb',
        releaseDate: '2007',
        totalTracks: 10
      },
      {
        id: '2',
        name: 'In Utero',
        artist: 'Nirvana',
        image:
          'https://i.scdn.co/image/ab67616d0000b273c4f52ef8782f0e8ede4c1aaf',
        releaseDate: '1994',
        totalTracks: 16
      },
      {
        id: '3',
        name: 'In Waves',
        artist: 'Jamie XX',
        image:
          'https://i.scdn.co/image/ab67616d0000b2733126a95bb7ed4146a80c7fc6',
        releaseDate: '2025',
        totalTracks: 17
      },
      {
        id: '4',
        name: 'Visions',
        artist: 'Grimes',
        image:
          'https://i.scdn.co/image/ab67616d0000b273a6352fa3ba528451bfe08298',
        releaseDate: '2012',
        totalTracks: 11
      }
    ]
  };
};

async function fetchSpotifyProfile() {
  const res = await fetch('/api/spotify');
  const data = await res.json();
  return data;
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['spotifyProfile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5
  });

  const { data: spotifyProfile, isLoading: isSpotifyLoading } = useQuery({
    queryKey: ['spotifyProfile2'],
    queryFn: fetchSpotifyProfile,
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  console.log(spotifyProfile);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-xl mx-auto my-4 max-w-4xl">
      <div className="rounded-xl shadow-sm overflow-hidden items-center">
        {/* Profile Header */}
        <div className="bg-gradient-to-t from-black to-green-900 h-32 md:h-48 w-full"></div>

        <div className="px-4 sm:px-6 lg:px-8 pb-8 -mt-28">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end ">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-md">
              <AvatarImage
                src={spotifyProfile?.images[0].url}
                alt={spotifyProfile?.display_name}
              />
            </Avatar>

            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-4xl font-bold">{profile.username}</h1>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
                <LinkButton
                  isExternal
                  variant={'link'}
                  href={spotifyProfile?.external_urls?.spotify}
                  openInNewTab
                >
                  Spotify Profile
                </LinkButton>
              </div>
              <div className="flex items-center justify-center sm:justify-start mt-1 space-x-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="font-medium">{profile.followers}</span>
                  <span className="ml-1 text-gray-500">followers</span>
                </div>
                <div>
                  <span className="font-medium">{profile.following}</span>
                  <span className="ml-1 text-gray-500">following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-8 mb-4">
            <p>{profile.bio}</p>
          </div>

          {/* Top Albums */}
          <TopAlbums albums={profile.top4} />
        </div>
      </div>
    </div>
  );
}

interface TopAlbumsProps {
  albums: Album[];
}

const TopAlbums = (props: TopAlbumsProps) => {
  const { albums } = props;
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Top Albums</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {albums.map((album) => (
          <Card
            key={album.id}
            className="overflow-hidden hover:shadow-md transition-shadow bg-inherit"
          >
            <CardHeader className="p-0">
              <Image
                src={album.image || '/placeholder.svg'}
                alt={album.name}
                width={300}
                height={300}
                className="w-full h-auto aspect-square object-cover"
              />
            </CardHeader>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm truncate" title={album.name}>
                {album.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">{album.artist}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header Skeleton */}
        <div className="bg-gray-200 h-32 md:h-48 animate-pulse"></div>

        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          {/* Avatar and Info Skeleton */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 mb-6">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-300 border-4 border-white animate-pulse"></div>

            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left w-full sm:w-64">
              <div className="h-7 bg-gray-300 rounded w-3/4 mx-auto sm:mx-0 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 mx-auto sm:mx-0 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mt-2 mx-auto sm:mx-0 animate-pulse"></div>
            </div>
          </div>

          {/* Bio Skeleton */}
          <div className="mb-8">
            <div className="h-6 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>

          {/* Albums Skeleton */}
          <div>
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 aspect-square rounded-t-lg"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
