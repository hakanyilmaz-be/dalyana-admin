import React, { useState } from 'react';
import { Button, Form, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';

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
                    Kaydet
                  </Button>
                </div>
              ) : (
                <div>
                  <Card.Text>{item.content}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => handleEditClick(item)}>Düzenle</Button>
                    <Button variant="danger" onClick={() => handleDeleteConfirmation(item.id)}>Sil</Button>
                  </div>
                </div>
              )
            )}
            {item.type === 'image' && (
              <>
                <Card.Img variant="top" src={item.content} />
                <div className="d-flex justify-content-end mt-2">
                  <Button variant="danger" onClick={() => handleDeleteConfirmation(item.id)}>Sil</Button>
                </div>
              </>
            )}
            {item.type === 'video' && (
              <>
                <video controls src={item.content} style={{ width: '100%' }} />
                <div className="d-flex justify-content-end mt-2">
                  <Button variant="danger" onClick={() => handleDeleteConfirmation(item.id)}>Sil</Button>
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
      <Form onSubmit={(e) => e.preventDefault()} className="mb-3">
        <Row>
          <Col md={9}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Notunuzu buraya yazın..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button variant="primary" onClick={handleAddText}>
              Not Ekle
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
      <h5>Notlar</h5>
      <Row>{renderItemsByType('text')}</Row>
      <h5>Resimler</h5>
      <Row>{renderItemsByType('image')}</Row>
      <h5>Videolar</h5>
      <Row>{renderItemsByType('video')}</Row>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Silme Onayı</Modal.Title>
        </Modal.Header>
        <Modal.Body>Silmek istediğinizden emin misiniz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>İptal</Button>
          <Button variant="danger" onClick={handleDelete}>Sil</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Sav;
