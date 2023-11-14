import { Message } from 'primereact/message';
import { PropsWithChildren, useContext, useEffect, useState } from 'react';

import AuthContext from '../contexts/AuthProvider';

import User from '@/shared/interfaces/user.interface';

export function AuthWrapper(props: PropsWithChildren) {
  const auth: any = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    setUser(auth.auth.user);
  }, [auth]);

  if (!user) {
    return <><Message severity="error" text="You don't have access to this page." style={{ width: '50vw' }} /></>;
  }

  return <>{props.children}</>;
}

