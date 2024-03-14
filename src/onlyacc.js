import React, { useState } from "react";
import "./components/create-new-devis-commande/create-new-devis-commande.css";
import * as Yup from "yup";
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai';
import { Formik, ErrorMessage, Field, FieldArray, useFormik } from "formik";
import {
  Form, 
  Button,
  Row,
  Col,
  Card,
  InputGroup,
  Dropdown, FormControl,
  Accordion,
} from "react-bootstrap";
import accessoires from "./assets/data/accessoires.json";

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
  
const calculateVATIncludedPrice = (price, taxRate, quantity) => {
  return price * quantity * (1 + taxRate / 100);
};

const calculateSubtotal = (price, quantity) => {
  return price * quantity;
};

const Onlyacc = () => {
  const initialValues = {
    itemsAccessoires: [],
  };

  const validationSchema = Yup.object({
    itemsAccessoires: Yup.array().of(
      Yup.object().shape({
          productId: Yup.string().required('Le produit est requis'),
          quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
          taxRate: Yup.string().required('Obligatoire'),
      })
  ),
  });

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
        const calculateTotalFeeAccessoires = () => {
          return values.itemsAccessoires
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

          // Check if any item has a tax rate selected
        const isTaxRateSelectedAccessoires = values.itemsAccessoires.some(item => item.taxRate);

        // Calculate the total fee only if tax rate is selected
        const totalFeeAccessoires = isTaxRateSelectedAccessoires ? calculateTotalFeeAccessoires() : null;

       

        return (
          <Form noValidate onSubmit={formik.handleSubmit}>    
            <Card className="mb-5">
              <Card.Header
                as="h3"
                style={{ color: "white", backgroundColor: "var(--color2)" }}
              >
                Projet
              </Card.Header>
              <Card.Body>
                <Accordion defaultActiveKey={["0"]} alwaysOpen>      
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
                </Accordion>
              </Card.Body>
            </Card>


            <Button type="submit" variant="success">
              Submit
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};


export default Onlyacc;