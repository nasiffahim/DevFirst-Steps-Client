
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuth from '../../app/hooks/useAuth';

export default function ProtectedPage({ children }) {
  const { user, loading } = useAuth();

const router = useRouter();
  const pathname = usePathname(); 
   useEffect(() => {
    if (!loading) {
      const noUser =
        !user || (!user.email && !user.providerData?.[0]?.email);

      if (noUser) {
        const redirectTo = `/login?redirect=${encodeURIComponent(pathname)}`;
        console.log("Redirecting to login with:", redirectTo);
        router.push(redirectTo);
      }
    }
  }, [user, loading, pathname, router]);
  const noUser =
    !user || (!user.email && !user.providerData?.[0]?.email);

  if (loading || noUser) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
