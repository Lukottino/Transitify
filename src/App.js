import './App.css';
import Register from './Register';
import Login from './Login';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './Navbar';
import React from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    const handleLoginSuccess = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
    };
  return (
    <>
      <Router>
        <CustomNavbar />
        <div>
          <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login handleLoginSuccess={handleLoginSuccess}/>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
