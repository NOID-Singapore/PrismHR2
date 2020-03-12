import { createMuiTheme } from '@material-ui/core';
import { responsiveFontSizes } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    border: {
      primary: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    border?: {
      primary?: string;
    };
  }
}

let theme = createMuiTheme({
  border: {
    primary: grey[300]
  },
  palette: {
    primary: {
      main: '#00AFAB',
      contrastText: '#fff'
    },
    secondary: {
      main: '#ef965a',
      contrastText: '#fff'
    }
  },
  typography: {
    h1: {
      fontSize: '32px',
      fontWeight: 500
    },
    h2: {
      fontSize: '28px',
      fontWeight: 500
    },
    h3: {
      fontSize: '24px',
      fontWeight: 500
    },
    h4: {
      fontSize: '20px',
      fontWeight: 500
    },
    h5: {
      fontSize: '16px',
      fontWeight: 500
    },
    h6: {
      fontSize: '14px',
      fontWeight: 400
    },
    body1: {
      fontSize: '13px'
    },
    body2: {
      fontSize: '12px',
      lineHeight: '12px'
    },
    subtitle1: {
      fontSize: '13px',
      fontWeight: 500
    },
    button: {
      fontSize: '13px'
    },
    overline: {
      fontSize: '13px',
      lineHeight: '13px'
    },
    caption: {
      fontSize: '11px',
      lineHeight: '11px'
    }
  },
  overrides: {
    MuiOutlinedInput: {
      adornedStart: {
        paddingLeft: 0,
        marginLeft: 0
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;
