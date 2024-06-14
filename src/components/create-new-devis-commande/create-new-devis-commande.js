import React, { useState } from "react";
import "./create-new-devis-commande.css";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { AiOutlinePlus, AiTwotoneDelete, AiFillEdit } from "react-icons/ai";
import { Formik, ErrorMessage, Field, FieldArray, useFormik } from "formik";
import { NumericFormat } from 'react-number-format';
import {
  Form,
  Button,
  Spinner,
  Row,
  Col,
  Card,
  InputGroup,
  Dropdown,
  FormControl,
  Accordion,
} from "react-bootstrap";
import accessoires from "../../assets/data/accessoires.json";
import electromenagers from "../../assets/data/electromenagers.json";
import sanitaires from "../../assets/data/sanitaires.json";
import surfaces from "../../assets/data/surfaces.json";
import validCodes from "../../assets/data/discountCodes.json";

const taxRates = [0, 6, 10, 20, 21];
const createDiscountRates = (length) => Array.from({ length }, (_, index) => index);

const discountRatesElectromenagers = createDiscountRates(31);
const discountRatesAccessoires = createDiscountRates(31);
const discountRatesSanitaires = createDiscountRates(31);
const discountRatesSurfaces = createDiscountRates(31);


const calculateVATIncludedPrice = (price, taxRate, quantity) => {
  return price * quantity * (1 + taxRate / 100);
};

