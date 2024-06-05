import React, { useState } from 'react';
import { Button, Form, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import "./projet-edit.css"

function Sav() {
  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const handleAddText = () => {
    if (!inputText.trim()) return;
    const newItem = { id: uuidv4(), type: 'text', content: inputText };
    setItems([newItem, ...items]);
    setInputText('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map(file => {
      const fileType = file.type.startsWith('image') ? 'image' : 'video';
      return { id: uuidv4(), type: fileType, content: URL.createObjectURL(file) };
    });
    setItems([...items, ...newItems]);
  };

  const handleDeleteConfirmation = (id) => {
    setShowDeleteModal(true);
    setDeleteItemId(id);
  };

  const handleDelete = () => {
    setItems(items.filter(item => item.id !== deleteItemId));
    setShowDeleteModal(false);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditingText(item.content);
  };

  const handleSaveEdit = (id) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, content: editingText };
      }
      return item;
    }));
    setEditingId(null);
    setEditingText('');
  };

  const renderItemsByType = (type) => {
    return items.filter(item => item.type === type).map(item => (
      <Col key={item.id} md={4} className="mb-4">
        <Card>
          <Card.Body>
            {item.type === 'text' && (
              editingId === item.id ? (
                <div>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <Button variant="success" onClick={() => handleSaveEdit(item.id)} className="mt-2">
                  Sauvegarder
                  </Button>
                </div>
              ) : (
                <div>
                  <Card.Text>{item.content}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => handleEditClick(item)}>Modifier</Button>
                    <Button variant="danger" onClick={() => handleDeleteConfirmation(item.id)}>Supprimer</Button>
                  </div>
                </div>
              )
            )}
            {item.type === 'image' && (
              <>
                <Card.Img variant="top" src={item.content} />
                <div className="d-flex justify-content-end mt-2">
                  <Button variant="danger" onClick={() => handleDeleteConfirmation(item.id)}>Supprimer</Button>
                </div>
              </>
            )}
            {item.type === 'video' && (
              <>
                <video controls src={item.content} style={{ width: '100%' }} />
                <div className="d-flex justify-content-end mt-2">
                  <Button variant="danger" onClick={() => handleDeleteConfirmation(item.id)}>Supprimer</Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <Container>
        <h3 className='mt-5' style={{ textAlign: 'center' }}>Le service après-vente (SAV)</h3>
        <div className="title-border mt-3 mb-5"></div>
      <Form onSubmit={(e) => e.preventDefault()} className="mb-3">
        <Row>
          <Col md={9}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Écrivez votre note ici..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button variant="outline-primary" onClick={handleAddText}>
            Ajouter une note
            </Button>
          </Col>
          <Col md={9}>
            <Form.Group controlId="formFileMultiple" className="my-3">
              <Form.Control type="file" 
              multiple 
              accept="image/*,video/*" // Resim ve video dosyalarını kabul et
              onChange={handleFileChange} />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <h5>Notes</h5>
      <Row>{renderItemsByType('text')}</Row>
      <h5>Photos</h5>
      <Row>{renderItemsByType('image')}</Row>
      <h5>Vidéos</h5>
      <Row>{renderItemsByType('video')}</Row>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de Suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>Etes-vous sûr que vous voulez supprimer?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Sav;
