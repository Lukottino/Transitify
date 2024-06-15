import './App.css';
import Register from './Register';
import Login from './Login';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './Navbar';
import React from 'react';
import TravelPage from './TravelPage';
import RedirectRoute from './RedirectRoute';
import AdminPage from './AdminPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLoginSuccess = ({ token, type }) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('type', type);
  };

  return (
    <>
      <Router>
        <CustomNavbar />
        <div>
          <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/login' element={<Login handleLoginSuccess={handleLoginSuccess} />} />
            <Route path='/register' element={<Register handleLoginSuccess={handleLoginSuccess} />} />
            <Route path='/trip' element={<RedirectRoute><TravelPage /></RedirectRoute>} />
            <Route path='/administration' element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;