import React, { useState } from "react";
import "./create-new-devis-commande.css";
import * as Yup from "yup";
import { AiOutlinePlus, AiTwotoneDelete, AiFillEdit } from 'react-icons/ai';
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
  Dropdown, FormControl,
  Accordion,
} from "react-bootstrap";
import accessoires from "../../assets/data/accessoires.json";
import electromenagers from "../../assets/data/electromenagers.json";
import sanitaires from "../../assets/data/sanitaires.json";
import divers from "../../assets/data/divers.json";
import surfaces from "../../assets/data/surfaces.json";
//import { createUser } from "../../../api/admin-user-service";

const taxRates = [0, 6, 10, 20, 21];
const SearchableSelectAccessoires = ({ name, data, setFieldValue, value, placeholder, isProduct, index, setPrice, values, calculateVATIncludedPrice, calculateSubtotal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItem = data.find(item => item.id === value);

  return (
    <div>
      <FormControl
          placeholder={placeholder}
          value={searchTerm || (selectedItem ? selectedItem.name : '')}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />
      {showDropdown && (
          <Dropdown.Menu show>
              {data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                  <Dropdown.Item key={item.id} onClick={() => {
                      setFieldValue(name, item.id);
                      setSearchTerm('');
                      
                      if (isProduct) {
                          const currentQuantity = values.itemsAccessoires[index].quantity || 1;
                          const selectedProduct = accessoires.find(p => p.id === item.id);
                          const price = selectedProduct ? selectedProduct.price : 0;
                          setPrice(index, price, currentQuantity);
                          setFieldValue(`itemsAccessoires[${index}].vatIncludedPrice`, calculateVATIncludedPrice(price, values.itemsAccessoires[index].taxRate, currentQuantity));
                          setFieldValue(`itemsAccessoires[${index}].subtotal`, calculateSubtotal(price, currentQuantity));
                      }
                  }}>
                      {item.name}
                  </Dropdown.Item>
              ))}
          </Dropdown.Menu>
      )}
    </div>
    );
};

const SearchableSelectElectromenagers = ({ name, data, setFieldValue, value, placeholder, isProduct, index, setPrice, values, calculateVATIncludedPrice, calculateSubtotal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItem = data.find(item => item.id === value);

  return (
    <div>
      <FormControl
          placeholder={placeholder}
          value={searchTerm || (selectedItem ? selectedItem.name : '')}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />
      {showDropdown && (
          <Dropdown.Menu show>
              {data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                  <Dropdown.Item key={item.id} onClick={() => {
                      setFieldValue(name, item.id);
                      setSearchTerm('');
                      
                      if (isProduct) {
                          const currentQuantity = values.itemsElectromenagers[index].quantity || 1;
                          const selectedProduct = electromenagers.find(p => p.id === item.id);
                          const price = selectedProduct ? selectedProduct.price : 0;
                          setPrice(index, price, currentQuantity);
                          setFieldValue(`itemsElectromenagers[${index}].vatIncludedPrice`, calculateVATIncludedPrice(price, values.itemsElectromenagers[index].taxRate, currentQuantity));
                          setFieldValue(`itemsElectromenagers[${index}].subtotal`, calculateSubtotal(price, currentQuantity));
                      }
                  }}>
                      {item.name}
                  </Dropdown.Item>
              ))}
          </Dropdown.Menu>
      )}
    </div>
    );
};

const SearchableSelectSanitaires = ({ name, data, setFieldValue, value, placeholder, isProduct, index, setPrice, values, calculateVATIncludedPrice, calculateSubtotal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItem = data.find(item => item.id === value);

  return (
    <div>
      <FormControl
          placeholder={placeholder}
          value={searchTerm || (selectedItem ? selectedItem.name : '')}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />
      {showDropdown && (
          <Dropdown.Menu show>
              {data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                  <Dropdown.Item key={item.id} onClick={() => {
                      setFieldValue(name, item.id);
                      setSearchTerm('');
                      
                      if (isProduct) {
                          const currentQuantity = values.itemsSanitaires[index].quantity || 1;
                          const selectedProduct = sanitaires.find(p => p.id === item.id);
                          const price = selectedProduct ? selectedProduct.price : 0;
                          setPrice(index, price, currentQuantity);
                          setFieldValue(`itemsSanitaires[${index}].vatIncludedPrice`, calculateVATIncludedPrice(price, values.itemsSanitaires[index].taxRate, currentQuantity));
                          setFieldValue(`itemsSanitaires[${index}].subtotal`, calculateSubtotal(price, currentQuantity));
                      }
                  }}>
                      {item.name}
                  </Dropdown.Item>
              ))}
          </Dropdown.Menu>
      )}
    </div>
    );
};

