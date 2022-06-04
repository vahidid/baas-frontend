import { ToastContainer } from 'material-react-toastify';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import 'material-react-toastify/dist/ReactToastify.css';

// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';


// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
      <ToastContainer />
    </ThemeProvider>
  );
}
