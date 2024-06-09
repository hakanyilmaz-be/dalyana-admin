// src/components/CreateNewCustomer.js
import React, { useState } from "react";
import "./create-new-customer.css";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Form, Button, Spinner, Row, Col, Card } from "react-bootstrap";
import { db } from '../../../src/firebase'; // Firestore bağlantısı
import { collection, addDoc, getDocs, query, serverTimestamp } from 'firebase/firestore'; // Firestore işlemleri

const CreateNewCustomer = () => {
  const [creating, setCreating] = useState(false);

  const initialValues = {
    name: "",
    tva: "",
    phoneNumber: "",
    email: "",
    address: "",
    zipCode: "",
    city: "",
    note: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Veuillez entrer le nom"),
    tva: Yup.string(),
    phoneNumber: Yup.string().required("Veuillez entrer le numéro de téléphone"),
    email: Yup.string().email("L'e-mail doit être un e-mail valide").required("Veuillez entrer l'e-mail"),
    address: Yup.string().required("Veuillez entrer l'adresse"),
    zipCode: Yup.string().required("Veuillez entrer le code postal"),
    city: Yup.string().required("Écrivez la ville"),
    note: Yup.string(),
  });

  const capitalizeName = (name) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const onSubmit = async (values) => {
    setCreating(true);
    try {
      // Mevcut müşteri sayısını öğrenmek için customers koleksiyonunu sorgula
      const q = query(collection(db, "customers"));
      const querySnapshot = await getDocs(q);
      const customerCount = querySnapshot.size;

      // Yeni müşteri için ID oluştur
      const cityCode = values.city.substring(0, 3).toUpperCase();
      const customerID = `${cityCode} - ${String(customerCount + 1).padStart(3, '0')}`;

      // Yeni müşteri belgesini oluştur
      const newCustomer = { 
        ...values, 
        name: capitalizeName(values.name), 
        customerID,
        createdAt: serverTimestamp() // Belgeye oluşturulma zamanı ekle
      };

      const docRef = await addDoc(collection(db, "customers"), newCustomer);
      console.log("Document written with ID: ", docRef.id);
      toast.success("Fiche client créée avec succès");
      formik.resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Une erreur s'est produite lors de la création de la fiche client");
    } finally {
      setCreating(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Card className="mb-5">
        <Card.Header
          as="h3"
          style={{ color: "white", backgroundColor: "#9f0f0f" }}
        >
          Créer un Nouveau Client
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
                type="text" // Telefon numarası için type="text"
                placeholder="Entrez le téléphone"
                {...formik.getFieldProps("phoneNumber")}
                isInvalid={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
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
                value={formik.values.email}
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
                type="text" // Posta kodu için type="text"
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
            <Col md={4}>
              <div className="d-grid gap-2">
                <Button disabled={creating} variant="dark" type="submit" style={{ fontSize: '20px', letterSpacing: '1px' }}>
                  {creating && (
                    <Spinner animation="border" variant="light" size="sm" />
                  )}{" "}Créer
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Form>
  );
};

export default CreateNewCustomer;
