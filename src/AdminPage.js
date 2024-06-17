import React, { Component } from 'react';
import { Button, Card, Form, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
class AdminPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            clients: [],
            accounts: [],
            showModal: false,
            currentClient: { clienteId: "", nome: "", cognome: "", email: "" },
            currentAccount: { accountId: "", accountName: "", balance: 0 },
            isEditing: false,
            entityType: 'client' // 'client' or 'account'
        }
    }

    componentDidMount() {
        this.fetchClients();
        this.fetchAccounts();
    }

    fetchClients = () => {
        axios.get('http://localhost:3000/api/clienti')
            .then(res => {
                this.setState({ clients: res.data });
            })
            .catch(error => {
                console.error("There was an error fetching the clients!", error);
            });
    }

    fetchAccounts = () => {
        axios.get('http://localhost:3000/api/accounts')
            .then(res => {
                this.setState({ accounts: res.data });
            })
            .catch(error => {
                console.error("There was an error fetching the accounts!", error);
            });
    }

    handleShowModal = (entity, entityType, isEditing = false) => {
        this.setState({ showModal: true, entityType: entityType, isEditing: isEditing });

        if (entityType === 'client') {
            this.setState({ currentClient: entity });
        } else if (entityType === 'account') {
            this.setState({ currentAccount: entity });
        }
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        if (this.state.entityType === 'client') {
            this.setState(prevState => ({
                currentClient: {
                    ...prevState.currentClient,
                    [name]: value
                }
            }));
        } else if (this.state.entityType === 'account') {
            this.setState(prevState => ({
                currentAccount: {
                    ...prevState.currentAccount,
                    [name]: value
                }
            }));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { currentClient, currentAccount, isEditing, entityType } = this.state;

        if (entityType === 'client') {
            if (isEditing) {
                axios.put(`http://localhost:3000/api/clienti/${currentClient.clienteId}`, currentClient)
                    .then(res => {
                        this.fetchClients();
                        this.handleCloseModal();
                    })
                    .catch(error => {
                        console.error("There was an error updating the client!", error);
                    });
            } else {
                axios.post('http://localhost:3000/api/clienti', currentClient)
                    .then(res => {
                        this.fetchClients();
                        this.handleCloseModal();
                    })
                    .catch(error => {
                        console.error("There was an error creating the client!", error);
                    });
            }
        } else if (entityType === 'account') {
            if (isEditing) {
                axios.put(`http://localhost:3000/api/accounts/${currentAccount.accountId}`, currentAccount)
                    .then(res => {
                        this.fetchAccounts();
                        this.handleCloseModal();
                    })
                    .catch(error => {
                        console.error("There was an error updating the account!", error);
                    });
            } else {
                axios.post('http://localhost:3000/api/accounts', currentAccount)
                    .then(res => {
                        this.fetchAccounts();
                        this.handleCloseModal();
                    })
                    .catch(error => {
                        console.error("There was an error creating the account!", error);
                    });
            }
        }
    }

    handleDelete = (entityId, entityType) => {
        if (entityType == 'client') {
            axios.delete(`http://localhost:3000/api/clienti/${entityId}`)
                .then(res => {
                    this.fetchClients();
                })
                .catch(error => {
                    console.error("There was an error deleting the client!", error);
                });
        } else if (entityType == 'account') {
            console.log(entityId)
            axios.delete(`http://localhost:3000/api/accounts/${entityId}`)
                .then(res => {
                    this.fetchAccounts();
                })
                .catch(error => {
                    console.error("There was an error deleting the account!", error);
                });
        }
    }

    changeRoute = (route) => {
        window.location.href = "http://localhost:3001/" + route;
    }

    render(){
        const { clients, accounts, showModal, currentClient, currentAccount, isEditing, entityType } = this.state;

        return(
            <>
                <div className="container mt-5" style={{ paddingTop: "30px" }}>
                    <h1>Admin Page</h1>
                    <div>
                        <Button variant="primary" onClick={() => this.handleShowModal({ entityType: 'client' })}>
                            Add New Client
                        </Button>
                        <Button variant="primary" className="ms-3" onClick={() => this.handleShowModal({ entityType: 'account' })}>
                            Add New Account
                        </Button>
                        <Button variant="warning" className='ms-3' onClick={() => this.changeRoute("administration/statistics")}>
                            Statistics
                        </Button>
                    </div>

                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Cognome</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(entity => (
                                <tr key={entity.idCliente}>
                                    <td>{entity.idCliente}</td>
                                    <td>{entity.nome}</td>
                                    <td>{entity.cognome}</td>
                                    <td>{entity.email}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => this.handleShowModal(entity, "client", true)}>Edit</Button>{' '}
                                        <Button variant="danger" onClick={() => this.handleDelete(entity.idCliente, "client")}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Nome</th>
                                <th>Cognome</th>
                                <th>Tipo</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map(entity => (
                                <tr key={entity.idAccount}>
                                    <td>{entity.idAccount}</td>
                                    <td>{entity.email}</td>
                                    <td>{entity.nome}</td>
                                    <td>{entity.cognome}</td>
                                    <td>{entity.tipo}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => this.handleShowModal(entity, "account", true)}>Edit</Button>{' '}
                                        <Button variant="danger" onClick={() => this.handleDelete(entity.idAccount, "account")}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Modal show={showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? `Edit ${entityType === 'client' ? 'client' : 'account'}` : `Add New ${entityType === 'client' ? 'client' : 'account'}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            {entityType === 'client' && (
                                <>
                                    <Form.Group className="mb-3" controlId="formNome">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter nome" 
                                            name="nome"
                                            value={currentClient.nome}
                                            onChange={this.handleChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formCognome">
                                        <Form.Label>Cognome</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter cognome" 
                                            name="cognome"
                                            value={currentClient.cognome}
                                            onChange={this.handleChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            placeholder="Enter email" 
                                            name="email"
                                            value={currentClient.email}
                                            onChange={this.handleChange} />
                                    </Form.Group>
                                </>
                            )}

                            {entityType === 'account' && (
                                <>
                                    <Form.Group className="mb-3" controlId="formAccountName">
                                        <Form.Label>Account Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter account name" 
                                            name="accountName"
                                            value={currentAccount.accountName}
                                            onChange={this.handleChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBalance">
                                        <Form.Label>Balance</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            placeholder="Enter balance" 
                                            name="balance"
                                            value={currentAccount.balance}
                                            onChange={this.handleChange} />
                                    </Form.Group>
                                </>
                            )}

                            <Button variant="primary" type="submit">
                                {isEditing ? `Update ${entityType === 'client' ? 'Client' : 'Account'}` : `Add ${entityType === 'client' ? 'Client' : 'Account'}`}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default AdminPage;
