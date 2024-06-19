import * as React from 'react';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assicurati di importare il CSS di Bootstrap
import axios from "axios";

class Register extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email:"",
            password:"",
            nome:"",
            cognome:""
        }
    }

    submitHandler = e => {
        e.preventDefault();
        this.ExecQuery();
    }
    

    ExecQuery() {
        var payload = {
            email: this.state.email,
            password: this.state.password,
            nome: this.state.nome,
            cognome: this.state.cognome,
            tipo: "UTENTE"
        }
        axios.post('http://localhost:3000/api/register', payload)
        .then(res=> {
            console.log(res);
            console.log(res.data);
            if(res.data.status===200)
            {
                this.props.handleLoginSuccess(res.data.token); 
                window.location.href = "http://localhost:3001/";
            }
        }) 
    }

    render(){
        return(
            <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: 'white' }}>
                <Card className="border rounded shadow" style={{ width: '20rem', padding: '30px', borderColor: '#ddd', borderWidth: '1px' }}>
                    <Card.Body>
                        <Card.Title className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                            Registrati
                        </Card.Title>
                        <Form onSubmit={this.submitHandler}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email" 
                                    name="email"
                                    value={this.state.email}
                                    onChange={e => this.setState({...this.state, email: e.target.value})} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    name="password"
                                    value={this.state.password}
                                    onChange={e => this.setState({...this.state, password: e.target.value})}/>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicNome">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nome"
                                            name="nome"
                                            value={this.state.nome}
                                            onChange={e => this.setState({...this.state, nome: e.target.value })} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicCognome">
                                        <Form.Label>Cognome</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Cognome"
                                            name="cognome"
                                            value={this.state.cognome}
                                            onChange={e => this.setState({...this.state, cognome: e.target.value })} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit" className="px-4">
                                    Registrati
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Register;