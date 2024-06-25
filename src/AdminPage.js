import React, { Component } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
class AdminPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            clients: [],
            accounts: [],
            cards: [],
            complaints: [],
            showModal: false,
            currentClient: { clienteId: "", nome: "", cognome: "", email: "" },
            currentAccount: { accountId: "", accountName: "", accountSurname: "", accountEmail: "", accountPassword: "" },
            currentCard: {cardId: "", saldo: "", idCliente: ""},
            currentComplaint: {complaintId: "", message: "", cardId: ""},
            isEditing: false,
            entityType: 'client',
        }
    }

    componentDidMount() {
        this.fetchClients();
        this.fetchAccounts();
        this.fetchCards();
        this.fetchComplaints();
    }

    fetchComplaints = () => {
        axios.get('http://localhost:3000/api/complaints')
            .then(res => {
                console.log(res)
                this.setState({ complaints: res.data });
            })
            .catch(error => {
                console.error("There was an error fetching the complaints!", error);
            });
    }

    fetchCards = () => {
        axios.get('http://localhost:3000/api/cards')
            .then(res => {
                console.log(res)
                this.setState({ cards: res.data });
            })
            .catch(error => {
                console.error("There was an error fetching the cards!", error);
            });
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
        } else if (entityType === 'card') {
            this.setState({ currentCard: entity })
        } else if (entityType === 'complaints') {
            this.setState({ currentComplaint: entity })
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
        } else if (this.state.entityType === 'card') {
            this.setState(prevState => ({
                currentCard: {
                    ...prevState.currentCard,
                    [name]: value
                }
            }));
        } else if (this.state.entityType === 'complaint') {
            this.setState(prevState => ({
                currentCard: {
                    ...prevState.currentComplaint,
                    [name]: value
                }
            }));
        }
    }

    handleRefund = (idReclamo, cardId, idViaggio) => {
        axios.get(`http://localhost:3000/api/trip/${idViaggio}`)
            .then(res => {
                const viaggio = res.data[0];
                console.log("viaggio:", viaggio);
    
                let card = this.state.cards.find(c => c.cardId === cardId);
    
                if (!card) {
                    console.error("Card not found");
                    return;
                }
                const newBalance =  parseFloat(card.saldo.replace(',', '.')) + parseFloat(viaggio.prezzo);
    
                console.log(newBalance);
    
                axios.put(`http://localhost:3000/api/cards/${cardId}/reload`, { newBalance: newBalance })
                    .then(res => {
                        this.handleDelete(idReclamo, "reclamo");
                        this.fetchCards();
                        this.fetchComplaints();
                        this.handleCloseModal();
                    })
                    .catch(error => {
                        console.error("There was an error updating the card!", error);
                    });
            })
            .catch(error => {
                console.error("There was an error fetching the trip!", error);
            });
    }
    

    handleSubmit = (e) => {
        e.preventDefault();
        const { currentClient, currentAccount, currentCard, isEditing, entityType } = this.state;

        if (entityType === 'client') {
            if (isEditing) {
                axios.put(`http://localhost:3000/api/clienti/${currentClient.idCliente}`, currentClient)
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
                axios.put(`http://localhost:3000/api/accounts/${currentAccount.idAccount}`, currentAccount)
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
        } else if (entityType === 'card') {
            if (isEditing) {
                axios.put(`http://localhost:3000/api/cards/${currentCard.cardId}`, currentCard)
                    .then(res => {
                        this.fetchCards();
                        this.handleCloseModal();
                    })
                    .catch(error => {
                        console.error("There was an error updating the card!", error);
                    });
            } else {
                axios.post('http://localhost:3000/api/cards', currentCard)
                    .then(res => {
                        this.fetchCards();
                        this.handleCloseModal();
                    })
                    .catch(error => {
                        console.error("There was an error creating the card!", error);
                    });
            }
        }
    }

    handleDelete = (entityId, entityType) => {
        if (entityType === 'client') {
            axios.delete(`http://localhost:3000/api/clienti/${entityId}`)
                .then(res => {
                    this.fetchClients();
                })
                .catch(error => {
                    console.error("There was an error deleting the client!", error);
                });
        } else if (entityType === 'account') {
            console.log(entityId)
            axios.delete(`http://localhost:3000/api/accounts/${entityId}`)
                .then(res => {
                    this.fetchAccounts();
                })
                .catch(error => {
                    console.error("There was an error deleting the account!", error);
                });
        } else if (entityType === 'reclamo') {
            console.log(entityId)
            axios.delete(`http://localhost:3000/api/complaint/${entityId}`)
                .then(res => {
                    this.fetchComplaints();
                })
                .catch(error => {
                    console.error("There was an error deleting the complaint!", error);
                });
        }
    }

    changeRoute = (route) => {
        window.location.href = "http://localhost:3001/" + route;
    }

    render(){
        const { clients, accounts, showModal, currentClient, currentAccount, currentCard, isEditing, entityType, cards, complaints } = this.state;

        return(
            <>
                <div className="container mt-5" style={{ paddingTop: "30px" }}>
                    <h1>Admin Page</h1>
                    <h2 style={{ marginTop: "10px" }}>Clienti</h2>
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
                    <h2>Account</h2>
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
                    <h2>Carte</h2>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Saldo</th>
                                <th>Id Cliente</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map(entity => (
                                <tr key={entity.cardId}>
                                    <td>{entity.cardId}</td>
                                    <td>{entity.saldo}</td>
                                    <td>{entity.idCliente}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => this.handleShowModal(entity, "card", true)}>Edit</Button>{' '}
                                        <Button variant="danger" onClick={() => this.handleDelete(entity.idCard, "card")}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <h2>Reclami</h2>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Messaggio</th>
                                <th>CardId</th>
                                <th>idViaggio</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(entity => (
                                <tr key={entity.idReclamo}>
                                    <td>{entity.idReclamo}</td>
                                    <td>{entity.messaggio}</td>
                                    <td>{entity.cardId}</td>
                                    <td>{entity.idViaggio}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => this.handleRefund(entity.idReclamo, entity.cardId, entity.idViaggio)}>Rimborsa</Button>{' '}
                                        <Button variant="danger" onClick={() => this.handleDelete(entity.idReclamo, "reclamo")}>Delete</Button>
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
                                    <Form.Group className="mb-3" controlId="formNome">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Nome" 
                                            name="nome"
                                            value={currentAccount.nome}
                                            onChange={this.handleChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formCognome">
                                        <Form.Label>Cognome</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Cognome" 
                                            name="cognome"
                                            value={currentAccount.cognome}
                                            onChange={this.handleChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            placeholder="Email" 
                                            name="email"
                                            value={currentAccount.email}
                                            onChange={this.handleChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Password" 
                                            name="password"
                                            value={currentAccount.password}
                                            onChange={this.handleChange} />
                                    </Form.Group>
                                </>
                            )}

                            {entityType === 'card' && (
                                <>
                                    <Form.Group className="mb-3" controlId="formNome">
                                        <Form.Label>Saldo</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Saldo" 
                                            name="saldo"
                                            value={currentCard.saldo}
                                            onChange={this.handleChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formCognome">
                                        <Form.Label>Id Cliente</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="idCliente" 
                                            name="idCliente"
                                            value={currentCard.idCliente}
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
