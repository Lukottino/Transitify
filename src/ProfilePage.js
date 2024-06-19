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
      accountId: '',
      reloadAmount: 0,
      subscriptionZone: '',
      selectedCardId: '',
      message: '',
      subscribeMessage: ''
    };
  }

  componentDidMount() {
    this.setState(
      { accountId: localStorage.getItem('accountId') },
      () => {
        this.fetchCards();
        this.fetchStatistics();
      }
    );
  }

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
      const selectedCard = this.state.cards.find(card => card.cardId === this.state.selectedCardId);
      const newBalance = parseFloat(selectedCard.saldo.replace(',', '.')) + parseFloat(this.state.reloadAmount);
      if(parseFloat(this.state.reloadAmount) < 1) {
        throw new Error("Errore quantità errata.")
      }
      await axios.put(`http://localhost:3000/api/cards/${cardId}/reload`, { newBalance: newBalance });
      this.fetchCards(); // Refresh cards after reload
      this.setState({ message: 'Ricarica completata con successo!' }); // Imposta il messaggio di successo
    } catch (error) {
      console.error('Errore durante la ricarica della carta:', error);
      this.setState({ message: 'Errore durante la ricarica della carta, la quantità deve essere maggiore di €1.' }); // Imposta il messaggio di errore
    }
  };
  

  handleSubscribe = async (cardId) => {
    try {
      this.state.subscribeMessage = await axios.post(`http://localhost:3000/api/cards/${cardId}/subscribe`, { zone: this.state.subscriptionZone });
      this.fetchCards();
      this.setState({ subscribeMessage: `Abbonato alla zona ${this.state.subscriptionZone}!` });
    } catch (error) {
      console.error('Errore durante la sottoscrizione dell\'abbonamento:', error);
      this.setState({ subscribeMessage: `Errore durante la sottoscrizione dell'abbonamento` });
    }
  };

  handleCardChange = (e) => {
    this.setState({ selectedCardId: parseInt(e.target.value, 10) });
  };

  render() {
    const { cards, topRoutes, averageCost, mostUsedTransport, reloadAmount, subscriptionZone, selectedCardId, message, subscribeMessage } = this.state;
  
    return (
      <Container style={{ paddingTop: '100px' }}>
        <h2>Profile Page</h2>
        <Row>
          <Col>
            <h3>Le tue carte</h3>
            <Form.Group controlId="cards">
              <Form.Label>Carte</Form.Label>
              <Form.Control as="select" value={selectedCardId} onChange={this.handleCardChange}>
                <option value="">Seleziona una carta</option>
                {cards.map((card) => (
                  <option key={card.cardId} value={card.cardId}>
                    [{card.cardId}] €{card.saldo}
                  </option>
                ))}
              </Form.Control>
              {selectedCardId !== '' &&
                <>
                  <Form.Group style={{ marginTop: '50px' }}>
                    <Form.Label>Importo da ricaricare</Form.Label>
                    <Form.Control
                      type="number"
                      value={reloadAmount}
                      onChange={this.handleReloadAmountChange}
                    />
                    <Button style={{ marginTop: '10px' }} onClick={() => this.handleReloadCard(selectedCardId)}>Ricarica Carta</Button>
                  </Form.Group>
                  {message && <p style={{ color: message.includes('errore') || message.includes('Errore') ? 'red' : 'green' }}>{message}</p>} {/* Messaggio visibile */}
                  <Form.Group style={{ marginTop: '50px' }}>
                    <Form.Label>Zona per abbonamento</Form.Label>
                    <Form.Control
                      type="text"
                      value={subscriptionZone}
                      onChange={this.handleSubscriptionZoneChange}
                    />
                    <Button style={{ marginTop: '10px' }} onClick={() => this.handleSubscribe(selectedCardId)}>Sottoscrivi Abbonamento</Button>
                  </Form.Group>
                  {subscribeMessage && <p style={{ color: subscribeMessage.includes('errore') || subscribeMessage.includes('Errore') ? 'red' : 'green' }}>{subscribeMessage}</p>} {/* Messaggio visibile */}
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
      </Container>
    );
  }  
}

export default ProfilePage;
