import { useLocation, Navigate } from 'react-router-dom';

import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { Progress } from '../ui/progress';
import { ReactElement } from 'react';

export function RequireAuth({ children }: { children: ReactElement }) {
  const location = useLocation();

  return (
    <>
      <Authenticated>{children}</Authenticated>
      <AuthLoading>
        <div>
            <Progress />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <Navigate to="/" state={{ from: location }} replace />
      </Unauthenticated>
    </>
  );
}
