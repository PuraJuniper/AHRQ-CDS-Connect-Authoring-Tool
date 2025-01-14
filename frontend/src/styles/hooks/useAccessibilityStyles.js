import { makeStyles } from '@mui/styles';

export default makeStyles(
  {
    srOnly: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      margin: '-1px',
      padding: '0',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      border: '0'
    }
  },
  { name: 'Accessibility' }
);
