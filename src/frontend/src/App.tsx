import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { CustomToolbar } from './components/CustomToolbar';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <CustomToolbar />
          <Routes>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
