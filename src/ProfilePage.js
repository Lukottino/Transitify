import React, { Component } from 'react';
import { Button, Form, Col, Container, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topRoutes: [],
      averageCost: 0,
      mostUsedTransport: [],
      cards: [],
      trips: [],
      card: "",
      accountId: '',
      reloadAmount: 0,
      subscriptionZone: '',
      selectedUniqueCardId: '',
      selectedSharedCardId: '',
      reloadMessage: '',
      subscribeMessage: '',
      isUniqueSelected: true, // Default to unique card
      nome: '',
      cognome: '',
      email: '',
      selectedCardId: '',
      complaintMessage: '',
      complaintResult: null,
      selectedTrip: '',
      filteredTrips: []
    };
  }

  componentDidMount() {
    this.setState(
      { accountId: localStorage.getItem('accountId') },
      () => {
        this.fetchCards();
        this.fetchStatistics();
        this.fetchTrips();
      }
    );
  }

  fetchCard = async (cardId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/card/${cardId}`);
      this.setState({ card: response.data[0] });
    } catch (error) {
      console.error('Errore durante il recupero della carta:', error);
    }
  }

  fetchTrips = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/trips`);
      this.setState({ trips: response.data });
    } catch (error) {
      console.error('Errore durante il recupero dei viaggi:', error);
    }
  };

  fetchCards = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/account/${this.state.accountId}/cards`);
      this.setState({ cards: response.data });
    } catch (error) {
      console.error('Errore durante il recupero delle carte:', error);
    }
  };

  fetchStatistics = async () => {
    try {
      const [routesResponse, costResponse, transportResponse] = await Promise.all([
        axios.get(`http://localhost:3000/api/account/${this.state.accountId}/top-routes`),
        axios.get(`http://localhost:3000/api/account/${this.state.accountId}/average-cost`),
        axios.get(`http://localhost:3000/api/account/${this.state.accountId}/most-used-transport`)
      ]);
      this.setState({
        topRoutes: routesResponse.data,
        averageCost: Math.round(costResponse.data[0].prezzoMedio * 100) / 100,
        mostUsedTransport: transportResponse.data
      });
    } catch (error) {
      console.error('Errore durante il recupero delle statistiche:', error);
    }
  };

  handleReloadAmountChange = (e) => {
    this.setState({ reloadAmount: e.target.value });
  };

  handleSubscriptionZoneChange = (e) => {
    this.setState({ subscriptionZone: e.target.value });
  };

  handleReloadCard = async (cardId) => {
    try {
      let selectedCard = '';
      if (this.state.isUniqueSelected) {
        selectedCard = this.state.cards.find(card => card.cardId === this.state.selectedUniqueCardId);
      } else {
        selectedCard = this.state.card;
      }
      const newBalance = parseFloat(selectedCard.saldo.replace(',', '.')) + parseFloat(this.state.reloadAmount);
      if (parseFloat(this.state.reloadAmount) < 1) {
        throw new Error("Errore quantità errata.")
      }
      await axios.put(`http://localhost:3000/api/cards/${cardId}/reload`, { newBalance: newBalance });
      this.fetchCards(); // Refresh cards after reload
      this.fetchCard(cardId);
      this.setState({ reloadMessage: 'Ricarica completata con successo!' });
    } catch (error) {
      console.error('Errore durante la ricarica della carta:', error);
      this.setState({ reloadMessage: 'Errore durante la ricarica della carta, la quantità deve essere maggiore di €1.' });
    }
  };

  handleSubscribe = async (cardId) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/cards/${cardId}/subscribe`, { zone: this.state.subscriptionZone });
      this.fetchCards();
      this.setState({ subscribeMessage: `Abbonato alla zona ${this.state.subscriptionZone}!` });
    } catch (error) {
      console.error('Errore durante la sottoscrizione dell\'abbonamento:', error);
      this.setState({ subscribeMessage: `Errore durante la sottoscrizione dell'abbonamento` });
    }
  };

  handleTripChange = (e) => {
    this.setState({ selectedTrip: parseInt(e.target.value, 10) });
  };

  handleCardChange = (e) => {
    const selectedCardId = parseInt(e.target.value, 10);
    this.setState({ selectedCardId: selectedCardId });
    const filteredTrips = this.state.trips.filter(trip =>
      trip.cardId === selectedCardId
    );
    
    console.log("card: ", selectedCardId)
    console.log(filteredTrips)
    this.setState({ filteredTrips: filteredTrips })
  };

  handleUniqueCardChange = (e) => {
    this.setState({ selectedUniqueCardId: parseInt(e.target.value, 10), isUniqueSelected: true });
  };

  handleSharedCardChange = (e) => {
    this.setState({ selectedSharedCardId: parseInt(e.target.value, 10), isUniqueSelected: false });
    this.fetchCard(e.target.value);
  };

  handleBuyCard = async () => {
    try {
      const { nome, cognome, email, isUniqueSelected, accountId } = this.state;
      const cardType = isUniqueSelected ? 'UNIQUE' : 'SHARED';
      await axios.post(`http://localhost:3000/api/card/${cardType}/buy`, { nome, cognome, email, accountId });

      this.fetchCards();
      this.fetchStatistics();

      this.setState({ message: 'Acquisto completato con successo!' });
    } catch (error) {
      console.error('Errore durante l\'acquisto della carta:', error);
      this.setState({ message: 'Errore durante l\'acquisto della carta.' });
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleComplaintMessageChange = (e) => {
    this.setState({ complaintMessage: e.target.value });
  };

  handleSubmitComplaint = async () => {
    const { selectedCardId, complaintMessage, selectedTrip } = this.state;
    console.log(selectedCardId, complaintMessage, selectedTrip)
    try {
      const response = await axios.post('http://localhost:3000/api/complaint', {
        cardId: selectedCardId,
        messaggio: complaintMessage,
        trip: selectedTrip
      });
      this.setState({ complaintResult: response.data });
    } catch (error) {
      console.error('Errore durante l\'invio del reclamo:', error);
    }
  };

  render() {
    const { cards, selectedCardId, filteredTrips, selectedTrip, complaintMessage, complaintResult, topRoutes, averageCost, mostUsedTransport, reloadAmount, subscriptionZone, selectedUniqueCardId, selectedSharedCardId, message, subscribeMessage, reloadMessage, isUniqueSelected, nome, cognome, email } = this.state;

    return (
      <Container style={{ paddingTop: '100px' }}>
        <h2>Profile Page</h2>
        <Row>
          <Col>
            <h3>Acquista una nuova carta</h3>
            <Form>
              <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="Inserisci il nome" name="nome" value={nome} onChange={this.handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formCognome">
                <Form.Label>Cognome</Form.Label>
                <Form.Control type="text" placeholder="Inserisci il cognome" name="cognome" value={cognome} onChange={this.handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Inserisci l'email" name="email" value={email} onChange={this.handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formCardType">
                <Form.Label>Tipo di carta</Form.Label>
                <Form.Check
                  type="radio"
                  label="Unique"
                  checked={isUniqueSelected}
                  onChange={() => this.setState({ isUniqueSelected: true })}
                />
                <Form.Check
                  type="radio"
                  label="Shared"
                  checked={!isUniqueSelected}
                  onChange={() => this.setState({ isUniqueSelected: false })}
                />
              </Form.Group>
              <Button variant="primary" onClick={this.handleBuyCard}>Acquista Carta</Button>
              {message && <p style={{ color: message.includes('errore') || message.includes('Errore') ? 'red' : 'green' }}>{message}</p>}
            </Form>
          </Col>
          <Col>
            <h3>Le tue carte</h3>
            <Form.Group controlId="cards">
              <Form.Label>Carte</Form.Label>
              <Form.Control as="select" value={selectedUniqueCardId} onChange={this.handleUniqueCardChange}>
                <option value="">Seleziona una carta</option>
                {cards.map((card) => (
                  <option key={card.cardId} value={card.cardId}>
                    [{card.cardId}] €{card.saldo}
                  </option>
                ))}
              </Form.Control>
              <Form.Group controlId="sharedCard">
                <Form.Label>Numero Carta</Form.Label>
                <Form.Control type="text" value={selectedSharedCardId} onChange={this.handleSharedCardChange} placeholder="Numero della carta" />
              </Form.Group>
              {(selectedUniqueCardId !== '' || selectedSharedCardId !== '') &&
                <>
                  <Form.Group style={{ marginTop: '50px' }}>
                    <Form.Label>Importo da ricaricare</Form.Label>
                    <Form.Control
                      type="number"
                      value={reloadAmount}
                      onChange={this.handleReloadAmountChange}
                    />
                    <Button style={{ marginTop: '10px' }} onClick={() => this.handleReloadCard(isUniqueSelected ? selectedUniqueCardId : selectedSharedCardId)} >Ricarica Carta</Button>
                  </Form.Group>
                  {reloadMessage && <p style={{ color: reloadMessage.includes('errore') || reloadMessage.includes('Errore') ? 'red' : 'green' }}>{reloadMessage}</p>}
                  <Form.Group style={{ marginTop: '50px' }}>
                    <Form.Label>Zona per abbonamento</Form.Label>
                    <Form.Control
                      type="text"
                      value={subscriptionZone}
                      onChange={this.handleSubscriptionZoneChange}
                    />
                    <Button style={{ marginTop: '10px' }} onClick={() => this.handleSubscribe(selectedUniqueCardId)}>Sottoscrivi Abbonamento</Button>
                  </Form.Group>
                  {subscribeMessage && <p style={{ color: subscribeMessage.includes('errore') || subscribeMessage.includes('Errore') ? 'red' : 'green' }}>{subscribeMessage}</p>}
                </>
              }
            </Form.Group>
          </Col>
          <Col>
            <h3>Statistiche</h3>
            <h4>Percorsi più frequenti</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Percorso</th>
                  <th>Frequenza</th>
                </tr>
              </thead>
              <tbody>
                {topRoutes.map((route, index) => (
                  <tr key={index}>
                    <td>{route.percorso}</td>
                    <td>{route.Frequenza}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h4>Costo medio per viaggio</h4>
            <p>{averageCost}€</p>
            <h4>Tipo di mezzo più utilizzato</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tipo Mezzo</th>
                  <th>Utilizzi</th>
                </tr>
              </thead>
              <tbody>
                {mostUsedTransport.map((type, index) => (
                  <tr key={index}>
                    <td>{type.tipoStazione}</td>
                    <td>{type.utilizzi}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <h2>Invia un reclamo</h2>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="formCard">
                <Form.Label>Seleziona la carta</Form.Label>
                <Form.Control as="select" value={selectedCardId} onChange={this.handleCardChange}>
                  <option value="">Seleziona una carta</option>
                  {cards.map((card) => (
                    <option key={card.cardId} value={card.cardId}>
                      [{card.cardId}] €{card.saldo}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control as="select" value={selectedTrip} onChange={this.handleTripChange}>
                  <option value="">Seleziona un viaggio</option>
                  {filteredTrips.map((trip) => (
                    <option key={trip.idViaggio} value={trip.idViaggio}>
                      [{trip.idViaggio}] {trip.dataInizio} - {trip.dataFine}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formComplaintMessage">
                <Form.Label>Messaggio di reclamo</Form.Label>
                <Form.Control as="textarea" rows={3} value={complaintMessage} onChange={this.handleComplaintMessageChange} />
              </Form.Group>
              <Button style={{ marginTop: "10px" }} variant="primary" onClick={this.handleSubmitComplaint}>Invia reclamo</Button>
            </Form>
          </Col>
        </Row>
        {complaintResult && (
          <Row className="mt-3">
            <Col>
              {complaintResult.success ? (
                <p style={{ color: 'green' }}>Reclamo inviato con successo! ID: {complaintResult.reclamoId}</p>
              ) : (
                <p style={{ color: 'red' }}>Errore durante l'invio del reclamo.</p>
              )}
            </Col>
          </Row>
        )}
      </Container>
    );
  }  
}

export default ProfilePage;