const SearchableSelectDivers = ({ name, data, setFieldValue, value, placeholder, isProduct, index, setPrice, values, calculateVATIncludedPrice, calculateSubtotal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItem = data.find(item => item.id === value);

  return (
    <div>
      <FormControl
          placeholder={placeholder}
          value={searchTerm || (selectedItem ? selectedItem.name : '')}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />
      {showDropdown && (
          <Dropdown.Menu show>
              {data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                  <Dropdown.Item key={item.id} onClick={() => {
                      setFieldValue(name, item.id);
                      setSearchTerm('');
                      
                      if (isProduct) {
                          const currentQuantity = values.itemsDivers[index].quantity || 1;
                          const selectedProduct = divers.find(p => p.id === item.id);
                          const price = selectedProduct ? selectedProduct.price : 0;
                          setPrice(index, price, currentQuantity);
                          setFieldValue(`itemsDivers[${index}].vatIncludedPrice`, calculateVATIncludedPrice(price, values.itemsDivers[index].taxRate, currentQuantity));
                          setFieldValue(`itemsDivers[${index}].subtotal`, calculateSubtotal(price, currentQuantity));
                      }
                  }}>
                      {item.name}
                  </Dropdown.Item>
              ))}
          </Dropdown.Menu>
      )}
    </div>
    );
};

const SearchableSelectSurfaces = ({ name, data, setFieldValue, value, placeholder, isProduct, index, setPrice, values, calculateVATIncludedPrice, calculateSubtotal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItem = data.find(item => item.id === value);

  return (
    <div>
      <FormControl
          placeholder={placeholder}
          value={searchTerm || (selectedItem ? selectedItem.name : '')}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />
      {showDropdown && (
          <Dropdown.Menu show>
              {data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                  <Dropdown.Item key={item.id} onClick={() => {
                      setFieldValue(name, item.id);
                      setSearchTerm('');
                      
                      if (isProduct) {
                          const currentQuantity = values.itemsSurfaces[index].quantity || 1;
                          const selectedProduct = surfaces.find(p => p.id === item.id);
                          const price = selectedProduct ? selectedProduct.price : 0;
                          setPrice(index, price, currentQuantity);
                          setFieldValue(`itemsSurfaces[${index}].vatIncludedPrice`, calculateVATIncludedPrice(price, values.itemsSurfaces[index].taxRate, currentQuantity));
                          setFieldValue(`itemsSurfaces[${index}].subtotal`, calculateSubtotal(price, currentQuantity));
                      }
                  }}>
                      {item.name}
                  </Dropdown.Item>
              ))}
          </Dropdown.Menu>
      )}
    </div>
    );
};
  
const calculateVATIncludedPrice = (price, taxRate, quantity) => {
  return price * quantity * (1 + taxRate / 100);
};

const calculateSubtotal = (price, quantity) => {
  return price * quantity;
};

