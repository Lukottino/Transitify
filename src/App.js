import './App.css';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact Component={HomePage}/>
          <Route path='/register' exact Component={Register}/>
          <Route path='/login' exact Component={Login}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
