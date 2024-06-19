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
      selectedDepartureId: '',
      selectedArrivalId: '',
      selectedCardId: '',
      selectedSharedCardId : '',
      tripMessage: '',
      possibleRoutes: [],
      cards: [],
      accountId: '',
      cost: 0,
      cardUpdated: []
    };
  }

  componentDidMount() {
    this.setState({ accountId: localStorage.getItem('accountId') }, () => {
      this.fetchStations();
      this.fetchCards();
    });
  }

  fetchCards = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/account/${this.state.accountId}/cards`);
      this.setState({ cards: response.data });
      console.log(this.state.accountId);
      console.log(this.state.cards);
    } catch (error) {
      console.error('Errore durante il recupero delle carte:', error);
    }
  };

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

  handleSharedCardChange = (e) => {
    this.setState({ selectedSharedCardId: e.target.value });
  }

  handleCardChange = (e) => {
    this.state.selectedCardId = parseInt(e.target.value);
    console.log("card: ", this.state.selectedCardId)
  };

  handleSimulateTrip = async () => {
    let { selectedDepartureId, selectedArrivalId, selectedCardId, selectedSharedCardId } = this.state;

    let cardType = "UNIQUE";

    if(selectedSharedCardId != '') {
      selectedCardId = selectedSharedCardId;
      cardType = "SHARED";
    }

    if (selectedDepartureId && selectedArrivalId && selectedCardId) {
      try {
        const response = await axios.post('http://localhost:3000/api/simulate-trip', {
          departureId: selectedDepartureId,
          arrivalId: selectedArrivalId,
          selectedCardId: selectedCardId,
          cardType: cardType
        });

        const tripData = response.data;

        if (tripData.route === 'direct') {
          this.setState({
            tripMessage: '',
            possibleRoutes: [{
              segments: [{
                fromStation: tripData.stations[0],
                toStation: tripData.stations[1]
              }]
            }],
            cost: tripData.cost,
            cardUpdated: tripData.cardUpdated
          });
        } else if (tripData.route === 'transfer') {
          this.setState({
            tripMessage: '',
            possibleRoutes: tripData.transferRoutes.map(route => ({
              transferStation: route.transferStation,
              segments: route.segments
            })),
            cost: tripData.cost,
            cardUpdated: tripData.cardUpdated
          });
        } else {
          this.setState({
            tripMessage: 'Nessun percorso trovato.',
            possibleRoutes: [],
            cost: 0,
            cardUpdated: []
          });
        }

      } catch (error) {
        console.error('Errore durante la simulazione del viaggio:', error);
        this.setState({ tripMessage: 'Errore durante la simulazione del viaggio.', possibleRoutes: [] });
      }
    } else {
      this.setState({ tripMessage: 'Per favore seleziona sia la stazione di partenza, arrivo e la carta.', possibleRoutes: [] });
    }
  };

  render() {
    return (
      <Container className="my-4" style={{ paddingTop: '40px' }}>
        <h1>Simulazione dei Viaggi</h1>
        <Row>
          <Col md={3}>
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
          <Col md={3}>
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
          <Col md={3}>
            <Form.Group controlId="cards">
              <Form.Label>Carte</Form.Label>
              <Form.Control as="select" value={this.state.selectedCardId} onChange={this.handleCardChange}>
                <option value="">Seleziona una carta</option>
                {this.state.cards.map((card) => (
                  <option key={card.cardId} value={card.cardId}>
                    [{card.cardId}] €{card.saldo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="sharedCard">
              <Form.Label>Numero Carta</Form.Label>
              <Form.Control type="text" value={this.state.selectedSharedCardId} onChange={this.handleSharedCardChange} placeholder="Numero della carta" />
            </Form.Group>
          </Col>
        </Row>
        <Button onClick={this.handleSimulateTrip} className="my-4" style={{ width: '100%' }}>
          Simula Viaggio
        </Button>

        {this.state.tripMessage && <p>{this.state.tripMessage}</p>}

        {this.state.possibleRoutes.length > 0 && (
          <div>
            <h3>Percorsi Possibili</h3>
            {this.state.possibleRoutes.map((route, index) => (
              <div key={index} className="route">
                {this.state.possibleRoutes.map((route, index) => (
                  <li style={{ listStyleType:'none' }} key={index}>
                      {route.segments.map((segment, idx) => (
                        segment.fromStation && segment.toStation && (
                          <div key={idx}>
                            <p>Check-In: {this.state.stations.find(station => station.idStazione === this.state.selectedDepartureId)?.nome}</p>
                            {idx >= 0 && <p>Check-In: {segment.fromStation && segment.fromStation.nome} ({segment.fromStation && segment.fromStation.tipo})</p>}
                            {idx >= 0 && <p>Check-Out: {segment.toStation && segment.toStation.nome} ({segment.toStation && segment.toStation.tipo})</p>}
                          </div>
                        )
                      ))}
                      {route.segments.map((segment, idx) => (
                        <div key={idx}>
                            {segment.fromLine && <p>Linea: {segment.fromLine.nome}</p>}
                            {segment.toLine && <p>Linea di Trasferimento: {segment.toLine.nome}</p>}
                        </div>
                      ))}
                      <div>
                        <p>Costo: €{this.state.cost}</p>
                      </div>
                      <div>
                        <p>Nuovo saldo: €{this.state.cardUpdated.newBalance}</p>
                      </div>
                  </li>
                ))}
              </div>
            ))}
          </div>
        )}
      </Container>
    );
  }
}

export default TravelPage;
