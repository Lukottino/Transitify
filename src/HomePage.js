import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import './HomePage.css'; // Importa il file CSS

function HomePage() {
  let navigate = useNavigate(); 
  const routeChange = (path) => { 
    navigate(path);
  }

  return (
    <>
      <div className="homepage-container">
        <div className="content">
          <div className="text-section">
            <h1 className="title">Cos'è Transitify?</h1>
            <p className="description">
              Transitify è un sistema innovativo basato su carta elettronica con cui puoi viaggiare su bus, treni, e tram. Con questo sistema, puoi fare Check-in e Check-out direttamente nelle relative stazioni/fermate, garantendo un viaggio più semplice da gestire.
            </p>
          </div>
          <div className="button-section-vertical">
            <Button variant='outlined' onClick={() => routeChange("/login")} className="login-button">Login</Button>
            <label className="register-label">O se non hai un account</label>
            <a href='/register' className="register-link">Registrati</a>
          </div>
        </div>
      </div>
      
      <div className="trip-section">
        <div className="trip-content">
          <h2 className="trip-title">Viaggia con Transitify</h2>
          <p className="trip-description">Esplora il nostro sistema di simulazione del trasporto pubblico. Pianifica il tuo viaggio con Transitify e scopri quanto può essere semplice.</p>
          <Button variant='outlined' onClick={() => routeChange("/trip")} className="trip-button">VIAGGIA!</Button>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <p>Contatti</p>
          <a href="mailto:luca.trianti@gmail.com">luca.trianti@gmail.com</a>
          <a href="https://github.com/Lukottino/Transitify" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/luca-trianti-362176227/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
