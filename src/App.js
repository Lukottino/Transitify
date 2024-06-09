import './App.css';
import HomePage from './HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact Component={HomePage}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
