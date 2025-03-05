import { auth } from '@/lib/auth';

export const UserName = async () => {
  const session = await auth();
  const user = session?.user;

  return <h2>{user?.name}</h2>;
};
