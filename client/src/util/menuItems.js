import { useMemo } from 'react';
import { GitHub, Groups, Home, Info } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';

export const useMenuItems = () => {
  return useMemo(
    () => [
      { key: '', label: 'Home', labelHead: '', icon: <Home />, link: '#/', target: '_self' },
      { key: 'about', label: 'About', labelHead: 'About', icon: <Info />, link: 'https://klebnet.org/#about', target: '_blank' },
      { key: 'team', label: 'Team', labelHead: 'Team', icon: <Groups />, link: 'https://klebnet.org/#team', target: '_blank' },
      { key: 'contact', label: 'Contact', labelHead: 'Contact', icon: <EmailIcon />, link: 'https://klebnet.org/#links', target: '_blank' },
      { key: 'git', label: 'GitHub', labelHead: 'GitHub', icon: <GitHub />, link: 'https://github.com/amrnet/klebnet', target: '_blank' },
    ],
    []
  );
};
