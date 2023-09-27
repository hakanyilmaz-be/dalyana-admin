import React, { useState } from "react";
import * as Yup from "yup";
import moment from "moment";
//import { toast } from "react-toastify";
import { useFormik } from "formik";
//import MaskedInput from "react-maskedinput";
import {
  Form,
  Button,
  Spinner,
  Row,
  Col,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
//import { createUser } from "../../../api/admin-user-service";
const CreateClientProjet = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    zipCode: "",
    city: "",
    floor: "",
    elevator: "",
    status: "",
    appointmentDate: "",
    appointmentTime: "",
    note: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Veuillez entrer le nom"),
    phoneNumber: Yup.string()
      .required("Veuillez entrer le numéro de téléphone")
      .test(
        "includes_",
        "Svp entrer un numéro de téléphone valide",
        (value) => value && !value.includes("_")
      ),
    email: Yup.string()
      .email("L'e-mail doit être un e-mail valide")
      .required("Veuillez entrer l'e-mail"),
    address: Yup.string().required("Veuillez entrer l'adresse"),
    zipCode: Yup.string().required("Veuillez entrer le code postal"),
    city: Yup.string().required("Écrivez la ville"),
    floor: Yup.string().required("Veuillez sélectionner l'étage"),
    elevator: Yup.string().required("Y a-t-il un ascenseur ?"),
    status: Yup.string().required("Veuillez sélectionner le type de document"),
    appointmentDate: Yup.string(),
    appointmentTime: Yup.string(),
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
  const onSubmit = () => {};

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
          style={{ color: "white", backgroundColor: "var(--color2)" }}
        >
          Informations Client
        </Card.Header>
        <Card.Body>
          <Row>
            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom"
                {...formik.getFieldProps("name")}
                isInvalid={!!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                // as={MaskedInput}
                // mask="(111) 111-1111"
                placeholder="Entrez le téléphone"
                {...formik.getFieldProps("phoneNumber")}
                isInvalid={!!formik.errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez l'e-mail"
                value={formik.values.email}
                isInvalid={!!formik.errors.email}
                {...formik.getFieldProps("email")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={8} className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                {...formik.getFieldProps("address")}
                isInvalid={!!formik.errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>Code postal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrer le code postal"
                {...formik.getFieldProps("zipCode")}
                isInvalid={!!formik.errors.zipCode}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.zipCode}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>Ville</Form.Label>
              <Form.Control
                type="text"
                placeholder="Écrivez la ville"
                {...formik.getFieldProps("city")}
                isInvalid={!!formik.errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.city}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>A quel étage se trouve la cuisine ?</Form.Label>
              <Form.Select
                {...formik.getFieldProps("floor")}
                isInvalid={!!formik.errors.floor}
              >
                <option value="" disabled selected>
                  --Sélectionnez l'étage--
                </option>
                <option value="étage:Rez-de-chaussée">Rez-de-chaussée</option>
                <option value="étage:1">1</option>
                <option value="étage:2">2</option>
                <option value="étage:3">3</option>
                <option value="étage:4">4</option>
                <option value="étage:5 ou plus">5 ou plus</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.floor}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>Ascenseur ?</Form.Label>
              <Form.Select
                {...formik.getFieldProps("elevator")}
                isInvalid={!!formik.errors.elevator}
              >
                <option value="" disabled selected>
                  --Sélectionnez--
                </option>
                <option value="ascenseur:oui">Oui</option>
                <option value="ascenseur:non">Non</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.elevator}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header
          as="h3"
          style={{ color: "white", backgroundColor: "var(--color2)" }}
        >
          Statut
        </Card.Header>
        <Card.Body>
          <Row>
            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>Sélectionnez le type de document</Form.Label>
              <Form.Select
                {...formik.getFieldProps("status")}
                isInvalid={!!formik.errors.status}
              >
                <option value="" disabled selected>
                  --Devis ou Bon de commande--
                </option>
                <option value="type:Devis">Devis</option>
                <option value="type:Bon de commande">Bon de commande</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.status}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={2} lg={2} className="mb-3">
              <Form.Label>Rendez-vous ? (*si fait)</Form.Label>
              <Form.Control
                type="date"
                placeholder="Rendez-vous?"
                min={moment(formik.values.appointmentDate).format("YYYY-MM-DD")}
                {...formik.getFieldProps("appointmentDate")}
                isInvalid={
                  formik.touched.appointmentDate &&
                  formik.errors.appointmentDate
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.appointmentDate}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={2} lg={2} className="mb-3">
              <Form.Label>Heure</Form.Label>

              <Form.Control
                type="time"
                placeholder="Selectionnez"
                {...formik.getFieldProps("appointmentTime")}
                isInvalid={
                  formik.touched.appointmentTime &&
                  formik.errors.appointmentTime
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.appointmentTime}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: "40px" }}
                type="text"
                placeholder="Si c'est le cas, veuillez écrire"
                {...formik.getFieldProps("note")}
                isInvalid={!!formik.errors.note}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.note}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Card.Body>
      </Card>
    </Form>
  );
};

export default CreateClientProjet;
