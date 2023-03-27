import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { LensAuthContextProvider } from './context/LensContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/header/Footer';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MemeList from "./components/Lists/MemeList"
import TrendingList from "./components/Lists/TrendingList"
import StorieList from "./components/Lists/StorieList"
import Profile from "./components/Profile"
import TrendingDetails from './components/DetailPages/TrendingDetails'
import NewProfile from './components/NewProfile/NewProfile';
import Header from './components/header/Header';
import NewdisplayPublication from './components/Marketplace/NFTPost/DisplayNftPost';
import NftDetailPage from './components/Marketplace/DetailPage/detailPage';

let darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2',
          h2: 'h2',
          h3: 'h2',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'h2',
          subtitle2: 'h2',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },
  typography: {
    fontFamily: [
      '"Rubik"',
    ].join(','),
  },
});

darkTheme = responsiveFontSizes(darkTheme);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <ToastContainer />
      <LensAuthContextProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/memers" element={<MemeList />} />
            <Route path="/trending" element={<TrendingList />} />
            <Route path="/stories" element={<StorieList />} />
            {/* // <Route path="/contest" element={<ContestList />} /> */}
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/newprofile/:id" element={<NewProfile />} />
            <Route path="/marketplace" element={<NewdisplayPublication/>} />
            {/* <Route path="/marketplace" element={<NftDetailPage/>} /> */}
            <Route path="/detail/:id" element={<NftDetailPage/>} />

            <Route path="/trendingDetails/:id" element={<TrendingDetails />} />
            {/* <Route path="/contestDetails/:id" element={<ContestDetails />} /> */}
          </Routes>
          {/* <Footer /> */}
        </BrowserRouter>
      </LensAuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
