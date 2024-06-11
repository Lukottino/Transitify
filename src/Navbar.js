import * as React from 'react';
import { Button, Card, Form, Navbar, InputGroup, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assicurati di importare il CSS di Bootstrap
import { useNavigate } from 'react-router-dom';
import logo from "./resources/transitify.png"

function CustomNavbar() {
    let navigate = useNavigate(); 
    const routeChange = (path) =>{ 
    navigate(path);
  }
    return (
        <>
            <Navbar bg='dark' variant='dark' className="justify-content-between fixed-top">
                <Navbar.Brand href="/" style={{paddingLeft:"10px"}}>
                    <img
                    src={logo}
                    height="40px"
                    className="align-top"
                    />
                </Navbar.Brand>
                <Form inline style={{paddingRight:"15px"}}>
                    <Row>
                        <Col xs="auto">
                            <Button onClick={() => routeChange("/login")} style={{ borderColor:"transparent", height:"100%px", borderRadius:"10px"}}>Login</Button>
                        </Col>
                    </Row>
                </Form>
            </Navbar>
        </>
    );
}

export default CustomNavbar;
