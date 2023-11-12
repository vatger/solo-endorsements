import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { CustomToolbar } from './components/CustomToolbar';
import SoloEndorsements from './components/SoloEndorsements';
import Stations from './components/Stations';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <CustomToolbar />
          <Routes>
            <Route path='/' element={<SoloEndorsements />} />
            <Route path='/stations' element={<Stations />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
