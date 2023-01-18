import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';


function PhoneBook() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContact, setEditedContact] = useState({});

  useEffect(() => {
    fetch("http://localhost:8085/contactapp/api/v1/contacts/", { method: 'GET' })
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8085/contactapp/api/v1/contacts/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        setContacts(contacts.filter(c => c._id !== id));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalOpen = () => setShowAddModal(true);
  const handleEditModalClose = () => setShowEditModal(false);
  const handleEditModalOpen = (contact) => {
    setEditedContact(contact);
    setShowEditModal(true);
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedContact = {
      _id: editedContact._id,
      fname: e.target.fname.value,
      lname: e.target.lname.value,
      phone: e.target.phone.value
    };
    fetch(`http://localhost:8085/contactapp/api/v1/contacts/${editedContact._id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedContact),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setContacts(contacts.map(contact => contact._id === editedContact._id ? data : contact));
        setShowEditModal(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newContact = {
      _id: uuidv4(),
      fname: e.target.fname.value,
      lname: e.target.lname.value,
      phone: e.target.phone.value
    };

    fetch("http://localhost:8085/contactapp/api/v1/contacts/", {
      method: 'POST',
      body: JSON.stringify(newContact),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setContacts([...contacts, data]);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    setShowAddModal(false);
  }

  const filteredContacts = (contacts.length === 0) ? [] : contacts.filter(contact => {
    return (
      contact.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toString().includes(searchTerm)
    );
  });

  return (
    <Container fluid>
      <Row>
        <Col className='text-center'>
          <h2>
            <i className="fa fa-phone-book"></i>
            Phone Book App
          </h2>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <h4>Contacts</h4>
        </Col>
        <Col xs={8} className="text-right">
          <Button onClick={handleAddModalOpen}>Add Contacts</Button>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search for contact by name or number..."
            onChange={handleSearch}
            value={searchTerm}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {(filteredContacts.length === 0) ? <p>No contacts to display.</p> : filteredContacts.map(contact => (
            <Card key={contact._id}>
              <Card.Body className="text-right" >
                <Card.Title>{contact.fname} {contact.lname}</Card.Title>
                <Card.Text>{contact.phone}</Card.Text>
                <Button variant="warning" className="float-right" onClick={() => {
                  handleEditModalOpen(contact);
                }}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Button>
                <Button variant="danger" className="float-right" onClick={() => handleDelete(contact._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
      {/* Modal for adding */}
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="fname" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lname" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" name="phone" required />
            </Form.Group>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Modal for edit */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="fname" defaultValue={editedContact.fname} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lname" defaultValue={editedContact.lname} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" name="phone" defaultValue={editedContact.phone} required />
            </Form.Group>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default PhoneBook