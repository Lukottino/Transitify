import './App.css';
import Register from './Register';
import Login from './Login';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './Navbar';

function App() {
  return (
    <>
      <Router>
        <CustomNavbar />
        <div>
          <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login />}/>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