const CreateNewDevisCommande = () => {
 

  const initialValues = {
    floor: "",
    elevator: "",
    status: "",
    articles: [],
    furnitureListPrice: "",
    itemsAccessoires: [],
    itemsElectromenagers: [],
    itemsSanitaires: [],
    itemsDivers: [],
    itemsSurfaces: [],
    deliveryFee: "",
    montageFee: "",
    totalFee: "",
  };

  const validationSchema = Yup.object({
    floor: Yup.string().required("Veuillez sélectionner l'étage"),
    elevator: Yup.string().required("Y a-t-il un ascenseur ?"),
    status: Yup.string().required("Veuillez sélectionner le type de document"),
    furnitureListPrice: Yup.string().required('Obligatoire'),
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
    itemsAccessoires: Yup.array().of(
      Yup.object().shape({
          productId: Yup.string().required('Le produit est requis'),
          quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
          taxRate: Yup.string().required('Obligatoire'),
      })
  ),
  itemsElectromenagers: Yup.array().of(
    Yup.object().shape({
        productId: Yup.string().required('Le produit est requis'),
        quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
        taxRate: Yup.string().required('Obligatoire'),
    })
),
itemsSanitaires: Yup.array().of(
  Yup.object().shape({
      productId: Yup.string().required('Le produit est requis'),
      quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
      taxRate: Yup.string().required('Obligatoire'),
  })
),
itemsDivers: Yup.array().of(
  Yup.object().shape({
      productId: Yup.string().required('Le produit est requis'),
      quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
      taxRate: Yup.string().required('Obligatoire'),
  })
),
itemsSurfaces: Yup.array().of(
  Yup.object().shape({
      productId: Yup.string().required('Le produit est requis'),
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



  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        // Update articles function using setFieldValue from render props
        const updateArticleItem = (index, updatedValues) => {
          const newArticles = [...values.articles];
          newArticles[index] = { ...newArticles[index], ...updatedValues };
          setFieldValue('articles', newArticles);
        };

        const calculateTotalFeeAccessoires = () => {
          return values.itemsAccessoires
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

          // Check if any item has a tax rate selected
          const isTaxRateSelectedAccessoires = values.itemsAccessoires.some(item => item.taxRate);

        // Calculate the total fee only if tax rate is selected
        const totalFeeAccessoires = isTaxRateSelectedAccessoires ? calculateTotalFeeAccessoires() : null;

        const calculateTotalFeeElectromenagers = () => {
          return values.itemsElectromenagers
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

          // Check if any item has a tax rate selected
          const isTaxRateSelectedElectromenagers = values.itemsElectromenagers.some(item => item.taxRate);

        // Calculate the total fee only if tax rate is selected
        const totalFeeElectromenagers = isTaxRateSelectedElectromenagers ? calculateTotalFeeElectromenagers() : null;




        const calculateTotalFeeSanitaires = () => {
          return values.itemsSanitaires
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

          // Check if any item has a tax rate selected
          const isTaxRateSelectedSanitaires = values.itemsSanitaires.some(item => item.taxRate);

        // Calculate the total fee only if tax rate is selected
        const totalFeeSanitaires = isTaxRateSelectedSanitaires ? calculateTotalFeeSanitaires() : null;

        const calculateTotalFeeDivers = () => {
          return values.itemsDivers
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

          // Check if any item has a tax rate selected
          const isTaxRateSelectedDivers = values.itemsDivers.some(item => item.taxRate);

        // Calculate the total fee only if tax rate is selected
        const totalFeeDivers = isTaxRateSelectedDivers ? calculateTotalFeeDivers() : null;

        const calculateTotalFeeSurfaces = () => {
          return values.itemsSurfaces
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

          // Check if any item has a tax rate selected
          const isTaxRateSelectedSurfaces = values.itemsSurfaces.some(item => item.taxRate);

        // Calculate the total fee only if tax rate is selected
        const totalFeeSurfaces = isTaxRateSelectedSurfaces ? calculateTotalFeeSurfaces() : null;


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
                      isInvalid={
                        formik.touched.status && !!formik.errors.status
                      }
                    >
                      <option value="" disabled>
                        --Devis ou Bon de commande--
                      </option>
                      <option value="type:Devis">Devis</option>
                      <option value="type:Bon de commande">
                        Bon de commande
                      </option>
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
                      <option value="étage:Rez-de-chaussée">
                        Rez-de-chaussée
                      </option>
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
                      isInvalid={
                        formik.touched.elevator && !!formik.errors.elevator
                      }
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
                      style={{
                        backgroundColor: "var(--bs-accordion-active-bg)",
                      }}
                    >
                      MOBILIER CUISINE
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <FieldArray name="articles">
                          {({ remove, push }) => (
                            <>
                              {values.articles.map((article, index) => (
                                <Row
                                  key={index}
                                  className="mb-3 align-items-center"
                                >
                                  {/* Accessoire Name Input */}
                                  <Col md={12}>
                                    <Form.Group>
                                      <Form.Label>Article</Form.Label>
                                      <Field
                                        name={`articles[${index}].name`}
                                        as={Form.Control}
                                        placeholder="Entrez l'article"
                                        onChange={(e) => {
                                          updateArticleItem(index, {
                                            name: e.target.value,
                                          });
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`articles[${index}].name`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </Form.Group>
                                  </Col>

                                  <Col>
                                    <Form.Group>
                                      <Form.Label>
                                        Tarif Catalogue € - HTVA
                                      </Form.Label>
                                      <Form.Control
                                        type="number"
                                        // as={MaskedInput}
                                        // mask="(111) 111-1111"
                                        placeholder="Entrez tarif catalogue"
                                        {...formik.getFieldProps(
                                          "furnitureListPrice"
                                        )}
                                        isInvalid={
                                          formik.touched.furnitureListPrice &&
                                          !!formik.errors.furnitureListPrice
                                        }
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {formik.touched.furnitureListPrice &&
                                          formik.errors.furnitureListPrice}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>

                                  {/* Tarif Mobilier € - HTVA Input */}
                                  <Col>
                                    <Form.Group>
                                      <Form.Label
                                        style={{
                                          color: "#9f0f0f",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Tarif Mobilier € - HTVA
                                      </Form.Label>
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
                                          const newPrice =
                                            parseFloat(e.target.value) || 0;
                                          const { quantity = 1, taxRate = 0 } =
                                            values.articles[index];
                                          const vatIncludedPrice =
                                            calculateVATIncludedPrice(
                                              newPrice,
                                              taxRate,
                                              quantity
                                            );

                                          updateArticleItem(index, {
                                            price: newPrice,
                                            vatIncludedPrice,
                                          });
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`articles[${index}].price`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </Form.Group>
                                  </Col>

                                  {/* Tax Rate Selection */}
                                  <Col>
                                    <Form.Group>
                                      <Form.Label>TVA</Form.Label>
                                      <Field
                                        as="select"
                                        name={`articles[${index}].taxRate`}
                                        className="form-control"
                                        onChange={(e) => {
                                          const newTaxRate =
                                            parseInt(e.target.value, 10) || 0;
                                          const { price = 0, quantity = 1 } =
                                            values.articles[index];
                                          const vatIncludedPrice =
                                            calculateVATIncludedPrice(
                                              price,
                                              newTaxRate,
                                              quantity
                                            );

                                          updateArticleItem(index, {
                                            taxRate: newTaxRate,
                                            vatIncludedPrice,
                                          });
                                        }}
                                      >
                                        <option value="">Sélectionnez</option>
                                        {taxRates.map((rate) => (
                                          <option
                                            key={rate}
                                            value={rate}
                                          >{`${rate}%`}</option>
                                        ))}
                                      </Field>
                                      <ErrorMessage
                                        name={`articles[${index}].taxRate`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </Form.Group>
                                  </Col>

                                  {/* Display VAT Included Price */}
                                  <Col>
                                    <Form.Group>
                                      <Form.Label className="parent-text">
                                        TVA incluse
                                      </Form.Label>
                                      <p className="price-text">
                                        {article.taxRate === "" ||
                                        article.taxRate === undefined
                                          ? "Entrez taxe"
                                          : `${article.vatIncludedPrice.toFixed(
                                              2
                                            )}€`}
                                      </p>
                                    </Form.Group>
                                  </Col>

                                  {/* Remove Accessoire Button */}
                                  <Col xs="auto">
                                    <Button
                                      variant="outline-danger"
                                      onClick={() => remove(index)}
                                    >
                                      <AiTwotoneDelete />
                                    </Button>
                                  </Col>
                                </Row>
                              ))}

                              <Row className="mb-2">
                                <Col>
                                  <Button
                                    variant="outline-primary"
                                    onClick={() => {
                                      push({
                                        name: "",
                                        price: "",
                                        quantity: 1,
                                        taxRate: "",
                                        vatIncludedPrice: 0,
                                        subtotal: 0,
                                      });
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
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>ACCESSOIRES</Accordion.Header>
                    <Accordion.Body>
                      <FieldArray name="itemsAccessoires">
                        {({ remove, push }) => (
                          <>
                            {values.itemsAccessoires.map((item, index) => (
                              <Row
                                key={index}
                                className="mb-3 align-items-center"
                              >
                                {/* Product Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Produit</Form.Label>
                                    <SearchableSelectAccessoires
                                      name={`itemsAccessoires[${index}].productId`}
                                      data={accessoires}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      setPrice={(idx, price, quantity) => {
                                        setFieldValue(
                                          `itemsAccessoires[${idx}].price`,
                                          price
                                        );
                                        setFieldValue(
                                          `itemsAccessoires[${idx}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            price,
                                            item.taxRate,
                                            quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsAccessoires[${idx}].subtotal`,
                                          calculateSubtotal(price, quantity)
                                        );
                                      }}
                                      values={values}
                                      calculateVATIncludedPrice={
                                        calculateVATIncludedPrice
                                      }
                                      calculateSubtotal={calculateSubtotal}
                                    />
                                    <ErrorMessage
                                      name={`itemsAccessoires[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* Quantity Input */}
                                <Col md={1}>
                                  <Form.Group>
                                    <Form.Label>Quantité</Form.Label>
                                    <InputGroup>
                                      <Field
                                        type="number"
                                        name={`itemsAccessoires[${index}].quantity`}
                                        as={Form.Control}
                                        onChange={(e) => {
                                          const quantity = e.target.value;
                                          setFieldValue(
                                            `itemsAccessoires[${index}].quantity`,
                                            quantity
                                          );
                                          setFieldValue(
                                            `itemsAccessoires[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPrice(
                                              item.price,
                                              item.taxRate,
                                              quantity
                                            )
                                          );
                                          setFieldValue(
                                            `itemsAccessoires[${index}].subtotal`,
                                            calculateSubtotal(
                                              item.price,
                                              quantity
                                            )
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`itemsAccessoires[${index}].quantity`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Col>
                                {/* Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Subtotal Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Sous total
                                    </Form.Label>
                                    <p className="price-text">{`${
                                      item.subtotal
                                        ? item.subtotal.toFixed(2)
                                        : "0.00"
                                    }€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Tax Rate Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>TVA</Form.Label>
                                    <Field
                                      as="select"
                                      name={`itemsAccessoires[${index}].taxRate`}
                                      className="form-control"
                                      onChange={(e) => {
                                        const taxRate = e.target.value;
                                        setFieldValue(
                                          `itemsAccessoires[${index}].taxRate`,
                                          taxRate
                                        );
                                        setFieldValue(
                                          `itemsAccessoires[${index}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            item.price,
                                            taxRate,
                                            item.quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsAccessoires[${index}].subtotal`,
                                          calculateSubtotal(
                                            item.price,
                                            item.quantity
                                          )
                                        );
                                      }}
                                    >
                                      <option value="">Select Tax Rate</option>
                                      {taxRates.map((rate) => (
                                        <option
                                          key={rate}
                                          value={rate}
                                        >{`${rate}%`}</option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`itemsAccessoires[${index}].taxRate`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* VAT Included Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      TVA incluse
                                    </Form.Label>
                                    <p className="price-text">
                                      {item.taxRate
                                        ? `${item.vatIncludedPrice.toFixed(2)}€`
                                        : "Entrez taxe"}
                                    </p>
                                  </Form.Group>
                                </Col>
                                {/* Remove Item Button */}
                                <Col xs="auto">
                                  <Button
                                    variant="outline-danger"
                                    onClick={() => remove(index)}
                                  >
                                    <AiTwotoneDelete />
                                  </Button>
                                </Col>
                              </Row>
                            ))}
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                push({
                                  productId: "",
                                  quantity: 1,
                                  price: 0,
                                  taxRate: "",
                                  vatIncludedPrice: 0,
                                  subtotal: 0,
                                });
                                //   console.log('Added new product item', values);
                              }}
                            >
                              <AiOutlinePlus /> Ajouter un produit
                            </Button>
                          </>
                        )}
                      </FieldArray>

                      {isTaxRateSelectedAccessoires && (
                <div className="mt-2" style={{ color: "#9f0f0f" }}>
                  <h5>Total des Accessoires: €{totalFeeAccessoires}</h5>
                </div>
              )}
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Électroménagers</Accordion.Header>
                    <Accordion.Body>
                      <FieldArray name="itemsElectromenagers">
                        {({ remove, push }) => (
                          <>
                            {values.itemsElectromenagers.map((item, index) => (
                              <Row
                                key={index}
                                className="mb-3 align-items-center"
                              >
                                {/* Product Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Produit</Form.Label>
                                    <SearchableSelectElectromenagers
                                      name={`itemsElectromenagers[${index}].productId`}
                                      data={electromenagers}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      setPrice={(idx, price, quantity) => {
                                        setFieldValue(
                                          `itemsElectromenagers[${idx}].price`,
                                          price
                                        );
                                        setFieldValue(
                                          `itemsElectromenagers[${idx}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            price,
                                            item.taxRate,
                                            quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsElectromenagers[${idx}].subtotal`,
                                          calculateSubtotal(price, quantity)
                                        );
                                      }}
                                      values={values}
                                      calculateVATIncludedPrice={
                                        calculateVATIncludedPrice
                                      }
                                      calculateSubtotal={calculateSubtotal}
                                    />
                                    <ErrorMessage
                                      name={`itemsElectromenagers[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* Quantity Input */}
                                <Col md={1}>
                                  <Form.Group>
                                    <Form.Label>Quantité</Form.Label>
                                    <InputGroup>
                                      <Field
                                        type="number"
                                        name={`itemsElectromenagers[${index}].quantity`}
                                        as={Form.Control}
                                        onChange={(e) => {
                                          const quantity = e.target.value;
                                          setFieldValue(
                                            `itemsElectromenagers[${index}].quantity`,
                                            quantity
                                          );
                                          setFieldValue(
                                            `itemsElectromenagers[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPrice(
                                              item.price,
                                              item.taxRate,
                                              quantity
                                            )
                                          );
                                          setFieldValue(
                                            `itemsElectromenagers[${index}].subtotal`,
                                            calculateSubtotal(
                                              item.price,
                                              quantity
                                            )
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`itemsElectromenagers[${index}].quantity`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Col>
                                {/* Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Subtotal Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Sous total
                                    </Form.Label>
                                    <p className="price-text">{`${
                                      item.subtotal
                                        ? item.subtotal.toFixed(2)
                                        : "0.00"
                                    }€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Tax Rate Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>TVA</Form.Label>
                                    <Field
                                      as="select"
                                      name={`itemsElectromenagers[${index}].taxRate`}
                                      className="form-control"
                                      onChange={(e) => {
                                        const taxRate = e.target.value;
                                        setFieldValue(
                                          `itemsElectromenagers[${index}].taxRate`,
                                          taxRate
                                        );
                                        setFieldValue(
                                          `itemsElectromenagers[${index}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            item.price,
                                            taxRate,
                                            item.quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsElectromenagers[${index}].subtotal`,
                                          calculateSubtotal(
                                            item.price,
                                            item.quantity
                                          )
                                        );
                                      }}
                                    >
                                      <option value="">Select Tax Rate</option>
                                      {taxRates.map((rate) => (
                                        <option
                                          key={rate}
                                          value={rate}
                                        >{`${rate}%`}</option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`itemsElectromenagers[${index}].taxRate`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* VAT Included Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      TVA incluse
                                    </Form.Label>
                                    <p className="price-text">
                                      {item.taxRate
                                        ? `${item.vatIncludedPrice.toFixed(2)}€`
                                        : "Entrez taxe"}
                                    </p>
                                  </Form.Group>
                                </Col>
                                {/* Remove Item Button */}
                                <Col xs="auto">
                                  <Button
                                    variant="outline-danger"
                                    onClick={() => remove(index)}
                                  >
                                    <AiTwotoneDelete />
                                  </Button>
                                </Col>
                              </Row>
                            ))}
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                push({
                                  productId: "",
                                  quantity: 1,
                                  price: 0,
                                  taxRate: "",
                                  vatIncludedPrice: 0,
                                  subtotal: 0,
                                });
                                //   console.log('Added new product item', values);
                              }}
                            >
                              <AiOutlinePlus /> Ajouter un produit
                            </Button>
                          </>
                        )}
                      </FieldArray>

                      {isTaxRateSelectedElectromenagers && (
                <div className="mt-2" style={{ color: "#9f0f0f" }}>
                  <h5>Total des Électroménagers: €{totalFeeElectromenagers}</h5>
                </div>
              )}
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Sanitaires</Accordion.Header>
                    <Accordion.Body>
                      <FieldArray name="itemsSanitaires">
                        {({ remove, push }) => (
                          <>
                            {values.itemsSanitaires.map((item, index) => (
                              <Row
                                key={index}
                                className="mb-3 align-items-center"
                              >
                                {/* Product Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Produit</Form.Label>
                                    <SearchableSelectSanitaires
                                      name={`itemsSanitaires[${index}].productId`}
                                      data={sanitaires}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      setPrice={(idx, price, quantity) => {
                                        setFieldValue(
                                          `itemsSanitaires[${idx}].price`,
                                          price
                                        );
                                        setFieldValue(
                                          `itemsSanitaires[${idx}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            price,
                                            item.taxRate,
                                            quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsSanitaires[${idx}].subtotal`,
                                          calculateSubtotal(price, quantity)
                                        );
                                      }}
                                      values={values}
                                      calculateVATIncludedPrice={
                                        calculateVATIncludedPrice
                                      }
                                      calculateSubtotal={calculateSubtotal}
                                    />
                                    <ErrorMessage
                                      name={`itemsSanitaires[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* Quantity Input */}
                                <Col md={1}>
                                  <Form.Group>
                                    <Form.Label>Quantité</Form.Label>
                                    <InputGroup>
                                      <Field
                                        type="number"
                                        name={`itemsSanitaires[${index}].quantity`}
                                        as={Form.Control}
                                        onChange={(e) => {
                                          const quantity = e.target.value;
                                          setFieldValue(
                                            `itemsSanitaires[${index}].quantity`,
                                            quantity
                                          );
                                          setFieldValue(
                                            `itemsSanitaires[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPrice(
                                              item.price,
                                              item.taxRate,
                                              quantity
                                            )
                                          );
                                          setFieldValue(
                                            `itemsSanitaires[${index}].subtotal`,
                                            calculateSubtotal(
                                              item.price,
                                              quantity
                                            )
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`itemsSanitaires[${index}].quantity`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Col>
                                {/* Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Subtotal Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Sous total
                                    </Form.Label>
                                    <p className="price-text">{`${
                                      item.subtotal
                                        ? item.subtotal.toFixed(2)
                                        : "0.00"
                                    }€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Tax Rate Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>TVA</Form.Label>
                                    <Field
                                      as="select"
                                      name={`itemsSanitaires[${index}].taxRate`}
                                      className="form-control"
                                      onChange={(e) => {
                                        const taxRate = e.target.value;
                                        setFieldValue(
                                          `itemsSanitaires[${index}].taxRate`,
                                          taxRate
                                        );
                                        setFieldValue(
                                          `itemsSanitaires[${index}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            item.price,
                                            taxRate,
                                            item.quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsSanitaires[${index}].subtotal`,
                                          calculateSubtotal(
                                            item.price,
                                            item.quantity
                                          )
                                        );
                                      }}
                                    >
                                      <option value="">Select Tax Rate</option>
                                      {taxRates.map((rate) => (
                                        <option
                                          key={rate}
                                          value={rate}
                                        >{`${rate}%`}</option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`itemsSanitaires[${index}].taxRate`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* VAT Included Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      TVA incluse
                                    </Form.Label>
                                    <p className="price-text">
                                      {item.taxRate
                                        ? `${item.vatIncludedPrice.toFixed(2)}€`
                                        : "Entrez taxe"}
                                    </p>
                                  </Form.Group>
                                </Col>
                                {/* Remove Item Button */}
                                <Col xs="auto">
                                  <Button
                                    variant="outline-danger"
                                    onClick={() => remove(index)}
                                  >
                                    <AiTwotoneDelete />
                                  </Button>
                                </Col>
                              </Row>
                            ))}
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                push({
                                  productId: "",
                                  quantity: 1,
                                  price: 0,
                                  taxRate: "",
                                  vatIncludedPrice: 0,
                                  subtotal: 0,
                                });
                                //   console.log('Added new product item', values);
                              }}
                            >
                              <AiOutlinePlus /> Ajouter un produit
                            </Button>
                          </>
                        )}
                      </FieldArray>

                      {isTaxRateSelectedSanitaires && (
                        <div className="mt-2" style={{ color: "#9f0f0f" }}>
                        <h5>Total des Sanitaires: €{totalFeeSanitaires}</h5>
                      </div>
              )}
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="4">
                    <Accordion.Header>PDT Solid Surface</Accordion.Header>
                    <Accordion.Body>
                      <FieldArray name="itemsSurfaces">
                        {({ remove, push }) => (
                          <>
                            {values.itemsSurfaces.map((item, index) => (
                              <Row
                                key={index}
                                className="mb-3 align-items-center"
                              >
                                {/* Product Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Produit</Form.Label>
                                    <SearchableSelectSurfaces
                                      name={`itemsSurfaces[${index}].productId`}
                                      data={surfaces}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      setPrice={(idx, price, quantity) => {
                                        setFieldValue(
                                          `itemsSurfaces[${idx}].price`,
                                          price
                                        );
                                        setFieldValue(
                                          `itemsSurfaces[${idx}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            price,
                                            item.taxRate,
                                            quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsSurfaces[${idx}].subtotal`,
                                          calculateSubtotal(price, quantity)
                                        );
                                      }}
                                      values={values}
                                      calculateVATIncludedPrice={
                                        calculateVATIncludedPrice
                                      }
                                      calculateSubtotal={calculateSubtotal}
                                    />
                                    <ErrorMessage
                                      name={`itemsSurfaces[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* Quantity Input */}
                                <Col md={1}>
                                  <Form.Group>
                                    <Form.Label>Quantité</Form.Label>
                                    <InputGroup>
                                      <Field
                                        type="number"
                                        name={`itemsSurfaces[${index}].quantity`}
                                        as={Form.Control}
                                        onChange={(e) => {
                                          const quantity = e.target.value;
                                          setFieldValue(
                                            `itemsSurfaces[${index}].quantity`,
                                            quantity
                                          );
                                          setFieldValue(
                                            `itemsSurfaces[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPrice(
                                              item.price,
                                              item.taxRate,
                                              quantity
                                            )
                                          );
                                          setFieldValue(
                                            `itemsSurfaces[${index}].subtotal`,
                                            calculateSubtotal(
                                              item.price,
                                              quantity
                                            )
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`itemsSurfaces[${index}].quantity`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Col>
                                {/* Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Subtotal Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Sous total
                                    </Form.Label>
                                    <p className="price-text">{`${
                                      item.subtotal
                                        ? item.subtotal.toFixed(2)
                                        : "0.00"
                                    }€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Tax Rate Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>TVA</Form.Label>
                                    <Field
                                      as="select"
                                      name={`itemsSurfaces[${index}].taxRate`}
                                      className="form-control"
                                      onChange={(e) => {
                                        const taxRate = e.target.value;
                                        setFieldValue(
                                          `itemsSurfaces[${index}].taxRate`,
                                          taxRate
                                        );
                                        setFieldValue(
                                          `itemsSurfaces[${index}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            item.price,
                                            taxRate,
                                            item.quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsSurfaces[${index}].subtotal`,
                                          calculateSubtotal(
                                            item.price,
                                            item.quantity
                                          )
                                        );
                                      }}
                                    >
                                      <option value="">Select Tax Rate</option>
                                      {taxRates.map((rate) => (
                                        <option
                                          key={rate}
                                          value={rate}
                                        >{`${rate}%`}</option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`itemsSurfaces[${index}].taxRate`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* VAT Included Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      TVA incluse
                                    </Form.Label>
                                    <p className="price-text">
                                      {item.taxRate
                                        ? `${item.vatIncludedPrice.toFixed(2)}€`
                                        : "Entrez taxe"}
                                    </p>
                                  </Form.Group>
                                </Col>
                                {/* Remove Item Button */}
                                <Col xs="auto">
                                  <Button
                                    variant="outline-danger"
                                    onClick={() => remove(index)}
                                  >
                                    <AiTwotoneDelete />
                                  </Button>
                                </Col>
                              </Row>
                            ))}
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                push({
                                  productId: "",
                                  quantity: 1,
                                  price: 0,
                                  taxRate: "",
                                  vatIncludedPrice: 0,
                                  subtotal: 0,
                                });
                                //   console.log('Added new product item', values);
                              }}
                            >
                              <AiOutlinePlus /> Ajouter un produit
                            </Button>
                          </>
                        )}
                      </FieldArray>

                      {isTaxRateSelectedSurfaces && (
                        <div className="mt-2" style={{ color: "#9f0f0f" }}>
                        <h5>Total des PDT Solid Surfaces: €{totalFeeSurfaces}</h5>
                      </div>
              )}
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="5">
                    <Accordion.Header>Divers</Accordion.Header>
                    <Accordion.Body>
                      <FieldArray name="itemsDivers">
                        {({ remove, push }) => (
                          <>
                            {values.itemsDivers.map((item, index) => (
                              <Row
                                key={index}
                                className="mb-3 align-items-center"
                              >
                                {/* Product Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Produit</Form.Label>
                                    <SearchableSelectDivers
                                      name={`itemsDivers[${index}].productId`}
                                      data={divers}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      setPrice={(idx, price, quantity) => {
                                        setFieldValue(
                                          `itemsDivers[${idx}].price`,
                                          price
                                        );
                                        setFieldValue(
                                          `itemsDivers[${idx}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            price,
                                            item.taxRate,
                                            quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsDivers[${idx}].subtotal`,
                                          calculateSubtotal(price, quantity)
                                        );
                                      }}
                                      values={values}
                                      calculateVATIncludedPrice={
                                        calculateVATIncludedPrice
                                      }
                                      calculateSubtotal={calculateSubtotal}
                                    />
                                    <ErrorMessage
                                      name={`itemsDivers[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* Quantity Input */}
                                <Col md={1}>
                                  <Form.Group>
                                    <Form.Label>Quantité</Form.Label>
                                    <InputGroup>
                                      <Field
                                        type="number"
                                        name={`itemsDivers[${index}].quantity`}
                                        as={Form.Control}
                                        onChange={(e) => {
                                          const quantity = e.target.value;
                                          setFieldValue(
                                            `itemsDivers[${index}].quantity`,
                                            quantity
                                          );
                                          setFieldValue(
                                            `itemsDivers[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPrice(
                                              item.price,
                                              item.taxRate,
                                              quantity
                                            )
                                          );
                                          setFieldValue(
                                            `itemsDivers[${index}].subtotal`,
                                            calculateSubtotal(
                                              item.price,
                                              quantity
                                            )
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`itemsDivers[${index}].quantity`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Col>
                                {/* Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Subtotal Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Sous total
                                    </Form.Label>
                                    <p className="price-text">{`${
                                      item.subtotal
                                        ? item.subtotal.toFixed(2)
                                        : "0.00"
                                    }€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Tax Rate Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>TVA</Form.Label>
                                    <Field
                                      as="select"
                                      name={`itemsDivers[${index}].taxRate`}
                                      className="form-control"
                                      onChange={(e) => {
                                        const taxRate = e.target.value;
                                        setFieldValue(
                                          `itemsDivers[${index}].taxRate`,
                                          taxRate
                                        );
                                        setFieldValue(
                                          `itemsDivers[${index}].vatIncludedPrice`,
                                          calculateVATIncludedPrice(
                                            item.price,
                                            taxRate,
                                            item.quantity
                                          )
                                        );
                                        setFieldValue(
                                          `itemsDivers[${index}].subtotal`,
                                          calculateSubtotal(
                                            item.price,
                                            item.quantity
                                          )
                                        );
                                      }}
                                    >
                                      <option value="">Select Tax Rate</option>
                                      {taxRates.map((rate) => (
                                        <option
                                          key={rate}
                                          value={rate}
                                        >{`${rate}%`}</option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`itemsDivers[${index}].taxRate`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* VAT Included Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      TVA incluse
                                    </Form.Label>
                                    <p className="price-text">
                                      {item.taxRate
                                        ? `${item.vatIncludedPrice.toFixed(2)}€`
                                        : "Entrez taxe"}
                                    </p>
                                  </Form.Group>
                                </Col>
                                {/* Remove Item Button */}
                                <Col xs="auto">
                                  <Button
                                    variant="outline-danger"
                                    onClick={() => remove(index)}
                                  >
                                    <AiTwotoneDelete />
                                  </Button>
                                </Col>
                              </Row>
                            ))}
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                push({
                                  productId: "",
                                  quantity: 1,
                                  price: 0,
                                  taxRate: "",
                                  vatIncludedPrice: 0,
                                  subtotal: 0,
                                });
                                //   console.log('Added new product item', values);
                              }}
                            >
                              <AiOutlinePlus /> Ajouter un produit
                            </Button>
                          </>
                        )}
                      </FieldArray>

                      {isTaxRateSelectedDivers && (
                        <div className="mt-2" style={{ color: "#9f0f0f" }}>
                        <h5>Total des Divers: €{totalFeeDivers}</h5>
                      </div>
              )}
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
                type="number"
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
                type="number"
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

            <Button type="submit" variant="success">
              Submit
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};


export default CreateNewDevisCommande;