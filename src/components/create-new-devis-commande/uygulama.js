import React, { useEffect, useState } from "react";
import "./create-new-devis-commande.css";
import * as Yup from "yup";
import { AiOutlinePlus, AiTwotoneDelete } from "react-icons/ai";
import { Formik, ErrorMessage, Field, FieldArray, useFormik } from "formik";
import { NumericFormat } from "react-number-format";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  InputGroup,
  Dropdown,
  FormControl,
  Accordion,
} from "react-bootstrap";
import accessoires from "../../assets/data/accessoires.json";

const taxRates = [0, 6, 10, 20, 21];
// Adım 1: Yardımcı fonksiyon
const createDiscountRates = (length) =>
  Array.from({ length }, (_, index) => index);

const discountRatesAccessoires = createDiscountRates(31);

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

const SearchableSelect = ({
  name,
  data,
  setFieldValue,
  value,
  placeholder,
  isProduct,
  index,
  values,
  calculateSubtotal,
  dataType, // Additional prop to differentiate data types
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItem = data.find((item) => item.id === value);

  const handleSelect = (item) => {
    setFieldValue(name, item.id);
    setSearchTerm("");

    if (isProduct) {
      setFieldValue(`items${dataType}[${index}].description`, item.description);
      const currentQuantity = values[`items${dataType}`][index].quantity || 1;
      const selectedProduct = data.find((p) => p.id === item.id);
      const price = selectedProduct ? selectedProduct.price : 0;
      const subtotal = calculateSubtotal(price, currentQuantity);
      const discountRate = values[`items${dataType}`][index].discountRate || 0;
      const discountedPrice = calculateDiscountedPrice(subtotal, discountRate);
      const vatIncludedPrice = calculateVATIncludedPriceAfterDiscount(
        discountedPrice,
        values[`items${dataType}`][index].taxRate
      );

      setFieldValue(`items${dataType}[${index}].price`, price);
      setFieldValue(`items${dataType}[${index}].subtotal`, subtotal);
      setFieldValue(
        `items${dataType}[${index}].discountedPrice`,
        discountedPrice
      );
      setFieldValue(
        `items${dataType}[${index}].vatIncludedPrice`,
        vatIncludedPrice
      );
    }
  };

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
              <Dropdown.Item key={item.id} onClick={() => handleSelect(item)}>
                {item.name}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      )}
    </div>
  );
};

const Uygulama = () => {
  const initialValues = {
    itemsAccessoires: [],
    deliveryFee: "",
    grandTotal: 0,
  };

  const validationSchema = Yup.object({
    deliveryFee: Yup.string(),
    grandTotal: Yup.number(),
    itemsAccessoires: Yup.array().of(
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
          const totalAccessoires = parseFloat(totalFeeAccessoires || 0);
          const deliveryFee = parseFloat(values.deliveryFee || 0); // deliveryFee değerini çek ve float'a çevir
          // Formun altında gösterilecek genel toplamı hesapla
          const grandTotal = totalAccessoires + deliveryFee;

          if (values.grandTotal !== grandTotal.toFixed(2)) {
            setFieldValue("grandTotal", grandTotal.toFixed(2));
          }
        };

        const calculateTotalFeeAccessoires = () => {
          return values.itemsAccessoires
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

        // Check if any item has a tax rate selected
        const isTaxRateSelectedAccessoires = values.itemsAccessoires.some(
          (item) => item.taxRate
        );

        // Calculate the total fee only if tax rate is selected
        const totalFeeAccessoires = isTaxRateSelectedAccessoires
          ? calculateTotalFeeAccessoires()
          : null;

        if (values.totalFeeAccessoires !== totalFeeAccessoires) {
          setFieldValue("totalFeeAccessoires", totalFeeAccessoires);
        }

        calculateGrandTotal();
        return (
          <Form noValidate onSubmit={handleSubmit}>
            <Card className="mb-5">
              <Card.Header
                as="h3"
                style={{ color: "white", backgroundColor: "var(--color2)" }}
              >
                {/* Projet */}
              </Card.Header>
              <Card.Body>
                <Accordion defaultActiveKey={["0"]} alwaysOpen>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Accessoires</Accordion.Header>
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
                                    <SearchableSelect
                                      name={`itemsAccessoires[${index}].productId`}
                                      data={accessoires}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      values={values}
                                      calculateSubtotal={calculateSubtotal}
                                      dataType="Accessoires" // Specific for accessoires
                                    />

                                    <ErrorMessage
                                      name={`itemsAccessoires[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                {/* Product Description */}
                                <Col md={5}>
                                  <Form.Group>
                                    <Form.Label>Designation</Form.Label>
                                    <p>{item.description || " "}</p>
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
                                            `itemsAccessoires[${index}].discountedPrice`,
                                            discountedPrice
                                          );
                                          setFieldValue(
                                            `itemsAccessoires[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPriceAfterDiscount(
                                              discountedPrice,
                                              item.taxRate
                                            )
                                          );
                                          setFieldValue(
                                            `itemsAccessoires[${index}].subtotal`,
                                            subtotal
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
                                      Prix ​​unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
                                {/* Subtotal Price Display */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Sous-total
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
                                    <Form.Label>Remise</Form.Label>
                                    <Field
                                      as="select"
                                      name={`itemsAccessoires[${index}].discountRate`}
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
                                          `itemsAccessoires[${index}].discountRate`,
                                          discountRate
                                        );
                                        setFieldValue(
                                          `itemsAccessoires[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsAccessoires[${index}].vatIncludedPrice`,
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
                                      {discountRatesAccessoires.map((rate) => (
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
                                      Prix Réduit
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
                                          `itemsAccessoires[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsAccessoires[${index}].vatIncludedPrice`,
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

            <Form.Group
              className="livraison mb-3"
              style={{ display: "flex", gap: "15px" }}
            >
              <Form.Label as="h3">Livraison:</Form.Label>
              <NumericFormat
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"€"} // Para birimi olarak Euro
                allowNegative={false}
                className={`form-control ${
                  formik.errors.deliveryFee && formik.touched.deliveryFee
                    ? "is-invalid"
                    : ""
                }`}
                style={{
                  color: "#9f0f0f",
                  borderColor: "#9f0f0f",
                  width: "200px",
                }}
                placeholder="Frais de livraison"
                value={values.deliveryFee}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setFieldValue("deliveryFee", floatValue || 0);
                }}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.deliveryFee}
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
              <NumericFormat
                value={values.grandTotal}
                displayType={"text"}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"€"} // Para birimi olarak Euro
                className="form-control"
                style={{
                  color: "#9f0f0f",
                  borderColor: "#9f0f0f",
                  width: "170px",
                }}
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

export default Uygulama;