const calculateSubtotal = (price, quantity) => {
  return price * quantity;
};

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
  dataType 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedItem = data.find(item => item.id === value);

  const handleSelect = (item) => {
    setFieldValue(name, item.id);
    setSearchTerm('');

    if (isProduct) {
      setFieldValue(`items${dataType}[${index}].description`, item.description);
      const currentQuantity = values[`items${dataType}`][index].quantity || 1;
      const selectedProduct = data.find(p => p.id === item.id);
      const price = selectedProduct ? selectedProduct.price : 0;
      const subtotal = calculateSubtotal(price, currentQuantity);
      const discountRate = values[`items${dataType}`][index].discountRate || 0;
      const discountedPrice = calculateDiscountedPrice(subtotal, discountRate);
      const vatIncludedPrice = calculateVATIncludedPriceAfterDiscount(discountedPrice, values[`items${dataType}`][index].taxRate);

      setFieldValue(`items${dataType}[${index}].price`, price);
      setFieldValue(`items${dataType}[${index}].subtotal`, subtotal);
      setFieldValue(`items${dataType}[${index}].discountedPrice`, discountedPrice);
      setFieldValue(`items${dataType}[${index}].vatIncludedPrice`, vatIncludedPrice);
    }
  };

  return (
    <div>
      <FormControl
        placeholder={placeholder}
        value={searchTerm || (selectedItem ? selectedItem.name : '')}
        onChange={e => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />
      {showDropdown && (
        <Dropdown.Menu show>
          {data
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(item => (
              <Dropdown.Item key={item.id} onClick={() => handleSelect(item)}>
                {item.name}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      )}
    </div>
  );
};


const calculateTotalVATIncludedPrice = (articles) => {
  return articles.reduce(
    (total, article) => total + (article.vatIncludedPrice || 0),
    0
  );
};

const calculateTotalVATIncludedPriceDivers = (itemsDivers) => {
  // itemsDivers'ın dizi olduğundan ve boş olmadığından emin olun
  if (Array.isArray(itemsDivers) && itemsDivers.length > 0) {
    return itemsDivers.reduce(
      (total, itemsDiver) => total + (itemsDiver.vatIncludedPrice || 0),
      0
    );
  }
  return 0; 
};


const CreateNewDevisCommande = () => {
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [creating, setCreating] = useState(false);
  

  const initialValues = {
    floor: "",
    elevator: "",
    status: "",
    articles: [],
    itemsAccessoires: [],
    itemsElectromenagers: [],
    itemsSanitaires: [],
    itemsDivers: [],
    itemsSurfaces: [],
    deliveryFee: "",
    montageFee: "",
    totalFee: "",
    globaldiscount: "",
    code: "",
    grandTotal: 0,
  };

  const validationSchema = Yup.object({
    floor: Yup.string().required("Obligatoire"),
    elevator: Yup.string().required("Obligatoire"),
    status: Yup.string().required("Obligatoire"),
    deliveryFee: Yup.number()
    .min(1, "La frais de livraison doit être minimum 1€")
    .required("Obligatoire"),
    montageFee: Yup.number()
    .min(1, "La frais de livraison doit être minimum 1€")
    .required("Obligatoire"),
    totalFee: Yup.string(),
    grandTotal: Yup.number(),
    globaldiscount: Yup.string(),
    code: Yup.string(),
    articles: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Obligatoire"),
        price: Yup.number().required("Obligatoire"),
        quantity: Yup.number()
          .min(1, "La quantité doit être minimum 1")
          .required("La quantité est requise"),
        taxRate: Yup.string().required("Obligatoire"),
      })
    ),
    itemsDivers: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Obligatoire"),
        price: Yup.number().required("Obligatoire"),
        quantity: Yup.number()
          .min(1, "La quantité doit être minimum 1")
          .required("La quantité est requise"),
        taxRate: Yup.string().required("Obligatoire"),
      })
    ),
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
    itemsSanitaires: Yup.array().of(
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
    itemsSurfaces: Yup.array().of(
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
    setCreating(true);
    try {
      toast.success("Devis créé avec succès");
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

  const handleCodeChange = (e) => {
    const codeInput = e.target.value;
    formik.setFieldValue("code", codeInput);
    if (validCodes.validCodes.includes(codeInput)) {
      setIsCodeValid(true);
    } else {
      setIsCodeValid(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        const calculateGrandTotal = () => {
         
          const totalAccessoires = parseFloat(totalFeeAccessoires || 0);
          const totalElectromenagers = parseFloat(totalFeeElectromenagers || 0);
          const totalSanitaires = parseFloat(totalFeeSanitaires || 0);
          const totalSurfaces = parseFloat(totalFeeSurfaces || 0);
          const totalDivers = parseFloat(
            calculateTotalVATIncludedPriceDivers(values.itemsDivers) || 0
          );
          const totalArticles = parseFloat(
            calculateTotalVATIncludedPrice(values.articles) || 0
          );
          const deliveryFee = parseFloat(values.deliveryFee || 0); 
          const montageFee = parseFloat(values.montageFee || 0); 
          let globaldiscount = parseFloat(values.globaldiscount || 0); 

       
          if (!isCodeValid || !globaldiscount) {
            globaldiscount = 0;
          }

          const grandTotal =
            totalAccessoires +
            totalElectromenagers +
            totalSanitaires +
            totalDivers +
            totalSurfaces +
            totalArticles +
            deliveryFee +
            montageFee -
            globaldiscount;
            
          
            if (
            values.grandTotal !== grandTotal.toFixed(2)
          ) {
            setFieldValue("grandTotal", grandTotal.toFixed(2));
          }
        };



        const calculateTotalFeeAccessoires = () => {
          return values.itemsAccessoires
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); 
        };

        const isTaxRateSelectedAccessoires = values.itemsAccessoires.some(
          (item) => item.taxRate
        );

        const totalFeeAccessoires = isTaxRateSelectedAccessoires
          ? calculateTotalFeeAccessoires()
          : null;

        const calculateTotalFeeElectromenagers = () => {
          return values.itemsElectromenagers
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); 
        };

        const isTaxRateSelectedElectromenagers =
          values.itemsElectromenagers.some((item) => item.taxRate);

        const totalFeeElectromenagers = isTaxRateSelectedElectromenagers
          ? calculateTotalFeeElectromenagers()
          : null;

        const calculateTotalFeeSanitaires = () => {
          return values.itemsSanitaires
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); 
        };

        const isTaxRateSelectedSanitaires = values.itemsSanitaires.some(
          (item) => item.taxRate
        );

        const totalFeeSanitaires = isTaxRateSelectedSanitaires
          ? calculateTotalFeeSanitaires()
          : null;

        const calculateTotalFeeSurfaces = () => {
          return values.itemsSurfaces
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); 
        };

        const isTaxRateSelectedSurfaces = values.itemsSurfaces.some(
          (item) => item.taxRate
        );

        const totalFeeSurfaces = isTaxRateSelectedSurfaces
          ? calculateTotalFeeSurfaces()
          : null;


 const updateDiverItem = (index, updatedValues) => {
            const newItemsDivers = [...values.itemsDivers];
            const currentItemsDiver = { ...newItemsDivers[index], ...updatedValues };

            if (
              currentItemsDiver.taxRate !== undefined &&
              currentItemsDiver.taxRate !== null &&
              currentItemsDiver.price !== undefined
            ) {
              const vatIncludedPrice = calculateVATIncludedPrice(
                currentItemsDiver.price,
                currentItemsDiver.taxRate,
                currentItemsDiver.quantity
              );
              currentItemsDiver.vatIncludedPrice = vatIncludedPrice;
            }

            newItemsDivers[index] = currentItemsDiver;
            setFieldValue("itemsDivers", newItemsDivers);

            calculateGrandTotal();
          };

          const allArticlesHaveTaxRateSelectedDivers = (itemsDivers) => {
            return itemsDivers.every(
              (itemsDiver) =>
              itemsDiver.taxRate !== undefined && itemsDiver.taxRate !== ""
            );
          };

          const totalFeeItemsDivers = calculateTotalVATIncludedPriceDivers(
            values.itemsDivers
          ).toFixed(2);
          if (values.totalFeeItemsDivers !== totalFeeItemsDivers) {
            setFieldValue("totalFeeItemsDivers", totalFeeItemsDivers);
          }

          const updateArticleItem = (index, updatedValues) => {
            const newArticles = [...values.articles];
            const currentArticle = { ...newArticles[index], ...updatedValues };

            if (
              currentArticle.taxRate !== undefined &&
              currentArticle.taxRate !== null &&
              currentArticle.price !== undefined
            ) {
              const vatIncludedPrice = calculateVATIncludedPrice(
                currentArticle.price,
                currentArticle.taxRate,
                currentArticle.quantity
              );
              currentArticle.vatIncludedPrice = vatIncludedPrice;
            }

            newArticles[index] = currentArticle;
            setFieldValue("articles", newArticles);

            calculateGrandTotal();
          };

          const allArticlesHaveTaxRateSelected = (articles) => {
            return articles.every(
              (article) =>
                article.taxRate !== undefined && article.taxRate !== ""
            );
          };

          const totalFeeArticles = calculateTotalVATIncludedPrice(
            values.articles
          ).toFixed(2);
          if (values.totalFeeArticles !== totalFeeArticles) {
            setFieldValue("totalFeeArticles", totalFeeArticles);
          }

        if (values.totalFeeAccessoires !== totalFeeAccessoires) {
          setFieldValue("totalFeeAccessoires", totalFeeAccessoires)
        }

        if (values.totalFeeElectromenagers !== totalFeeElectromenagers) {
          setFieldValue("totalFeeElectromenagers", totalFeeElectromenagers)
        }

        if (values.totalFeeSanitaires !== totalFeeSanitaires) {
          setFieldValue("totalFeeSanitaires", totalFeeSanitaires)
        }

        if (values.totalFeeSurfaces !== totalFeeSurfaces) {
          setFieldValue("totalFeeSurfaces", totalFeeSurfaces)
        }

        calculateGrandTotal()
        return (
          <Form noValidate onSubmit={handleSubmit}>
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
                      name="status"
                      value={values.status}
                      onChange={(e) => setFieldValue("status", e.target.value)}
                      isInvalid={!!formik.errors.status}
                    >
                      <option value="" disabled>
                        --Devis ou Bon de commande--
                      </option>
                      <option value="Devis">Devis</option>
                      <option value="Bon de commande">Bon de commande</option>
                    </Form.Select>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="error-message"
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4} lg={4} className="mb-3">
                    <Form.Label>A quel étage se trouve la cuisine ?</Form.Label>
                    <Form.Select
                      name="floor"
                      value={values.floor}
                      onChange={(e) => setFieldValue("floor", e.target.value)}
                      isInvalid={!!formik.errors.floor}
                    >
                      <option value="" disabled>
                        --Sélectionnez l'étage--
                      </option>
                      <option value="Rez-de-chaussee">Rez-de-chaussée</option>
                      <option value="etage-1">1</option>
                      <option value="etage-2">2</option>
                      <option value="etage-3">3</option>
                      <option value="etage-4">4</option>
                      <option value="etage 5 ou plus">5 ou plus</option>
                    </Form.Select>
                    <ErrorMessage
                      name="floor"
                      component="div"
                      className="error-message"
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4} lg={4} className="mb-3">
                    <Form.Label>Ascenseur - Lift ?</Form.Label>
                    <Form.Select
                      name="elevator"
                      value={values.elevator}
                      onChange={(e) =>
                        setFieldValue("elevator", e.target.value)
                      }
                      isInvalid={!!formik.errors.elevator}
                    >
                      <option value="" disabled>
                        --Sélectionnez--
                      </option>
                      <option value="ascenseur-oui">Oui</option>
                      <option value="ascenseur-non">Non</option>
                      <option value="ascenseuroulift-pasbesoin">
                        Pas Besoin
                      </option>
                      <option value="lift-liftnecessaire">
                        Lift nécessaire
                      </option>
                    </Form.Select>
                    <ErrorMessage
                      name="elevator"
                      component="div"
                      className="error-message"
                    />
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-5">
              <Card.Header
                as="h3"
                style={{ color: "white", backgroundColor: "var(--color2)" }}
              >
                {/* Projet */}
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
                                        Tarif Catalogue HTVA
                                      </Form.Label>
                                      <NumericFormat
                                        thousandSeparator=","
                                        decimalSeparator="."
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={"€"} 
                                        allowNegative={false}
                                        className="form-control"
                                        placeholder="Entrez tarif catalogue"
                                        value={article.furnitureListPrice || ""}
                                        onValueChange={(values) => {
                                          const { floatValue } = values;
                                          const newFurnitureListPrice =
                                            floatValue || 0;
                                          const discountRate =
                                            article.discountRate ?? 0;
                                          const discountedPrice =
                                            newFurnitureListPrice -
                                            (newFurnitureListPrice *
                                              discountRate) /
                                              100;

                                          updateArticleItem(index, {
                                            ...article,
                                            furnitureListPrice:
                                              newFurnitureListPrice,
                                            price: discountedPrice,
                                          });
                                        }}
                                      />

                                      <Form.Control.Feedback type="invalid">
                                        {formik.touched[
                                          `articles[${index}].furnitureListPrice`
                                        ] &&
                                          formik.errors[
                                            `articles[${index}].furnitureListPrice`
                                          ]}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>

                                  <Col md={2}>
                                    <Form.Group>
                                      <Form.Label>Remise (%)</Form.Label>
                                      <Form.Select
                                        value={article.discountRate ?? "0"} 
                                        onChange={(e) => {
                                          const newDiscountRate = parseFloat(
                                            e.target.value || 0
                                          ); 
                                          const listPrice = parseFloat(
                                            article.furnitureListPrice || 0
                                          );
                                          const discountedPrice =
                                            listPrice -
                                            (listPrice * newDiscountRate) / 100;

                                          updateArticleItem(index, {
                                            ...article,
                                            discountRate: newDiscountRate, 
                                            price: discountedPrice, 
                                          });
                                        }}
                                      >
                                        <option value="0">0%</option>
                                        {[...Array(35).keys()].map((i) => (
                                          <option key={i + 1} value={i + 1}>
                                            {i + 1}%
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                  </Col>

                                  <Col>
                                    <Form.Group>
                                      <Form.Label
                                        style={{
                                          color: "#9f0f0f",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Tarif Mobilier HTVA
                                      </Form.Label>
                                      <NumericFormat
                                        thousandSeparator=","
                                        decimalSeparator="."
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix="€" 
                                        allowNegative={false}
                                        className={`form-control ${
                                          formik.errors.articles &&
                                          formik.errors.articles[index] &&
                                          formik.errors.articles[index].price &&
                                          formik.touched.articles &&
                                          formik.touched.articles[index] &&
                                          formik.touched.articles[index].price
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          color: "#9f0f0f",
                                          borderColor: "#9f0f0f",
                                        }}
                                        name={`articles[${index}].price`}
                                        value={article.price || 0}
                                        readOnly={true}
                                        displayType="text" 
                                      />
                                      <ErrorMessage
                                        name={`articles[${index}].price`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </Form.Group>
                                  </Col>

                                  <Col md={2}>
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

                                  <Col md={2}>
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
                                        furnitureListPrice: "",
                                        price: "",
                                        quantity: 1,
                                        taxRate: "",
                                        vatIncludedPrice: 0,
                                        subtotal: 0,
                                      });
                                    }}
                                  >
                                    <AiFillEdit /> Écrivez-vous
                                  </Button>
                                </Col>
                              </Row>
                              {values.articles.length > 0 &&
                                allArticlesHaveTaxRateSelected(
                                  values.articles
                                ) && (
                                  <Row
                                    className="mt-2"
                                    style={{ color: "#9f0f0f" }}
                                  >
                                    <Col>
                                      <h4>
                                        Total Article Price:{" "}
                                        {calculateTotalVATIncludedPrice(
                                          values.articles
                                        ).toFixed(2)}
                                        €
                                      </h4>
                                    </Col>
                                  </Row>
                                )}
                            </>
                          )}
                        </FieldArray>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

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
                                      dataType="Accessoires" 
                                    />

                                    <ErrorMessage
                                      name={`itemsAccessoires[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>

                                <Col md={5}>
                                  <Form.Group>
                                    <Form.Label>Designation</Form.Label>
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        lineHeight: "14px",
                                        marginBottom: "0.5rem",
                                      }}
                                    >
                                      {item.description || " "}
                                    </p>
                                  </Form.Group>
                                </Col>

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
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix ​​unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
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
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Produit</Form.Label>
                                    <SearchableSelect
                                      name={`itemsElectromenagers[${index}].productId`}
                                      data={electromenagers}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      values={values}
                                      calculateSubtotal={calculateSubtotal}
                                      dataType="Electromenagers"
                                    />

                                    <ErrorMessage
                                      name={`itemsElectromenagers[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>

                                <Col md={5}>
                                  <Form.Group>
                                    <Form.Label>Designation</Form.Label>
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        lineHeight: "14px",
                                        marginBottom: "0.5rem",
                                      }}
                                    >
                                      {item.description || " "}
                                    </p>
                                  </Form.Group>
                                </Col>

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
                                          setFieldValue(
                                            `itemsElectromenagers[${index}].subtotal`,
                                            subtotal
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
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix ​​unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
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
                                      {discountRatesElectromenagers.map(
                                        (rate) => (
                                          <option
                                            key={rate}
                                            value={rate}
                                          >{`${rate}%`}</option>
                                        )
                                      )}
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
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Produit</Form.Label>
                                    <SearchableSelect
                                      name={`itemsSanitaires[${index}].productId`}
                                      data={sanitaires}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      values={values}
                                      calculateSubtotal={calculateSubtotal}
                                      dataType="Sanitaires"
                                    />

                                    <ErrorMessage
                                      name={`itemsSanitaires[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={5}>
                                  <Form.Group>
                                    <Form.Label>Designation</Form.Label>
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        lineHeight: "14px",
                                        marginBottom: "0.5rem",
                                      }}
                                    >
                                      {item.description || " "}
                                    </p>
                                  </Form.Group>
                                </Col>
                                <Col md={1}>
                                  <Form.Group>
                                    <Form.Label>Quantity</Form.Label>
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
                                            `itemsSanitaires[${index}].discountedPrice`,
                                            discountedPrice
                                          );
                                          setFieldValue(
                                            `itemsSanitaires[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPriceAfterDiscount(
                                              discountedPrice,
                                              item.taxRate
                                            )
                                          );
                                          setFieldValue(
                                            `itemsSanitaires[${index}].subtotal`,
                                            subtotal
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
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix ​​unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
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
                                      name={`itemsSanitaires[${index}].discountRate`}
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
                                          `itemsSanitaires[${index}].discountRate`,
                                          discountRate
                                        );
                                        setFieldValue(
                                          `itemsSanitaires[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsSanitaires[${index}].vatIncludedPrice`,
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
                                      {discountRatesSanitaires.map((rate) => (
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
                                          `itemsSanitaires[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsSanitaires[${index}].vatIncludedPrice`,
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
                                      name={`itemsSanitaires[${index}].taxRate`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
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
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Produit</Form.Label>
                                    <SearchableSelect
                                      name={`itemsSurfaces[${index}].productId`}
                                      data={surfaces}
                                      setFieldValue={setFieldValue}
                                      value={item.productId}
                                      placeholder="Sélectionnez"
                                      isProduct={true}
                                      index={index}
                                      values={values}
                                      calculateSubtotal={calculateSubtotal}
                                      dataType="Surfaces"
                                    />

                                    <ErrorMessage
                                      name={`itemsSurfaces[${index}].productId`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={5}>
                                  <Form.Group>
                                    <Form.Label>Designation</Form.Label>
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        lineHeight: "14px",
                                        marginBottom: "0.5rem",
                                      }}
                                    >
                                      {item.description || " "}
                                    </p>
                                  </Form.Group>
                                </Col>
                                <Col md={1}>
                                  <Form.Group>
                                    <Form.Label>Quantity</Form.Label>
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
                                            `itemsSurfaces[${index}].discountedPrice`,
                                            discountedPrice
                                          );
                                          setFieldValue(
                                            `itemsSurfaces[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPriceAfterDiscount(
                                              discountedPrice,
                                              item.taxRate
                                            )
                                          );
                                          setFieldValue(
                                            `itemsSurfaces[${index}].subtotal`,
                                            subtotal
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
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="parent-text">
                                      Prix ​​unitaire
                                    </Form.Label>
                                    <p className="price-text">{`${item.price}€`}</p>
                                  </Form.Group>
                                </Col>
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
                                      name={`itemsSurfaces[${index}].discountRate`}
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
                                          `itemsSurfaces[${index}].discountRate`,
                                          discountRate
                                        );
                                        setFieldValue(
                                          `itemsSurfaces[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsSurfaces[${index}].vatIncludedPrice`,
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
                                      {discountRatesSurfaces.map((rate) => (
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
                                          `itemsSurfaces[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsSurfaces[${index}].vatIncludedPrice`,
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
                                      name={`itemsSurfaces[${index}].taxRate`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Form.Group>
                                </Col>
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
                              }}
                            >
                              <AiOutlinePlus /> Ajouter un produit
                            </Button>
                          </>
                        )}
                      </FieldArray>

                      {isTaxRateSelectedSurfaces && (
                        <div className="mt-2" style={{ color: "#9f0f0f" }}>
                          <h5>Total des Surfaces: €{totalFeeSurfaces}</h5>
                        </div>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="5">
                    <Accordion.Header
                      style={{
                        backgroundColor: "var(--bs-accordion-active-bg)",
                      }}
                    >
                      Divers
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <FieldArray name="itemsDivers">
                          {({ remove, push }) => (
                            <>
                              {values.itemsDivers.map((itemsDiver, index) => (
                                <Row
                                  key={index}
                                  className="mb-3 align-items-center"
                                >
                                  <Col md={12}>
                                    <Form.Group>
                                      <Form.Label>Divers</Form.Label>
                                      <Field
                                        name={`itemsDivers[${index}].name`}
                                        as={Form.Control}
                                        placeholder="Entrez divers"
                                        onChange={(e) => {
                                          updateDiverItem(index, {
                                            name: e.target.value,
                                          });
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`itemsDivers[${index}].name`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </Form.Group>
                                  </Col>

                                  <Col>
                                    <Form.Group>
                                      <Form.Label>
                                        Tarif Catalogue HTVA
                                      </Form.Label>
                                      <NumericFormat
                                        thousandSeparator=","
                                        decimalSeparator="."
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={"€"} 
                                        allowNegative={false}
                                        className="form-control"
                                        placeholder="Entrez tarif catalogue"
                                        value={itemsDiver.diversListPrice || ""}
                                        onValueChange={(values) => {
                                          const { floatValue } = values;
                                          const newDiversListPrice =
                                            floatValue || 0;
                                          const discountRate =
                                            itemsDiver.discountRate ?? 0;
                                          const discountedPrice =
                                            newDiversListPrice -
                                            (newDiversListPrice *
                                              discountRate) /
                                              100;

                                          updateDiverItem(index, {
                                            ...itemsDiver,
                                            diversListPrice: newDiversListPrice,
                                            price: discountedPrice,
                                          });
                                        }}
                                      />

                                      <Form.Control.Feedback type="invalid">
                                        {formik.touched[
                                          `itemsDivers[${index}].diversListPrice`
                                        ] &&
                                          formik.errors[
                                            `itemsDivers[${index}].diversListPrice`
                                          ]}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>

                                  {/* İndirim Oranı Seçimi */}
                                  <Col md={2}>
                                    <Form.Group>
                                      <Form.Label>Remise (%)</Form.Label>
                                      <Form.Select
                                        value={itemsDiver.discountRate ?? "0"} 
                                        onChange={(e) => {
                                          const newDiscountRate = parseFloat(
                                            e.target.value || 0
                                          ); 
                                          const listPrice = parseFloat(
                                            itemsDiver.diversListPrice || 0
                                          );
                                          const discountedPrice =
                                            listPrice -
                                            (listPrice * newDiscountRate) / 100;

                                          updateDiverItem(index, {
                                            ...itemsDiver,
                                            discountRate: newDiscountRate, 
                                            price: discountedPrice, 
                                          });
                                        }}
                                      >
                                        <option value="0">0%</option>
                                        {[...Array(35).keys()].map((i) => (
                                          <option key={i + 1} value={i + 1}>
                                            {i + 1}%
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                  </Col>

                                  <Col>
                                    <Form.Group>
                                      <Form.Label
                                        style={{
                                          color: "#9f0f0f",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Tarif Divers HTVA
                                      </Form.Label>
                                      <NumericFormat
                                        thousandSeparator=","
                                        decimalSeparator="."
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix="€" 
                                        allowNegative={false}
                                        className={`form-control ${
                                          formik.errors.itemsDivers &&
                                          formik.errors.itemsDivers[index] &&
                                          formik.errors.itemsDivers[index]
                                            .price &&
                                          formik.touched.itemsDivers &&
                                          formik.touched.itemsDivers[index] &&
                                          formik.touched.itemsDivers[index]
                                            .price
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        style={{
                                          color: "#9f0f0f",
                                          borderColor: "#9f0f0f",
                                        }}
                                        name={`itemsDivers[${index}].price`}
                                        value={itemsDiver.price || 0}
                                        readOnly={true}
                                        displayType="text" 
                                      />
                                      <ErrorMessage
                                        name={`itemsDivers[${index}].price`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </Form.Group>
                                  </Col>

                                  <Col md={2}>
                                    <Form.Group>
                                      <Form.Label>TVA</Form.Label>
                                      <Field
                                        as="select"
                                        name={`itemsDivers[${index}].taxRate`}
                                        className="form-control"
                                        onChange={(e) => {
                                          const newTaxRate =
                                            parseInt(e.target.value, 10) || 0;
                                          const { price = 0, quantity = 1 } =
                                            values.itemsDivers[index];
                                          const vatIncludedPrice =
                                            calculateVATIncludedPrice(
                                              price,
                                              newTaxRate,
                                              quantity
                                            );

                                          updateDiverItem(index, {
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
                                        name={`itemsDivers[${index}].taxRate`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </Form.Group>
                                  </Col>

                                  <Col md={2}>
                                    <Form.Group>
                                      <Form.Label className="parent-text">
                                        TVA incluse
                                      </Form.Label>
                                      <p className="price-text">
                                        {itemsDiver.taxRate === "" ||
                                        itemsDiver.taxRate === undefined
                                          ? "Entrez taxe"
                                          : `${itemsDiver.vatIncludedPrice.toFixed(
                                              2
                                            )}€`}
                                      </p>
                                    </Form.Group>
                                  </Col>

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
                                        diversListPrice: "",
                                        price: "",
                                        quantity: 1,
                                        taxRate: "",
                                        vatIncludedPrice: 0,
                                        subtotal: 0,
                                      });
                                    }}
                                  >
                                    <AiFillEdit /> Écrivez-vous
                                  </Button>
                                </Col>
                              </Row>
                              {values.itemsDivers.length > 0 &&
                                allArticlesHaveTaxRateSelectedDivers(
                                  values.itemsDivers
                                ) && (
                                  <Row
                                    className="mt-2"
                                    style={{ color: "#9f0f0f" }}
                                  >
                                    <Col>
                                      <h5>
                                        Prix Total Divers:{" "}
                                        {calculateTotalVATIncludedPriceDivers(
                                          values.itemsDivers
                                        ).toFixed(2)}
                                        €
                                      </h5>
                                    </Col>
                                  </Row>
                                )}
                            </>
                          )}
                        </FieldArray>
                      </Row>
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
    prefix={"€"} 
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
  <ErrorMessage
    name="deliveryFee"
    component="div"
    className="error-message"
  />
</Form.Group>

            <Form.Group
              className="pose mb-5"
              style={{ display: "flex", gap: "65px" }}
            >
              <Form.Label as="h3">Pose:</Form.Label>
              <NumericFormat
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"€"} 
                allowNegative={false}
                className={`form-control ${
                  formik.errors.montageFee && formik.touched.montageFee
                    ? "is-invalid"
                    : ""
                }`}
                style={{
                  color: "#9f0f0f",
                  borderColor: "#9f0f0f",
                  width: "200px",
                }}
                placeholder="Frais de pose"
                value={values.montageFee}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setFieldValue("montageFee", floatValue || 0);
                }}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.montageFee}
              </Form.Control.Feedback>
              <ErrorMessage
    name="montageFee"
    component="div"
    className="error-message"
  />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Code:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le code"
                value={formik.values.code}
                onChange={handleCodeChange}
                isInvalid={isCodeValid === false}
                isValid={isCodeValid === true}
              />
              <Form.Control.Feedback type="invalid">
                Invalid code.
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
                Code is valid!
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
                onChange={(e) =>
                  setFieldValue("globaldiscount", e.target.value)
                }
                isInvalid={!!formik.errors.globaldiscount}
                disabled={isCodeValid !== true}
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
                TOTAL TVAC: 
              </Form.Label>
              <NumericFormat
                value={values.grandTotal}
                displayType={"text"}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"€"} 
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
            Créer le projet
            </Button>
          </Form>
        );
      }} 
    </Formik>
  );
};



export default CreateNewDevisCommande;