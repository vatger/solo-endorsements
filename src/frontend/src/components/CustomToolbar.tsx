import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';
import { Toolbar } from 'primereact/toolbar';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthProvider';
import AuthService from '../services/auth.service';

import { FrontendSettings } from '@/shared/interfaces/config.interface';
import User from '@/shared/interfaces/user.interface';


export const CustomToolbar = () => {
  const [config, setConfig] = useState<FrontendSettings>();
  const [user, setUser] = useState<User>();
  const auth: any = useContext(AuthContext);

  const navigate = useNavigate();

  async function logout() {
    await AuthService.logout();

    window.location.reload();
  }

  const redirectToVatsimAuth = () => {
    const authUrl = [
      config?.vatsimAuthUrl,
      '/oauth/authorize',
      '?',
      'client_id=',
      config?.clientId,
      '&',
      'redirect_uri=',
      window.location.protocol,
      '//',
      window.location.host,
      '/api/v1/auth/login',
      '&',
      'response_type=code',
      '&',
      'scope=full_name+vatsim_details',
      '&',
      'required_scopes=full_name+vatsim_details',
      '&',
      'approval_prompt=auto',
    ].join('');
    window.location.replace(authUrl);
  };

  // navigation tab menu
  const tabMenuItems = [
    {
      label: 'Solos', icon: 'pi pi-user', command: () => { navigate('/'); },
    }, {
      label: 'Stations', icon: 'pi pi-cog', command: () => { navigate('/stations'); },
    }];
  const startContent = [<TabMenu key='LoginTabmenu' model={tabMenuItems} />];

  // login / logout tabmenu
  const defaultItems = {
    label: `${user ? 'Logout' : 'Login'}`, icon: `${user ? 'pi pi-power-off' : 'pi pi-user'}`, command: () => { if (!user) { redirectToVatsimAuth(); } else { logout(); } },
  };
  const [items, setItems] = useState<MenuItem[]>([defaultItems]);

  useEffect(() => {
    setUser(auth.auth.user);

    AuthService.getConfig()
      .then((data) => {
        setConfig(data);
      })
      .catch((e) => {
        console.error(e);
      });

    if (user) {
      setItems([{
        label: `${user?.apidata.cid}`,
      }, defaultItems]);
    } else {
      setItems([defaultItems]);
    }
  }, [auth]);

  const endContent = [<TabMenu key='TabmenuLogin' model={items} />];

  return <Toolbar start={startContent} end={endContent} />;
};
