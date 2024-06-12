import React, { useState, useEffect } from 'react';
import { Button, Navbar, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import logo from "./resources/transitify.png";

function CustomNavbar() {
    let navigate = useNavigate(); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSuccess = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    const routeChange = (path) => { 
        navigate(path);
    };

    return (
        <>
            <Navbar bg='dark' variant='dark' className="justify-content-between fixed-top">
                <Navbar.Brand href="/" style={{ paddingLeft: "10px" }}>
                    <img
                        src={logo}
                        height="40px"
                        className="align-top"
                        alt="Transitify Logo"
                    />
                </Navbar.Brand>
                <Form inline style={{ paddingRight: "15px" }}>
                    <Row>
                        <Col xs="auto">
                            {isAuthenticated ? (
                                <>
                                    <Button onClick={handleLogout} style={{ borderColor: "transparent", height: "100%px", borderRadius: "10px" }}>Logout</Button>
                                    <Button onClick={() => routeChange("/profile")} style={{ borderColor: "transparent", height: "100%px", borderRadius: "10px", marginLeft: "10px" }}>Profile</Button>
                                </>
                            ) : (
                                <Button onClick={() => routeChange("/login")} style={{ borderColor: "transparent", height: "100%px", borderRadius: "10px" }}>Login</Button>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Navbar>
        </>
    );
}

export default CustomNavbar;
