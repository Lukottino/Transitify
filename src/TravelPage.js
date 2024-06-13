import * as React from 'react';
import { Button, Card, Form, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assicurati di importare il CSS di Bootstrap
import axios from "axios";

class TravelPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          stations: [],
          departure: '',
          arrival: '',
          tripMessage: ''
        };
    }

    componentDidMount() {
      this.fetchStations();
    }

    fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stations');
        console.log(response.data)
        this.setState({ ...this.state, stations: response.data });
      } catch (error) {
        console.error('Errore durante il recupero delle stazioni:', error);
      }
    };

    handleDepartureChange = (e) => {
      this.setState({ ...this.state, departure: e.target.value });
    };

    handleArrivalChange = (e) => {
      this.setState({ ...this.state, arrival: e.target.value });
    };

    handleSimulateTrip = () => {
        const { departure, arrival } = this.state;
        if (departure && arrival) {
          this.setState({ tripMessage: `Simulazione del viaggio da ${departure} a ${arrival}` });
        } else {
          this.setState({ tripMessage: 'Per favore seleziona sia la stazione di partenza che quella di arrivo.' });
        }
    };

    render(){
        return(
            <>
                <Container className="my-4" style={{ paddingTop: '40px' }}>
                    <h1>Simulazione dei Viaggi</h1>
                    <Row>
                    <Col md={6}>
                        <Form.Group controlId="departureStation">
                        <Form.Label>Stazione di Partenza</Form.Label>
                        <Form.Control as="select" value={this.state.departure} onChange={this.handleDepartureChange}>
                            <option value="">Seleziona una stazione</option>
                            {this.state.stations.map((station) => (
                            <option key={station.idStazione} value={station.nome}>
                                {station.nome}
                            </option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="arrivalStation">
                        <Form.Label>Stazione di Arrivo</Form.Label>
                        <Form.Control as="select" value={this.state.arrival} onChange={this.handleArrivalChange}>
                            <option value="">Seleziona una stazione</option>
                            {this.state.stations.map((station) => (
                            <option key={station.idStazione} value={station.nome}>
                                {station.nome}
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
                    </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default TravelPage;