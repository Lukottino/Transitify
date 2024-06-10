import * as React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assicurati di importare il CSS di Bootstrap

function Login() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: 'blue' }}>
            <Card className="border rounded shadow" style={{ width: '20rem', padding: '30px', borderColor: '#ddd', borderWidth: '1px' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                        Login
                    </Card.Title>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" className="px-4">
                                Login
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Login;
