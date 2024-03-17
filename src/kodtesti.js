import React, { useState } from "react";
import "../src/components/create-new-devis-commande/create-new-devis-commande.css";
import * as Yup from "yup";
import { AiOutlinePlus, AiTwotoneDelete } from "react-icons/ai";
import { Formik, ErrorMessage, Field, FieldArray, useFormik } from "formik";
import {Form, Button, Row, Col, Card, InputGroup, Dropdown, FormControl, Accordion } from "react-bootstrap";
import electromenagers from "../src/assets/data/electromenagers.json";

const taxRates = [0, 6, 10, 20, 21];
// Discount rates array
const discountRates = Array.from({ length: 31 }, (_, index) => index); // 0'dan 30'a kadar olan sayılar
const calculateVATIncludedPrice = (price, taxRate, quantity) => {
  return price * quantity * (1 + taxRate / 100);
};

const calculateSubtotal = (price, quantity) => {
  return price * quantity;
};

// Discounted Price ve Tax Included Price hesaplama fonksiyonları
const calculateDiscountedPrice = (subtotal, discountRate) => {
  return subtotal * (1 - discountRate / 100);
};

const calculateVATIncludedPriceAfterDiscount = (discountedPrice, taxRate) => {
  return discountedPrice * (1 + taxRate / 100);
};


const SearchableSelectElectromenagers = ({ name, data, setFieldValue, value, placeholder, isProduct, index, setPrice, values, calculateVATIncludedPrice, calculateSubtotal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItem = data.find((item) => item.id === value);

  return (
    <div>
      <FormControl
        placeholder={placeholder}
        value={searchTerm || (selectedItem ? selectedItem.name : "")}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />
      {showDropdown && (
        <Dropdown.Menu show>
          {data
            .filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <Dropdown.Item
  key={item.id}
  onClick={() => {
    setFieldValue(name, item.id);
    setSearchTerm("");

    if (isProduct) {
      const currentQuantity = values.itemsElectromenagers[index].quantity || 1;
      const selectedProduct = electromenagers.find(p => p.id === item.id);
      const price = selectedProduct ? selectedProduct.price : 0;
      const subtotal = calculateSubtotal(price, currentQuantity);
      const discountRate = values.itemsElectromenagers[index].discountRate || 0;
      const discountedPrice = calculateDiscountedPrice(subtotal, discountRate);
      const vatIncludedPrice = calculateVATIncludedPriceAfterDiscount(discountedPrice, values.itemsElectromenagers[index].taxRate);

      setFieldValue(`itemsElectromenagers[${index}].price`, price);
      setFieldValue(`itemsElectromenagers[${index}].subtotal`, subtotal);
      setFieldValue(`itemsElectromenagers[${index}].discountedPrice`, discountedPrice);
      setFieldValue(`itemsElectromenagers[${index}].vatIncludedPrice`, vatIncludedPrice);
    }
  }}
>
  {item.name}
</Dropdown.Item>

            ))}
        </Dropdown.Menu>
      )}
    </div>
  );
};

