import React, { useEffect, useState } from 'react';
import { Button, Form, Table, Modal, Image } from 'react-bootstrap';
import accessoires from './data/accessoires.json';
import divers from './data/divers.json'
import electromenagers from './data/electromenagers.json'
import sanitaires from './data/sanitaires.json'
import surfaces from './data/surfaces.json'
import meuble from './data/meuble.json'
import './stock-list-table.css';
import { HiPencilSquare } from "react-icons/hi2";
import { AiTwotoneDelete } from 'react-icons/ai';

const StockListTable = () => {
    // Merge all data into a single array
    const allData = [...meuble, ...accessoires, ...divers, ...electromenagers, ...sanitaires, ...surfaces];
    const [searchText, setSearchText] = useState("");
    const [records, setRecords] = useState(allData);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
      name: '',
      description: '',
      quantity: '',
      note: '',
      category: '',
      image: '',
    });
    const [errors, setErrors] = useState({});
    const [updateErrors, setUpdateErrors] = useState({});

    useEffect(() => {
        const arr = allData.filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.quantity.toString().includes(searchText) ||
            item.note?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchText.toLowerCase())
        );
        setRecords(arr);
        console.log("Filtered records:", arr); // Filtrelenmiş kayıtları logla
    }, [searchText]);
    
    const handleDelete = (id) => {
        const updatedRecords = records.filter(item => item.id !== id);
        setRecords(updatedRecords); // Güncellenmiş listeyi state'e kaydet
    };


    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
      
        // Önce hata mesajlarını güncelle
        // Eğer kullanıcı bir değer giriyorsa, ilgili hata mesajını sıfırla
        const updatedErrors = { ...errors, [name]: '' };
        setErrors(updatedErrors);
      
        // Quantity için özel kontrol
        if (name === "quantity") {
          // Sadece sayısal değerler kabul edilir
          if (!isNaN(value) || value === "") {
            setNewProduct({ ...newProduct, [name]: value });
          }
        } else {
          setNewProduct({ ...newProduct, [name]: value });
        }
      };
      
      
    const validateForm = () => {
      const errors = {};
      if (!newProduct.name) errors.name = 'Le nom/referance est requis';
      if (!newProduct.quantity) errors.quantity = 'La quantité est requise';
      if (!newProduct.category) errors.category = 'La catégorie est obligatoire';
      else if (isNaN(newProduct.quantity)) errors.quantity = 'La quantité doit être un nombre';
      return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        console.log("Form Errors:", formErrors);
        if (Object.keys(formErrors).length === 0) {
            const newProductWithId = { ...newProduct, id: records.length + 1 };
            const newRecords = [...records, newProductWithId];
            setRecords(newRecords); // Kayıtları güncelle
            console.log("New Records after addition:", newRecords);
            setShowModal(false);
            setNewProduct({ name: '', description: '', quantity: '', note: '', category: '' });
            if(searchText === ""){
                // Arama metni boşsa, filtreleme yapılmadan tüm kayıtları göster
                setRecords(newRecords);
            }
        } else {
            setErrors(formErrors);
        }
    };
    
    const validateUpdateForm = () => {
        const errors = {};
        if (!editingProduct.name) errors.name = 'Name is required';
        if (!editingProduct.quantity) errors.quantity = 'Quantity is required';
        else if (isNaN(editingProduct.quantity)) errors.quantity = 'Quantity must be a number';
        if (!editingProduct.category) errors.category = 'Category is required';
        return errors;
      };
    
      const handleUpdate = () => {
        const formErrors = validateUpdateForm();
        if (Object.keys(formErrors).length === 0) {
          // Eğer hata yoksa güncelleme işlemini yap
          const updatedRecords = records.map(item => {
            if (item.id === editingProduct.id) {
              return editingProduct;
            }
            return item;
          });
          setRecords(updatedRecords);
          setShowUpdateModal(false); // Modalı kapat
          setEditingProduct(null); // Düzenlenen ürünü sıfırla
          setUpdateErrors({}); // Hataları sıfırla
        } else {
          // Hataları göster
          setUpdateErrors(formErrors);
        }
      };
      
    
    
      

    return (
      <div className="stock-list-table-wrapper">
        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: e.target.files[0].name,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingProduct?.name || ""}
                  onChange={(e) => {
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    });
                    // Hata mesajını kaldır
                    setUpdateErrors((errors) => ({
                      ...errors,
                      name: undefined,
                    }));
                  }}
                  isInvalid={!!updateErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {updateErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={editingProduct?.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={editingProduct?.quantity || ""}
                  onChange={(e) => {
                    setEditingProduct({
                      ...editingProduct,
                      quantity: e.target.value,
                    });
                    // Hata mesajını kaldır
                    setUpdateErrors((errors) => ({
                      ...errors,
                      quantity: undefined,
                    }));
                  }}
                  isInvalid={!!updateErrors.quantity}
                />
                <Form.Control.Feedback type="invalid">
                  {updateErrors.quantity}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  type="text"
                  value={editingProduct?.note || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      note: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={editingProduct?.category || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                >
                  <option disabled value="">
                    Select a category
                  </option>
                  {[
                    "Meuble",
                    "Accessoires",
                    "Divers",
                    "Electromenagers",
                    "Sanitaires",
                    "Surfaces",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUpdateModal(false)}
            >
              Annuler
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
            Sauvegarder
            </Button>
          </Modal.Footer>
        </Modal>

        <Button variant="success" onClick={() => setShowModal(true)}>
        Ajouter Un Produit
        </Button>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter Un Produit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      image: e.target.files[0].name,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nom-Referance</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantité</Form.Label>
                <Form.Control
                  type="text"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  isInvalid={!!errors.quantity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.quantity}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  value={newProduct.note}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Catégorie</Form.Label>
                <Form.Select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  isInvalid={!!errors.category}
                >
                  <option value="">Choisir une catégorie</option>
                  {[
                    "Meuble",
                    "Accessoires",
                    "Divers",
                    "Electromenagers",
                    "Sanitaires",
                    "Surfaces",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="button-group-new-product">
                <Button variant="primary" onClick={handleSubmit}>
                Ajouter
                </Button>
                <Button variant="danger" onClick={() => setShowModal(false)}>
                Annuler
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <div className="data-filter">
          <Form.Control
            size="lg"
            className="my-3"
            type="search"
            placeholder="Filtrer..."
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {records.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom-Reference</th>
                <th>Description</th>
                <th>Quantité</th>
                <th>Catégorie</th>
                <th>Note</th>
                <th>Mise à jour</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, id) => (
                <tr key={id}>
                  <td>
                    <Image
                      src={
                        item.image
                          ? `img/${item.image}`
                          : "img/default-image-stock.jpg"
                      }
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category}</td>
                  <td>{item.note}</td>
                  <td>
                    <Button
                      variant="outline-success"
                      onClick={() => {
                        console.log("Editing category:", item.category); // Kontrol log'u
                        setEditingProduct({ ...item });
                        setShowUpdateModal(true);
                      }}
                    >
                      <HiPencilSquare />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      <AiTwotoneDelete />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="filtered-message">
            Il n'y a aucun enregistrement à afficher
          </p>
        )}
      </div>
    );
};

export default StockListTable;
