import { Message } from 'primereact/message';
import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthProvider';

import User from '@/shared/interfaces/user.interface';

export function PermissionWrapper(props: PropsWithChildren & { requiredPermission: 'Mentor' | 'Admin' }) {
  const auth: any = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    setUser(auth.auth.user);
  }, [auth]);
  const navigate = useNavigate();

  const isAdmin = user?.soloManagement.isAdmin;
  const isMentor = user?.soloManagement.isMentor;

  const denyAdminAccess = isAdmin === false && props.requiredPermission === 'Admin';

  const denyMentorAccess = isMentor === false && props.requiredPermission === 'Mentor';

  const denyAcess = denyAdminAccess || denyMentorAccess;

  if (denyAcess || !user) {
    return <><Message severity="error" text="You don't have access to this page." style={{ width: '50vw' }} /></>;
  }

  return <>{props.children}</>;
}

