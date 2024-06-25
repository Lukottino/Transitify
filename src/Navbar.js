import React, { useState, useEffect } from 'react';
import { Button, Navbar, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import logo from "./resources/transitify.png";
import './Navbar.css';

function CustomNavbar() {
    let navigate = useNavigate(); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const accountType = localStorage.getItem("type");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    /*
    const handleLoginSuccess = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
    };
    */

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('accountId');
        localStorage.removeItem('type')
        routeChange("/")
    };

    const routeChange = (path) => { 
        navigate(path);
    };

    return (
        <>
            <Navbar bg='dark' variant='dark' className="justify-content-between fixed-top custom-navbar">
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
                                    <Button onClick={() => routeChange("/trip")} className="custom-button" style={{ marginLeft: "10px" }}>Viaggia</Button>
                                    <Button onClick={() => routeChange("/profile")} className="custom-button" style={{ marginLeft: "10px" }}>Profilo</Button>
                                    {accountType === "ADMIN" && <Button onClick={() => routeChange("/administration")} className="custom-button" style={{ marginLeft: "10px" }}>Admin</Button>}
                                    <Button onClick={handleLogout} className="custom-button-logout" style={{ marginLeft: "10px" }}>Logout</Button>
                                </>
                            ) : (
                                <Button onClick={() => routeChange("/login")} className="custom-button">Login</Button>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Navbar>
        </>
    );
}

export default CustomNavbar;
