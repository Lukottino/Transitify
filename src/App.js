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
import ProfilePage from './ProfilePage';

function App() {
  const [, setIsAuthenticated] = React.useState(false);

  const handleLoginSuccess = ({ token, type, accountId }) => {
    console.log("ACCOUNT ID: ?", accountId)
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('type', type);
    localStorage.setItem('accountId', accountId);
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
            <Route path='/administration' element={<RedirectRoute><AdminPage /></RedirectRoute>} />
            <Route path="/profile" element={<RedirectRoute><ProfilePage /></RedirectRoute>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;