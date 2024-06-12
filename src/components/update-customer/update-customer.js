import React, { useState, useEffect, useCallback } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Form, Button, Spinner, Row, Col, Card, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const UpdateCustomer = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Silme modalı kontrolü
  const [initialValues, setInitialValues] = useState({
    name: "",
    tva: "",
    phoneNumber: "",
    email: "",
    address: "",
    zipCode: "",
    city: "",
    note: "",
  });

  const fetchClientData = useCallback(async () => {
    try {
      const docRef = doc(db, "customers", clientId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setInitialValues(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching client data: ", error);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientData();
  }, [clientId, fetchClientData]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Veuillez entrer le nom"),
    tva: Yup.string(),
    phoneNumber: Yup.string().required("Veuillez entrer le numéro de téléphone"),
    email: Yup.string()
      .email("L'e-mail doit être un e-mail valide")
      .required("Veuillez entrer l'e-mail"),
    address: Yup.string().required("Veuillez entrer l'adresse"),
    zipCode: Yup.string().required("Veuillez entrer le code postal"),
    city: Yup.string().required("Écrivez la ville"),
    note: Yup.string(),
  });

  const onSubmit = async (values) => {
    setCreating(true);
    try {
      const docRef = doc(db, "customers", clientId);
      await updateDoc(docRef, values);
      toast.success("Mis à jour avec succès");
      formik.resetForm({ values }); // Formu gönderildikten sonra sıfırla
      await fetchClientData(); // En son güncellenmiş verileri yeniden çek
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Une erreur s'est produite lors de la mise à jour");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "customers", clientId);
      await deleteDoc(docRef);
      toast.success("Client supprimé avec succès");
      navigate("/clients"); 
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Une erreur s'est produite lors de la suppression");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Card className="mb-5">
          <Card.Header
            as="h3"
            style={{ color: "white", backgroundColor: "#9f0f0f" }}
          >
            Informations Client
          </Card.Header>
          <Card.Body>
            <Row>
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrez le nom"
                  {...formik.getFieldProps("name")}
                  isInvalid={formik.touched.name && !!formik.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.name && formik.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>TVA (pour les professionnels)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Seulement pour les professionnels"
                  {...formik.getFieldProps("tva")}
                  isInvalid={formik.touched.tva && !!formik.errors.tva}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.tva && formik.errors.tva}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrez le téléphone"
                  {...formik.getFieldProps("phoneNumber")}
                  isInvalid={
                    formik.touched.phoneNumber && !!formik.errors.phoneNumber
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.phoneNumber && formik.errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Entrez l'e-mail"
                  {...formik.getFieldProps("email")}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.email && formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrez l'adresse"
                  {...formik.getFieldProps("address")}
                  isInvalid={formik.touched.address && !!formik.errors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.address && formik.errors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Code postal</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Entrer le code postal"
                  {...formik.getFieldProps("zipCode")}
                  isInvalid={formik.touched.zipCode && !!formik.errors.zipCode}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.zipCode && formik.errors.zipCode}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Ville</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Écrivez la ville"
                  {...formik.getFieldProps("city")}
                  isInvalid={formik.touched.city && !!formik.errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.city && formik.errors.city}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  style={{ height: "40px" }}
                  type="text"
                  placeholder="Si besoin, veuillez écrire"
                  {...formik.getFieldProps("note")}
                />
              </Form.Group>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <Button
                      disabled={creating || !formik.dirty}
                      variant="success"
                      type="submit"
                      style={{ letterSpacing: "1px", marginRight: "10px" }}
                    >
                      {creating && (
                        <Spinner animation="border" variant="light" size="sm" />
                      )}{" "}
                      Mise à jour
                    </Button>
                    {formik.dirty && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => formik.resetForm({ values: initialValues })}
                        style={{ marginRight: "10px" }}
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)} // Silme modalını göster
                  >
                    Supprimer la fiche client
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cette fiche client ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateCustomer;