const ProductForm = () => {
  const initialValues = {
    itemsElectromenagers: [],
    deliveryFee: "",
    montageFee: "",
    totalFee: "",
    globaldiscount:"",
  };

  const validationSchema = Yup.object({
    deliveryFee: Yup.string(),
    montageFee: Yup.string(),
    totalFee: Yup.string(),
    globaldiscount: Yup.string(),
    itemsElectromenagers: Yup.array().of(
      Yup.object().shape({
        productId: Yup.string().required("Le produit est requis"),
        quantity: Yup.number()
          .min(1, "La quantité doit être minimum 1")
          .required("La quantité est requise"),
        taxRate: Yup.string().required("Obligatoire"),
        discountRate: Yup.string(),
        discountedPrice: Yup.number(),
      })
    ),
  });

  const onSubmit = (values) => {
    console.log("Form values:", values);
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
        const calculateGrandTotal = () => {
          const totalElectromenagers = parseFloat(totalFeeElectromenagers || 0);
          const deliveryFee = parseFloat(values.deliveryFee || 0); // deliveryFee değerini çek ve float'a çevir
          const montageFee = parseFloat(values.montageFee || 0); // montageFee değerini çek ve float'a çevir
          const globaldiscount = parseFloat(values.globaldiscount || 0); // globaldiscount değerini çek ve float'a çevir


          // Formun altında gösterilecek genel toplamı hesapla
          const grandTotal = totalElectromenagers + deliveryFee + montageFee - globaldiscount;
          return grandTotal.toFixed(2); // 2 ondalık basamağa yuvarla
        };

        const calculateTotalFeeElectromenagers = () => {
          return values.itemsElectromenagers
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

        // Check if any item has a tax rate selected
        const isTaxRateSelectedElectromenagers =
          values.itemsElectromenagers.some((item) => item.taxRate);

        // Calculate the total fee only if tax rate is selected
        const totalFeeElectromenagers = isTaxRateSelectedElectromenagers
          ? calculateTotalFeeElectromenagers()
          : null;

        return (
          <Form noValidate onSubmit={handleSubmit}>
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
                                    <Form.Label>Product</Form.Label>
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
                                    <Form.Label>Quantity</Form.Label>
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
                                          const subtotal = calculateSubtotal(
                                            item.price,
                                            quantity
                                          );
                                          const discountedPrice =
                                            calculateDiscountedPrice(
                                              subtotal,
                                              item.discountRate || 0
                                            );
                                          setFieldValue(
                                            `itemsElectromenagers[${index}].discountedPrice`,
                                            discountedPrice
                                          );
                                          setFieldValue(
                                            `itemsElectromenagers[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPriceAfterDiscount(
                                              discountedPrice,
                                              item.taxRate
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
                                      Unit price
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Subtotal Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Subtotal
                                    </Form.Label>
                                    <p className="price-text">{`${
                                      item.subtotal
                                        ? item.subtotal.toFixed(2)
                                        : "0.00"
                                    }€`}</p>
                                  </Form.Group>
                                </Col>

                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Discount Rate</Form.Label>
                                    <Field
                                      as="select"
                                      name={`itemsElectromenagers[${index}].discountRate`}
                                      className="form-control"
                                      onChange={(e) => {
                                        const discountRate = e.target.value;
                                        const subtotal = calculateSubtotal(
                                          item.price,
                                          item.quantity
                                        );
                                        const discountedPrice =
                                          calculateDiscountedPrice(
                                            subtotal,
                                            discountRate
                                          );
                                        setFieldValue(
                                          `itemsElectromenagers[${index}].discountRate`,
                                          discountRate
                                        );
                                        setFieldValue(
                                          `itemsElectromenagers[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsElectromenagers[${index}].vatIncludedPrice`,
                                          calculateVATIncludedPriceAfterDiscount(
                                            discountedPrice,
                                            item.taxRate
                                          )
                                        );
                                      }}
                                    >
                                      <option value="">
                                        Select Discount Rate
                                      </option>
                                      {discountRates.map((rate) => (
                                        <option
                                          key={rate}
                                          value={rate}
                                        >{`${rate}%`}</option>
                                      ))}
                                    </Field>
                                  </Form.Group>
                                </Col>

                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Discounted Price
                                    </Form.Label>
                                    <p className="price-text">{`${
                                      item.discountedPrice
                                        ? item.discountedPrice.toFixed(2)
                                        : "0.00"
                                    }€`}</p>
                                  </Form.Group>
                                </Col>

                                {/* Tax Rate Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>TAX Rate</Form.Label>
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
                                        const subtotal = calculateSubtotal(
                                          item.price,
                                          item.quantity
                                        );
                                        const discountedPrice =
                                          calculateDiscountedPrice(
                                            subtotal,
                                            item.discountRate || 0
                                          );
                                        setFieldValue(
                                          `itemsElectromenagers[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsElectromenagers[${index}].vatIncludedPrice`,
                                          calculateVATIncludedPriceAfterDiscount(
                                            discountedPrice,
                                            taxRate
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
                                      VAT Included Prıce
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
                          <h5>
                            Total des Électroménagers: €
                            {totalFeeElectromenagers}
                          </h5>
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
                placeholder="Frais de livraison"
                value={values.deliveryFee}
                onChange={(e) => setFieldValue("deliveryFee", e.target.value)}
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
                placeholder="Frais de pose"
                value={values.montageFee}
                onChange={(e) => setFieldValue("montageFee", e.target.value)}
                isInvalid={!!formik.errors.montageFee}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.montageFee}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              className="pose mb-5"
              style={{ display: "flex", gap: "65px" }}
            >
              <Form.Label as="h3">Global Remise:</Form.Label>

              <Form.Control
                type="number"
                style={{
                  color: "#9f0f0f",
                  borderColor: "#9f0f0f",
                  width: "200px",
                }} 
                placeholder="Global Remise:"
                value={values.globaldiscount}
                onChange={(e) => setFieldValue("globaldiscount", e.target.value)}
                isInvalid={!!formik.errors.globaldiscount}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.globaldiscount}
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
                TOTAL TVAC: {/* €{grandTotal} */}
              </Form.Label>

              <Form.Control
                type="text"
                style={{
                  color: "#9f0f0f",
                  borderColor: "#9f0f0f",
                  width: "170px",
                }}
                placeholder="Total TVAC"
                value={`${calculateGrandTotal()}€`} // Genel toplamı hesapla ve göster
                readOnly
              />
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

export default ProductForm;
