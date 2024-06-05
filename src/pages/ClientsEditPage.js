import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {Form, Button, Spinner, Row, Col, Card} from "react-bootstrap";
import clientsData from "../assets/data/clients.json"
import DevisCommandeTableForCustomerPage from "../components/devis-commande-table-for-customer-page/devis-commande-table-for-customer-page";

const ClientsEditPage = ({ showProjectList=true }) => {
  const [creating, setCreating] = useState(false);
  
  // İlk müşterinin verilerini başlangıç değerleri olarak kullan
  const firstClient = clientsData[0];

  const initialValues = {
    name: firstClient.name,
    tva: firstClient.tva,
    phoneNumber: firstClient.phoneNumber,
    email: firstClient.email,
    address: firstClient.address,
    zipCode: firstClient.zipCode,
    city: firstClient.city,
    note: firstClient.note,
  };


  const validationSchema = Yup.object({
    name: Yup.string().required("Veuillez entrer le nom"),
    tva: Yup.string(),
    phoneNumber: Yup.string()
      .required("Veuillez entrer le numéro de téléphone"),
    email: Yup.string()
      .email("L'e-mail doit être un e-mail valide")
      .required("Veuillez entrer l'e-mail"),
    address: Yup.string().required("Veuillez entrer l'adresse"),
    zipCode: Yup.string().required("Veuillez entrer le code postal"),
    city: Yup.string().required("Écrivez la ville"),
    note: Yup.string(),
  });

  /* const onSubmit = async (values) => {
    setLoading(true);
    try {
      await createUser(values);
      toast("User was created successfully");
      formik.resetForm();
    } catch (err) {
      console.log(err);
      toast(err.response.data.message);
    } finally {
      setLoading(false);
    }
  }; */

  //ASAGIDAKI BOS FONK GEREK YOK, HATA VERMEMESI ICIN YAZDIM
  const onSubmit = (values) => {
    console.log("Values", values); // Log values to the console
    setCreating(true);
    try {
      // Perform submit actions, e.g., API call
      toast.success("Mis à jour avec succés");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setCreating(false);
      }, 700);
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
                type="number"
                // as={MaskedInput}
                // mask="(111) 111-1111"
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
          <Col md={4}>
          <div className="d-grid gap-2">
          <Button disabled={creating} variant="success" type="submit" style={{ fontSize: '20px', letterSpacing: '1px' }}>
          {creating && (
            <Spinner animation="border" variant="light" size="sm" />
          )}{" "}Mise à jour</Button>
          </div>
          </Col>
          </Row>
        </Card.Body>
      </Card>
    </Form>
    {showProjectList && ( 
        <div>
          <h2 className="mb-4 mt-4" style={{ textAlign: 'center', color: '#112e3b' }}>Listes de Devis & Projets</h2>
          <DevisCommandeTableForCustomerPage />
        </div>
      )}
    </>
  );
};


export default ClientsEditPage