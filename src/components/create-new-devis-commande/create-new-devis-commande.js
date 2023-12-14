import React, { useState, useEffect } from "react";
import "./create-new-devis-commande.css";
import * as Yup from "yup";
import { AiTwotoneDelete, AiFillEdit } from 'react-icons/ai';
//import { toast } from "react-toastify";
import { Formik, ErrorMessage, Field, FieldArray, useFormik } from "formik";
//import MaskedInput from "react-maskedinput";
import {
  Form,
  Button,
  Spinner,
  Row,
  Col,
  Card,
  InputGroup,
  Accordion,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import accessoires from "../../assets/data/accessoires.json";
import electromenagers from "../../assets/data/electromenagers.json";
import sanitaires from "../../assets/data/sanitaires.json";
import divers from "../../assets/data/divers.json";
import surfaces from "../../assets/data/surfaces.json";
//import { createUser } from "../../../api/admin-user-service";

const taxRates = [0, 6, 10, 20, 21];

  
const calculateVATIncludedPrice = (price, taxRate, quantity) => {
  return price * quantity * (1 + taxRate / 100);
};

const calculateSubtotal = (price, quantity) => {
  return price * quantity;
};

const CreateNewDevisCommande = () => {
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
    floor: "",
    elevator: "",
    status: "",
    articles: [],
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
    floor: Yup.string().required("Veuillez sélectionner l'étage"),
    elevator: Yup.string().required("Y a-t-il un ascenseur ?"),
    status: Yup.string().required("Veuillez sélectionner le type de document"),
    furnitureListPrice: Yup.string().required('Obligatoire'),
    furnitureSalePrice: Yup.string(),
    deliveryFee: Yup.string(),
    montageFee: Yup.string(),
    totalFee: Yup.string(),
    articles: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Obligatoire'),
        price: Yup.number().required('Obligatoire'),
        quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
        taxRate: Yup.string().required('Obligatoire'),
        })
    ),
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
    console.log("Values:", values);
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        // Update articles function using setFieldValue from render props
        const updateAccessory = (index, updatedValues) => {
          const newArticles = [...values.articles];
          newArticles[index] = { ...newArticles[index], ...updatedValues };
          setFieldValue('articles', newArticles);
        };

        return (
    <Form noValidate onSubmit={formik.handleSubmit}>
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
                isInvalid={formik.touched.status && !!formik.errors.status}
              >
                <option value="" disabled>
                  --Devis ou Bon de commande--
                </option>
                <option value="type:Devis">Devis</option>
                <option value="type:Bon de commande">Bon de commande</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
              {formik.touched.status && formik.errors.status}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>A quel étage se trouve la cuisine ?</Form.Label>
              <Form.Select
                {...formik.getFieldProps("floor")}
                isInvalid={formik.touched.floor && !!formik.errors.floor}
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
              {formik.touched.floor && formik.errors.floor}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md={4} lg={4} className="mb-3">
              <Form.Label>Ascenseur ?</Form.Label>
              <Form.Select
                {...formik.getFieldProps("elevator")}
                isInvalid={formik.touched.elevator && !!formik.errors.elevator}
              >
                <option value="" disabled>
                  --Sélectionnez--
                </option>
                <option value="ascenseur:oui">Oui</option>
                <option value="ascenseur:non">Non</option>
                <option value="ascenseur:pasbesoin">Pas Besoin</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
              {formik.touched.elevator && formik.errors.elevator}
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

                <FieldArray name="articles">
  {({ remove, push }) => (
    <>
      {values.articles.map((article, index) => (
        <Row key={index} className="mb-3 align-items-center">
          {/* Accessoire Name Input */}
          <Col md={3}>
            <Form.Group>
              <Form.Label>Article</Form.Label>
              <Field 
                name={`articles[${index}].name`} 
                as={Form.Control}
                placeholder="Entrez l'article"
                onChange={(e) => {
    updateAccessory(index, { name: e.target.value });
}}
              />
              <ErrorMessage name={`articles[${index}].name`} component="div" className="error-message" />
            </Form.Group>
          </Col>

<Col >
<Form.Group>
                    <Form.Label>T. Catalogue € - HTVA</Form.Label>
                    <Form.Control
                      type="text"
                      // as={MaskedInput}
                      // mask="(111) 111-1111"
                      placeholder="Entrez tarif catalogue"
                      {...formik.getFieldProps("furnitureListPrice")}
                      isInvalid={formik.touched.furnitureListPrice && !!formik.errors.furnitureListPrice}
                    />
                    <Form.Control.Feedback type="invalid">
                    {formik.touched.furnitureListPrice && formik.errors.furnitureListPrice}
                    </Form.Control.Feedback>
                  </Form.Group>
</Col>


      {/* Tarif Mobilier € - HTVA Input */}
  <Col>
    <Form.Group>
      <Form.Label style={{ color: "#9f0f0f", fontWeight: "bold" }}>T. Mobilier € - HTVA</Form.Label>
      <Field 
        type="number" 
        style={{
              color: "#9f0f0f",
              borderColor: "#9f0f0f",
                }}
        name={`articles[${index}].price`} 
        as={Form.Control}
        placeholder="Entrez le prix"
        onChange={(e) => {
          const newPrice = parseFloat(e.target.value) || 0;
          const { quantity = 1, taxRate = 0 } = values.articles[index];
          const vatIncludedPrice = calculateVATIncludedPrice(newPrice, taxRate, quantity);

          updateAccessory(index, { price: newPrice, vatIncludedPrice });
        }}
      />
      <ErrorMessage name={`articles[${index}].price`} component="div" className="error-message" />
    </Form.Group>
  </Col>

{/* Tax Rate Selection */}
<Col md={1}>
  <Form.Group>
    <Form.Label>TVA</Form.Label>
    <Field as="select" name={`articles[${index}].taxRate`} className="form-control" 
      onChange={(e) => {
        const newTaxRate = parseInt(e.target.value, 10) || 0;
        const { price = 0, quantity = 1 } = values.articles[index];
        const vatIncludedPrice = calculateVATIncludedPrice(price, newTaxRate, quantity);

        updateAccessory(index, { taxRate: newTaxRate, vatIncludedPrice });
    }}>
      <option value="">Sélectionnez</option>
      {taxRates.map(rate => (
        <option key={rate} value={rate}>{`${rate}%`}</option>
      ))}
    </Field>
    <ErrorMessage name={`articles[${index}].taxRate`} component="div" className="error-message" />
  </Form.Group>
</Col>

{/* Display VAT Included Price */}
<Col md={2}>
    <Form.Group>
      <Form.Label className='parent-text'>TVA incluse</Form.Label>
      <p className="price-text">
        {article.taxRate === '' || article.taxRate === undefined
          ? 'Entrez taxe'
          : `${article.vatIncludedPrice.toFixed(2)}€`}
      </p>
    </Form.Group>
  </Col>

{/* Remove Accessoire Button */}
<Col xs="auto">
  <Button variant="outline-danger" onClick={() => remove(index)}>
    <AiTwotoneDelete />
  </Button>
</Col>
        </Row>
      ))}
      
      <Row className='mb-2'>
      <Col>
      <Button variant="outline-primary" onClick={() => {
          push({ name: '', price: '', quantity: 1, taxRate: '', vatIncludedPrice: 0, subtotal: 0 });
         // console.log('Added new accessoire item', values);
        }}
      >
        <AiFillEdit /> Écrivez-vous
      </Button>
      </Col>
      </Row>
    </>
  )}
                        </FieldArray>
                </Row>
                <Row>
           
                  <Form.Group as={Col} md={5} className="mb-3">
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
      }}
    </Formik>
  );
};


export default CreateNewDevisCommande;
