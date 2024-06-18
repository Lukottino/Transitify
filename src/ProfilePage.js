import React, { Component } from 'react';
import { Button, Form, Col, Container, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class ProfilePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
          topRoutes: [],
          averageCost: 0,
          mostUsedTransport: [],
          cards: [],
          accountId: '',
          reloadAmount: 0,
          subscriptionZone : []
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
          console.log(this.state.accountId);
          console.log(this.state.cards);
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
          await axios.post(`http://localhost:3000/api/cards/${cardId}/reload`, { amount: this.state.reloadAmount });
          this.fetchCards(); // Refresh cards after reload
        } catch (error) {
          console.error('Errore durante la ricarica della carta:', error);
        }
      };
    
      handleSubscribe = async (cardId) => {
        try {
          await axios.post(`http://localhost:3000/api/cards/${cardId}/subscribe`, { zone: this.state.subscriptionZone });
          this.fetchCards(); // Refresh cards after subscribing
        } catch (error) {
          console.error('Errore durante la sottoscrizione dell\'abbonamento:', error);
        }
      };
    
      render() {
        const { cards, topRoutes, averageCost, mostUsedTransport, reloadAmount, subscriptionZone } = this.state;
    
        return (
          <Container style={{ paddingTop: '100px' }}>
            <h2>Profile Page</h2>
            <Row>
              <Col>
                <h3>Le tue carte</h3>
                {cards.map(card => (
                  <div key={card.cardId}>
                    <h4>Card ID: {card.cardId}</h4>
                    <p>Saldo: {card.saldo}€</p>
                    <Form.Group>
                      <Form.Label>Importo da ricaricare</Form.Label>
                      <Form.Control 
                        type="number" 
                        value={reloadAmount} 
                        onChange={this.handleReloadAmountChange} 
                      />
                      <Button onClick={() => this.handleReloadCard(card.cardId)}>Ricarica Carta</Button>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Zona per abbonamento</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={subscriptionZone} 
                        onChange={this.handleSubscriptionZoneChange} 
                      />
                      <Button onClick={() => this.handleSubscribe(card.cardId)}>Sottoscrivi Abbonamento</Button>
                    </Form.Group>
                  </div>
                ))}
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