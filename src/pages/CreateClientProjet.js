import React, { useState, useEffect } from "react";
import "./create-client-project.css";
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
  Accordion,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import accessoires from "../assets/data/accessoires.json";
import electromenagers from "../assets/data/electromenagers.json";
import sanitaires from "../assets/data/sanitaires.json";
import divers from "../assets/data/divers.json";
import surfaces from "../assets/data/surfaces.json";

//import { createUser } from "../../../api/admin-user-service";
const CreateClientProjet = () => {
  const [loading, setLoading] = useState(false);
  const [totalAccessoriesPrice, setTotalAccessoriesPrice] = useState(0);
  const [totalElectromenagersPrice, setTotalElectromenagersPrice] = useState(0);
  const [totalSanitairesPrice, setTotalSanitairesPrice] = useState(0);
  const [totalDiversPrice, setTotalDiversPrice] = useState(0);
  const [totalSurfacesPrice, setTotalSurfacesPrice] = useState(0);
  


  const navigate = useNavigate();

  const calculateTotalAccessoriesPrice = (selectedAccessoires) => {
    let totalPrice = 0;
    selectedAccessoires.forEach((product) => {
      totalPrice += parseFloat(product.price);
    });
    return totalPrice.toFixed(0); // Round to 2 decimal places
  };

  const calculateTotalElectromenagersPrice = (selectedElectromenagers) => {
    let totalPrice = 0;
    selectedElectromenagers.forEach((product) => {
      totalPrice += parseFloat(product.price);
    });
    return totalPrice.toFixed(0); // Round to 2 decimal places
  };

  const calculateTotalSanitairesPrice = (selectedSanitaires) => {
    let totalPrice = 0;
    selectedSanitaires.forEach((product) => {
      totalPrice += parseFloat(product.price);
    });
    return totalPrice.toFixed(0); // Round to 2 decimal places
  };

  const calculateTotalDiversPrice = (selectedDivers) => {
    let totalPrice = 0;
    selectedDivers.forEach((product) => {
      totalPrice += parseFloat(product.price);
    });
    return totalPrice.toFixed(0); // Round to 2 decimal places
  };

  const calculateTotalSurfacesPrice = (selectedSurfaces) => {
    let totalPrice = 0;
    selectedSurfaces.forEach((product) => {
      totalPrice += parseFloat(product.price);
    });
    return totalPrice.toFixed(0); // Round to 2 decimal places
  };

 

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
    model: "",
    furnitureListPrice: "",
    furnitureSalePrice: "",
    selectedAccessoires: [],
    selectedElectromenagers: [],
    selectedSanitaires: [],
    selectedDivers: [],
    selectedSurfaces: [],
    deliveryFee: "",
    montageFee: "",
    selectedTaxRate:"",
    totalFee: "Please select tax rate",
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
    model: Yup.string(),
    furnitureListPrice: Yup.string(),
    furnitureSalePrice: Yup.string(),
    deliveryFee: Yup.string(),
    montageFee: Yup.string(),
    totalFee: Yup.string(),
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
    console.log("Selected TVA Rate:", values.selectedTaxRate);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Destructure the values from formik
    const {
      furnitureSalePrice,
      deliveryFee,
      montageFee,
      selectedTaxRate,
    } = formik.values;

    // Check if a tax rate is selected
    if (selectedTaxRate !== "") {
      // Calculate the sum of the fields
      const sum =
        (formik.values.furnitureSalePrice ? parseFloat(formik.values.furnitureSalePrice) : 0) +
        parseFloat(totalAccessoriesPrice) +
        parseFloat(totalElectromenagersPrice) +
        parseFloat(totalSanitairesPrice) +
        parseFloat(totalDiversPrice) +
        parseFloat(totalSurfacesPrice) +
        (formik.values.deliveryFee ? parseFloat(formik.values.deliveryFee) : 0) +
        (formik.values.montageFee ? parseFloat(formik.values.montageFee) : 0);

      // Calculate the totalFee by multiplying the sum with the selectedTaxRate
      const totalFee = sum * (1 + parseFloat(selectedTaxRate) / 100);

      // Update the totalFee field in the formik values
      formik.setFieldValue('totalFee', totalFee.toFixed(0)); // Display totalFee with 0 decimal places
    } else {
      // If no tax rate is selected, show a placeholder
      formik.setFieldValue('totalFee', 'Sélectionnez TVA');
    }
  }, [
    formik.values.furnitureSalePrice,
    formik.values.selectedAccessoires,
    formik.values.selectedElectromenagers,
    formik.values.selectedSanitaires,
    formik.values.selectedDivers,
    formik.values.selectedSurfaces,
    formik.values.deliveryFee,
    formik.values.montageFee,
    formik.values.selectedTaxRate,
    totalAccessoriesPrice,
    totalElectromenagersPrice,
    totalSanitairesPrice,
    totalDiversPrice,
    totalSurfacesPrice,
  ]);


  useEffect(() => {
    const totalPrice = calculateTotalAccessoriesPrice(
      formik.values.selectedAccessoires
    );
    setTotalAccessoriesPrice(totalPrice);
  }, [formik.values.selectedAccessoires]);

  useEffect(() => {
    const totalPrice = calculateTotalElectromenagersPrice(
      formik.values.selectedElectromenagers
    );
    setTotalElectromenagersPrice(totalPrice);
  }, [formik.values.selectedElectromenagers]);

  useEffect(() => {
    const totalPrice = calculateTotalSanitairesPrice(
      formik.values.selectedSanitaires
    );
    setTotalSanitairesPrice(totalPrice);
  }, [formik.values.selectedSanitaires]);

  useEffect(() => {
    const totalPrice = calculateTotalDiversPrice(formik.values.selectedDivers);
    setTotalDiversPrice(totalPrice);
  }, [formik.values.selectedDivers]);

  useEffect(() => {
    const totalPrice = calculateTotalSurfacesPrice(
      formik.values.selectedSurfaces
    );
    setTotalSurfacesPrice(totalPrice);
  }, [formik.values.selectedSurfaces]);

  



  return (
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
                <option value="" disabled>
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
                <option value="" disabled>
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
      <Card className="mb-5">
        <Card.Header
          as="h3"
          style={{ color: "white", backgroundColor: "#9f0f0f" }}
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
                <option value="" disabled>
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
              <Form.Label>Rendez-vous ?</Form.Label>
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

      <Card className="mb-5">
        <Card.Header
          as="h3"
          style={{ color: "white", backgroundColor: "var(--color2)" }}
        >
          Projet
        </Card.Header>
        <Card.Body>
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header
                style={{ backgroundColor: "var(--bs-accordion-active-bg)" }}
              >
                MOBILIER CUISINE
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Form.Group as={Col} md={4} lg={4} className="mb-3">
                    <Form.Label>Modèle</Form.Label>
                    <Form.Select
                      {...formik.getFieldProps("model")}
                      isInvalid={!!formik.errors.model}
                    >
                      <option value="" disabled>
                        --Sélectionnez--
                      </option>
                      <option value="modele:Nolte">Nolte</option>
                      <option value="modele:Express">Express</option>
                      <option value="modele:Eco">Eco</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.model}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={3} lg={3} className="mb-3">
                    <Form.Label>Tarif Catalogue € - HTVA</Form.Label>
                    <Form.Control
                      type="text"
                      // as={MaskedInput}
                      // mask="(111) 111-1111"
                      placeholder="Entrez tarif catalogue"
                      {...formik.getFieldProps("furnitureListPrice")}
                      isInvalid={!!formik.errors.furnitureListPrice}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.furnitureListPrice}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={5} lg={5} className="mb-3">
                    <Form.Label as="h4" style={{ color: "#9f0f0f" }}>
                      Tarif Mobilier € - HTVA
                    </Form.Label>
                    <Form.Control
                      type="text"
                      style={{
                        height: "60px",
                        color: "#9f0f0f",
                        borderColor: "#9f0f0f",
                        fontSize: "20px",
                      }}
                      // as={MaskedInput}
                      // mask="(111) 111-1111"
                      placeholder="Entrez Tarif Mobilier"
                      {...formik.getFieldProps("furnitureSalePrice")}
                      isInvalid={!!formik.errors.furnitureSalePrice}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.furnitureSalePrice}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>ACCESSOIRES</Accordion.Header>
              <Accordion.Body>
                <Select
                  name="selectedProducts"
                  value={formik.values.selectedAccessoires}
                  onChange={(selectedAccessoires) => {
                    formik.setFieldValue(
                      "selectedAccessoires",
                      selectedAccessoires
                    );
                  }}
                  options={accessoires.map((accessoire) => ({
                    value: accessoire.id,
                    label: accessoire.label,
                    description: accessoire.description,
                    price: accessoire.price,
                  }))}
                  isSearchable={true}
                  isMulti
                  placeholder="Recherche..."

                  //Asagidaki 2 satir eger search barda tum degerler ornegin label, description ve fiyat birlikte gosterilmek istenirse kullanilabilir, yoksa sart degil
                  // getOptionLabel={(option) =>`${option.label} - ${option.description} - $${option.price}`}
                  // getOptionValue={(option) => option.value}
                />
                {/* Display selected products */}
                <div className="mt-4">
                  <h6 className="mb-3">Accessoires Sélectionnés:</h6>
                  {formik.values.selectedAccessoires.map((product, index) => (
                    <div key={product.value} className="mb-2">
                      <Row>
                        <Col md={3}>{product.label}</Col>
                        <Col md={5} style={{ fontSize: "12px" }}>
                          {product.description}
                        </Col>
                        <Col md={2} as="h5">
                          €{product.price}
                        </Col>
                        <Col className="d-grid" md={2}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const updatedProducts =
                                formik.values.selectedAccessoires.filter(
                                  (product, i) => i !== index
                                );
                              formik.setFieldValue(
                                "selectedAccessoires",
                                updatedProducts
                              );
                            }}
                          >
                            Annuler
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <div className="mt-2" style={{ color: "#9f0f0f" }}>
                    <h5>Total des Accessoires: €{totalAccessoriesPrice}</h5>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Électroménagers</Accordion.Header>
              <Accordion.Body>
                <Select
                  name="selectedProducts"
                  value={formik.values.selectedElectromenagers}
                  onChange={(selectedElectromenagers) => {
                    formik.setFieldValue(
                      "selectedElectromenagers",
                      selectedElectromenagers
                    );
                  }}
                  options={electromenagers.map((electromenager) => ({
                    value: electromenager.id,
                    label: electromenager.label,
                    description: electromenager.description,
                    price: electromenager.price,
                  }))}
                  isSearchable={true}
                  isMulti
                  placeholder="Recherche..."
                />
                {/* Display selected products */}
                <div className="mt-4">
                  <h6 className="mb-3">Électroménagers Sélectionnés:</h6>
                  {formik.values.selectedElectromenagers.map(
                    (product, index) => (
                      <div key={product.value} className="mb-2">
                        <Row>
                          <Col md={3}>{product.label}</Col>
                          <Col md={5} style={{ fontSize: "12px" }}>
                            {product.description}
                          </Col>
                          <Col md={2} as="h5">
                            €{product.price}
                          </Col>
                          <Col className="d-grid" md={2}>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                const updatedProducts =
                                  formik.values.selectedElectromenagers.filter(
                                    (product, i) => i !== index
                                  );
                                formik.setFieldValue(
                                  "selectedElectromenagers",
                                  updatedProducts
                                );
                              }}
                            >
                              Annuler
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    )
                  )}
                  <div className="mt-2" style={{ color: "#9f0f0f" }}>
                    <h5>
                      Total des Électroménagers: €{totalElectromenagersPrice}
                    </h5>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Sanitaires</Accordion.Header>
              <Accordion.Body>
                <Select
                  name="selectedProducts"
                  value={formik.values.selectedSanitaires}
                  onChange={(selectedSanitaires) => {
                    formik.setFieldValue(
                      "selectedSanitaires",
                      selectedSanitaires
                    );
                  }}
                  options={sanitaires.map((sanitaire) => ({
                    value: sanitaire.id,
                    label: sanitaire.label,
                    description: sanitaire.description,
                    price: sanitaire.price,
                  }))}
                  isSearchable={true}
                  isMulti
                  placeholder="Recherche..."
                />
                {/* Display selected products */}
                <div className="mt-4">
                  <h6 className="mb-3">Sanitaires Sélectionnés:</h6>
                  {formik.values.selectedSanitaires.map((product, index) => (
                    <div key={product.value} className="mb-2">
                      <Row>
                        <Col md={3}>{product.label}</Col>
                        <Col md={5} style={{ fontSize: "12px" }}>
                          {product.description}
                        </Col>
                        <Col md={2} as="h5">
                          €{product.price}
                        </Col>
                        <Col className="d-grid" md={2}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const updatedProducts =
                                formik.values.selectedSanitaires.filter(
                                  (product, i) => i !== index
                                );
                              formik.setFieldValue(
                                "selectedSanitaires",
                                updatedProducts
                              );
                            }}
                          >
                            Annuler
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <div className="mt-2" style={{ color: "#9f0f0f" }}>
                    <h5>Total des Sanitaires: €{totalSanitairesPrice}</h5>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>PDT Solid Surface</Accordion.Header>
              <Accordion.Body>
                <Select
                  name="selectedProducts"
                  value={formik.values.selectedSurfaces}
                  onChange={(selectedSurfaces) => {
                    formik.setFieldValue("selectedSurfaces", selectedSurfaces);
                  }}
                  options={surfaces.map((surface) => ({
                    value: surface.id,
                    label: surface.label,
                    description: surface.description,
                    price: surface.price,
                  }))}
                  isSearchable={true}
                  isMulti
                  placeholder="Recherche..."
                />
                {/* Display selected products */}
                <div className="mt-4">
                  <h6 className="mb-3">PDT Solid Surface Sélectionnés:</h6>
                  {formik.values.selectedSurfaces.map((product, index) => (
                    <div key={product.value} className="mb-2">
                      <Row>
                        <Col md={3}>{product.label}</Col>
                        <Col md={5} style={{ fontSize: "12px" }}>
                          {product.description}
                        </Col>
                        <Col md={2} as="h5">
                          €{product.price}
                        </Col>
                        <Col className="d-grid" md={2}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const updatedProducts =
                                formik.values.selectedSurfaces.filter(
                                  (product, i) => i !== index
                                );
                              formik.setFieldValue(
                                "selectedSurfaces",
                                updatedProducts
                              );
                            }}
                          >
                            Annuler
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <div className="mt-2" style={{ color: "#9f0f0f" }}>
                    <h5>Total des PDT Solid Surfaces: €{totalSurfacesPrice}</h5>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>Divers</Accordion.Header>
              <Accordion.Body>
                <Select
                  name="selectedDivers"
                  value={formik.values.selectedDivers}
                  onChange={(selectedDivers) => {
                    formik.setFieldValue("selectedDivers", selectedDivers);
                  }}
                  options={divers.map((diver) => ({
                    value: diver.id,
                    label: diver.label,
                    description: diver.description,
                    price: diver.price,
                  }))}
                  isSearchable={true}
                  isMulti
                  placeholder="Recherche..."
                />
                {/* Display selected products */}
                <div className="mt-4">
                  <h6 className="mb-3">Divers Sélectionnés:</h6>
                  {formik.values.selectedDivers.map((product, index) => (
                    <div key={product.value} className="mb-2">
                      <Row>
                        <Col md={3}>{product.label}</Col>
                        <Col md={5} style={{ fontSize: "12px" }}>
                          {product.description}
                        </Col>
                        <Col md={2} as="h5">
                          €{product.price}
                        </Col>
                        <Col className="d-grid" md={2}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const updatedProducts =
                                formik.values.selectedDivers.filter(
                                  (product, i) => i !== index
                                );
                              formik.setFieldValue(
                                "selectedDivers",
                                updatedProducts
                              );
                            }}
                          >
                            Annuler
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <div className="mt-2" style={{ color: "#9f0f0f" }}>
                    <h5>Total des Divers: €{totalDiversPrice}</h5>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>

      <Form.Group
        className="livraison mb-3"
        style={{ display: "flex", gap: "15px" }}
      >
        <Form.Label as="h3">Livraison:</Form.Label>

        <Form.Control
          type="text"
          style={{
            color: "#9f0f0f",
            borderColor: "#9f0f0f",
            width: "200px",
          }}
          // as={MaskedInput}
          // mask="(111) 111-1111"
          placeholder="Frais de livraison"
          {...formik.getFieldProps("deliveryFee")}
          isInvalid={!!formik.errors.deliveryFee}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.deliveryFee}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group
        className="pose mb-5"
        style={{ display: "flex", gap: "65px" }}
      >
        <Form.Label as="h3">Pose:</Form.Label>

        <Form.Control
          type="text"
          style={{
            color: "#9f0f0f",
            borderColor: "#9f0f0f",
            width: "200px",
          }}
          // as={MaskedInput}
          // mask="(111) 111-1111"
          placeholder="Frais de pose"
          {...formik.getFieldProps("montageFee")}
          isInvalid={!!formik.errors.montageFee}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.montageFee}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="tva mb-5" style={{ fontSize: "22px" }}>
        <h3 style={{ color: "#9f0f0f" }}>Taux de TVA</h3>
        <Form.Check
          inline
          label="0%"
          value="0"
          name="selectedTaxRate"
          type="radio"
          checked={formik.values.selectedTaxRate==="0"}
          onChange={formik.handleChange}
          style={{
            fontSize: "22px",
            marginRight: "70px",
          }}
        />
        <Form.Check
          inline
          label="6%"
          value="6"
          name="selectedTaxRate"
          type="radio"
          checked={formik.values.selectedTaxRate==="6"}
          onChange={formik.handleChange}
          style={{ fontSize: "22px", marginRight: "70px" }}
        />
        <Form.Check
          inline
          label="10%"
          value="10"
          name="selectedTaxRate"
          type="radio"
          checked={formik.values.selectedTaxRate==="10"}
          onChange={formik.handleChange}
          style={{ fontSize: "22px", marginRight: "70px" }}
        />
        <Form.Check
          inline
          label="20%"
          value="20"
          name="selectedTaxRate"
          type="radio"
          checked={formik.values.selectedTaxRate==="20"}
          onChange={formik.handleChange}
          style={{ fontSize: "22px", marginRight: "70px" }}
        />
        <Form.Check
          inline
          label="21%"
          value="21"
          name="selectedTaxRate"
          type="radio"
          checked={formik.values.selectedTaxRate==="21"}
          onChange={formik.handleChange}
          style={{ fontSize: "22px" }}
        />
      </Form.Group>

      <Form.Group
        className="total mb-5"
        style={{ display: "flex", gap: "15px" }}
      >
        <Form.Label
          as="h2"
          style={{
            color: "#9f0f0f",
          }}
        >
          TOTAL TVAC:
        </Form.Label>

        <Form.Control
          type="text"
          style={{
            color: "#9f0f0f",
            borderColor: "#9f0f0f",
            width: "170px",
          }}
          // as={MaskedInput}
          // mask="(111) 111-1111"
          placeholder="Total TVAC"
          value={formik.values.totalFee}
          readOnly 
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.totalFee}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateClientProjet;
