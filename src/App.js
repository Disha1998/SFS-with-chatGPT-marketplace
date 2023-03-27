
import './App.css';
import Header from './components/header/Header';
import Stories from './components/Stories';
import TopCreators from './components/TopCreators';
import TrendingSlider from './components/TrendingSlider';
import HeaderTabs from './components/HeaderTabs';
import RightNav from './components/RightNav';

function App() {
  return (
    <div className='footer-position' style={{ marginTop: '100px' }}>
      {/* <Header /> */}
     <div className='container'>
     <div className='row p-0'>
        <div className='col-lg-9 col-sm-12'>
          <HeaderTabs />
        </div>
        <div className='col-lg-3 mb-5'>
          <div className='container'>
            <RightNav />
          </div>
        </div> 
      </div>
     </div>

      {/* <TopCreators/> */}
      {/* <Search/> */}
      {/* <TrendingSlider/> */}
      {/* <ArtistSlider/>  */}
      {/* <Stories/> */}
    </div>
  );
}

export default App;
