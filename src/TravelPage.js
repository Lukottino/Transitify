import React, { Component } from 'react';
import { Button, Form, Col, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class TravelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      lines: [],
      filteredStations: [],
      selectedDepartureId: '', // Aggiunto stato per l'ID della partenza
      selectedArrivalId: '',   // Aggiunto stato per l'ID dell'arrivo
      departure: '',           // Rimossa variabile non necessaria
      arrival: '',             // Rimossa variabile non necessaria
      tripMessage: '',
      possibleRoutes: []
    };
  }

  componentDidMount() {
    this.fetchStations();
  }

  fetchStations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/stations');
      const { stations, lines } = response.data;
      this.setState({
        stations: stations,
        lines: lines
      });
    } catch (error) {
      console.error('Errore durante il recupero delle stazioni e linee:', error);
    }
  };

  handleDepartureChange = (e) => {
    const selectedDepartureId = parseInt(e.target.value);
    const selectedDepartureStation = this.state.stations.find(station => station.idStazione === selectedDepartureId);

    if (selectedDepartureStation) {
      const filteredStations = this.state.stations.filter(station =>
        station.tipo === selectedDepartureStation.tipo &&
        station.idStazione !== selectedDepartureStation.idStazione
      );
      this.setState({
        selectedDepartureId: selectedDepartureId,
        filteredStations: filteredStations
      });
    } else {
      this.setState({ selectedDepartureId: '', filteredStations: [] });
    }
  };

  handleArrivalChange = (e) => {
    const selectedArrivalId = parseInt(e.target.value);
    this.setState({ selectedArrivalId: selectedArrivalId });
  };

  handleSimulateTrip = async () => {
    const { selectedDepartureId, selectedArrivalId } = this.state;

    if (selectedDepartureId && selectedArrivalId) {
      try {
        const response = await axios.post('http://localhost:3000/api/simulate-trip', {
          departureId: selectedDepartureId,
          arrivalId: selectedArrivalId
        });

        const tripData = response.data;
        // Gestisci la risposta come necessario
      } catch (error) {
        console.error('Errore durante la simulazione del viaggio:', error);
        this.setState({ tripMessage: 'Errore durante la simulazione del viaggio.' });
      }
    } else {
      this.setState({ tripMessage: 'Per favore seleziona sia la stazione di partenza che quella di arrivo.', possibleRoutes: [] });
    }
  };

  render() {
    return (
      <Container className="my-4" style={{ paddingTop: '40px' }}>
        <h1>Simulazione dei Viaggi</h1>
        <Row>
          <Col md={6}>
            <Form.Group controlId="departureStation">
              <Form.Label>Stazione di Partenza</Form.Label>
              <Form.Control as="select" value={this.state.selectedDepartureId} onChange={this.handleDepartureChange}>
                <option value="">Seleziona una stazione</option>
                {this.state.stations.map((station) => (
                  <option key={station.idStazione} value={station.idStazione}>
                    [{station.idStazione}] {station.nome}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="arrivalStation">
              <Form.Label>Stazione di Arrivo</Form.Label>
              <Form.Control as="select" value={this.state.selectedArrivalId} onChange={this.handleArrivalChange}>
                <option value="">Seleziona una stazione</option>
                {this.state.filteredStations.map((station) => (
                  <option key={station.idStazione} value={station.idStazione}>
                    [{station.idStazione}] {station.nome}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button variant="primary" onClick={this.handleSimulateTrip}>
              Simula Viaggio
            </Button>
            {this.state.tripMessage && <p className="mt-3">{this.state.tripMessage}</p>}
            {this.state.possibleRoutes.length > 0 && (
              <div>
                <h3>Percorsi con Trasferimento:</h3>
                <ul>
                  {this.state.possibleRoutes.map((route, index) => (
                    <li key={index}>
                      {route.segments.map((segment, idx) => (
                        <div key={idx}>
                          {idx > 0 && <span> -&gt; Trasferimento -&gt; </span>}
                          <span>{segment.fromStation.nome} ({segment.fromStation.tipo}) -&gt; {segment.toStation.nome}</span>
                        </div>
                      ))}
                      <p>Linea di Trasferimento: {route.transferStation.nome}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default TravelPage;
