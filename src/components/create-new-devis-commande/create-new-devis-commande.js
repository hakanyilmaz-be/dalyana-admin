import React, { useEffect, useState } from "react";
import "./create-new-devis-commande.css";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { AiOutlinePlus, AiTwotoneDelete, AiFillEdit } from "react-icons/ai";
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
  Dropdown,
  FormControl,
  Accordion,
} from "react-bootstrap";
import accessoires from "../../assets/data/accessoires.json";
import electromenagers from "../../assets/data/electromenagers.json";
import sanitaires from "../../assets/data/sanitaires.json";
import divers from "../../assets/data/divers.json";
import surfaces from "../../assets/data/surfaces.json";
import validCodes from "../../assets/data/discountCodes.json";
//import { createUser } from "../../../api/admin-user-service";

const taxRates = [0, 6, 10, 20, 21];
const discountRatesElectromenagers = Array.from(
  { length: 31 },
  (_, index) => index
); // 0'dan 30'a kadar olan sayılar
const discountRatesAccessoires = Array.from(
  { length: 31 },
  (_, index) => index
); // 0'dan 30'a kadar olan sayılar
const discountRatesSanitaires = Array.from({ length: 31 }, (_, index) => index); // 0'dan 30'a kadar olan sayılar
const discountRatesDivers = Array.from({ length: 31 }, (_, index) => index); // 0'dan 30'a kadar olan sayılar
const discountRatesSurfaces = Array.from({ length: 31 }, (_, index) => index); // 0'dan 30'a kadar olan sayılar

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

const SearchableSelectAccessoires = ({
  name,
  data,
  setFieldValue,
  value,
  placeholder,
  isProduct,
  index,
  values,
  calculateSubtotal,
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
                    const currentQuantity =
                      values.itemsAccessoires[index].quantity || 1;
                    const selectedProduct = accessoires.find(
                      (p) => p.id === item.id
                    );
                    const price = selectedProduct ? selectedProduct.price : 0;
                    const subtotal = calculateSubtotal(price, currentQuantity);
                    const discountRate =
                      values.itemsAccessoires[index].discountRate || 0;
                    const discountedPrice = calculateDiscountedPrice(
                      subtotal,
                      discountRate
                    );
                    const vatIncludedPrice =
                      calculateVATIncludedPriceAfterDiscount(
                        discountedPrice,
                        values.itemsAccessoires[index].taxRate
                      );

                    setFieldValue(`itemsAccessoires[${index}].price`, price);
                    setFieldValue(
                      `itemsAccessoires[${index}].subtotal`,
                      subtotal
                    );
                    setFieldValue(
                      `itemsAccessoires[${index}].discountedPrice`,
                      discountedPrice
                    );
                    setFieldValue(
                      `itemsAccessoires[${index}].vatIncludedPrice`,
                      vatIncludedPrice
                    );
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

const SearchableSelectElectromenagers = ({
  name,
  data,
  setFieldValue,
  value,
  placeholder,
  isProduct,
  index,
  values,
  calculateSubtotal,
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
                    const currentQuantity =
                      values.itemsElectromenagers[index].quantity || 1;
                    const selectedProduct = electromenagers.find(
                      (p) => p.id === item.id
                    );
                    const price = selectedProduct ? selectedProduct.price : 0;
                    const subtotal = calculateSubtotal(price, currentQuantity);
                    const discountRate =
                      values.itemsElectromenagers[index].discountRate || 0;
                    const discountedPrice = calculateDiscountedPrice(
                      subtotal,
                      discountRate
                    );
                    const vatIncludedPrice =
                      calculateVATIncludedPriceAfterDiscount(
                        discountedPrice,
                        values.itemsElectromenagers[index].taxRate
                      );

                    setFieldValue(
                      `itemsElectromenagers[${index}].price`,
                      price
                    );
                    setFieldValue(
                      `itemsElectromenagers[${index}].subtotal`,
                      subtotal
                    );
                    setFieldValue(
                      `itemsElectromenagers[${index}].discountedPrice`,
                      discountedPrice
                    );
                    setFieldValue(
                      `itemsElectromenagers[${index}].vatIncludedPrice`,
                      vatIncludedPrice
                    );
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

const SearchableSelectSanitaires = ({
  name,
  data,
  setFieldValue,
  value,
  placeholder,
  isProduct,
  index,
  values,
  calculateSubtotal,
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
                    const currentQuantity =
                      values.itemsSanitaires[index].quantity || 1;
                    const selectedProduct = sanitaires.find(
                      (p) => p.id === item.id
                    );
                    const price = selectedProduct ? selectedProduct.price : 0;
                    const subtotal = calculateSubtotal(price, currentQuantity);
                    const discountRate =
                      values.itemsSanitaires[index].discountRate || 0;
                    const discountedPrice = calculateDiscountedPrice(
                      subtotal,
                      discountRate
                    );
                    const vatIncludedPrice =
                      calculateVATIncludedPriceAfterDiscount(
                        discountedPrice,
                        values.itemsSanitaires[index].taxRate
                      );

                    setFieldValue(`itemsSanitaires[${index}].price`, price);
                    setFieldValue(
                      `itemsSanitaires[${index}].subtotal`,
                      subtotal
                    );
                    setFieldValue(
                      `itemsSanitaires[${index}].discountedPrice`,
                      discountedPrice
                    );
                    setFieldValue(
                      `itemsSanitaires[${index}].vatIncludedPrice`,
                      vatIncludedPrice
                    );
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

const SearchableSelectDivers = ({
  name,
  data,
  setFieldValue,
  value,
  placeholder,
  isProduct,
  index,
  values,
  calculateSubtotal,
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
                    const currentQuantity =
                      values.itemsDivers[index].quantity || 1;
                    const selectedProduct = divers.find(
                      (p) => p.id === item.id
                    );
                    const price = selectedProduct ? selectedProduct.price : 0;
                    const subtotal = calculateSubtotal(price, currentQuantity);
                    const discountRate =
                      values.itemsDivers[index].discountRate || 0;
                    const discountedPrice = calculateDiscountedPrice(
                      subtotal,
                      discountRate
                    );
                    const vatIncludedPrice =
                      calculateVATIncludedPriceAfterDiscount(
                        discountedPrice,
                        values.itemsDivers[index].taxRate
                      );

                    setFieldValue(`itemsDivers[${index}].price`, price);
                    setFieldValue(`itemsDivers[${index}].subtotal`, subtotal);
                    setFieldValue(
                      `itemsDivers[${index}].discountedPrice`,
                      discountedPrice
                    );
                    setFieldValue(
                      `itemsDivers[${index}].vatIncludedPrice`,
                      vatIncludedPrice
                    );
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

const SearchableSelectSurfaces = ({
  name,
  data,
  setFieldValue,
  value,
  placeholder,
  isProduct,
  index,
  values,
  calculateSubtotal,
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
                    const currentQuantity =
                      values.itemsSurfaces[index].quantity || 1;
                    const selectedProduct = surfaces.find(
                      (p) => p.id === item.id
                    );
                    const price = selectedProduct ? selectedProduct.price : 0;
                    const subtotal = calculateSubtotal(price, currentQuantity);
                    const discountRate =
                      values.itemsSurfaces[index].discountRate || 0;
                    const discountedPrice = calculateDiscountedPrice(
                      subtotal,
                      discountRate
                    );
                    const vatIncludedPrice =
                      calculateVATIncludedPriceAfterDiscount(
                        discountedPrice,
                        values.itemsSurfaces[index].taxRate
                      );

                    setFieldValue(`itemsSurfaces[${index}].price`, price);
                    setFieldValue(`itemsSurfaces[${index}].subtotal`, subtotal);
                    setFieldValue(
                      `itemsSurfaces[${index}].discountedPrice`,
                      discountedPrice
                    );
                    setFieldValue(
                      `itemsSurfaces[${index}].vatIncludedPrice`,
                      vatIncludedPrice
                    );
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

const calculateTotalVATIncludedPrice = (articles) => {
  return articles.reduce(
    (total, article) => total + (article.vatIncludedPrice || 0),
    0
  );
};

const CreateNewDevisCommande = () => {
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [creating, setCreating] = useState(false);

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
    globaldiscount: "",
    code: "",
  };

  const validationSchema = Yup.object({
    floor: Yup.string().required("Obligatoire"),
    elevator: Yup.string().required("Obligatoire"),
    status: Yup.string().required("Obligatoire"),
    furnitureListPrice: Yup.string(),
    deliveryFee: Yup.string(),
    montageFee: Yup.string(),
    totalFee: Yup.string(),
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
    itemsDivers: Yup.array().of(
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
    console.log("Form values:", values);
    setCreating(true);
    try {
      // Perform submit actions, e.g., API call
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
          const totalDivers = parseFloat(totalFeeDivers || 0);
          const totalSurfaces = parseFloat(totalFeeSurfaces || 0);
          const totalArticles = parseFloat(
            calculateTotalVATIncludedPrice(values.articles) || 0
          );
          const deliveryFee = parseFloat(values.deliveryFee || 0); // deliveryFee değerini çek ve float'a çevir
          const montageFee = parseFloat(values.montageFee || 0); // montageFee değerini çek ve float'a çevir
          let globaldiscount = parseFloat(values.globaldiscount || 0); // Doğrudan indirim miktarı olarak al

          // globaldiscount doğrudan toplam maliyetten çıkarılacak
          // Kod geçerli değilse veya globaldiscount değeri girilmemişse, globaldiscount'u 0 olarak kabul et
          if (!isCodeValid || !globaldiscount) {
            globaldiscount = 0;
          }

          // Formun altında gösterilecek genel toplamı hesapla
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
          return grandTotal.toFixed(2); // 2 ondalık basamağa yuvarla
        };

        // Update articles function using setFieldValue from render props
        const updateArticleItem = (index, updatedValues) => {
          const newArticles = [...values.articles];
          newArticles[index] = { ...newArticles[index], ...updatedValues };
          setFieldValue("articles", newArticles);
        };

        const allArticlesHaveTaxRateSelected = (articles) => {
          // taxRate'in tanımlı olup olmadığını kontrol et
          return articles.every(
            (article) => article.taxRate !== undefined && article.taxRate !== ""
          );
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

        const calculateTotalFeeSanitaires = () => {
          return values.itemsSanitaires
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

        // Check if any item has a tax rate selected
        const isTaxRateSelectedSanitaires = values.itemsSanitaires.some(
          (item) => item.taxRate
        );

        // Calculate the total fee only if tax rate is selected
        const totalFeeSanitaires = isTaxRateSelectedSanitaires
          ? calculateTotalFeeSanitaires()
          : null;

        const calculateTotalFeeDivers = () => {
          return values.itemsDivers
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

        // Check if any item has a tax rate selected
        const isTaxRateSelectedDivers = values.itemsDivers.some(
          (item) => item.taxRate
        );

        // Calculate the total fee only if tax rate is selected
        const totalFeeDivers = isTaxRateSelectedDivers
          ? calculateTotalFeeDivers()
          : null;

        const calculateTotalFeeSurfaces = () => {
          return values.itemsSurfaces
            .reduce((total, item) => total + (item.vatIncludedPrice || 0), 0)
            .toFixed(2); // Convert to a fixed 2 decimal places
        };

        // Check if any item has a tax rate selected
        const isTaxRateSelectedSurfaces = values.itemsSurfaces.some(
          (item) => item.taxRate
        );

        // Calculate the total fee only if tax rate is selected
        const totalFeeSurfaces = isTaxRateSelectedSurfaces
          ? calculateTotalFeeSurfaces()
          : null;

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
                    {/* ErrorMessage bileşenini kullanarak hata mesajını göster */}
                    <ErrorMessage name="status" component="div" className="error-message" />
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
                     {/* ErrorMessage bileşenini kullanarak hata mesajını göster */}
                     <ErrorMessage name="floor" component="div" className="error-message" />
                  </Form.Group>

                  <Form.Group as={Col} md={4} lg={4} className="mb-3">
                    <Form.Label>Ascenseur - Lift ?</Form.Label>
                    <Form.Select
                      name="elevator"
                      value={values.elevator}
                      onChange={(e) => setFieldValue("elevator", e.target.value)}
                      isInvalid={
                        !!formik.errors.elevator
                      }
                    >
                      <option value="" disabled>
                        --Sélectionnez--
                      </option>
                      <option value="ascenseur-oui">Oui</option>
                      <option value="ascenseur-non">Non</option>
                      <option value="ascenseuroulift-pasbesoin">Pas Besoin</option>
                      <option value="lift-liftnecessaire">
                        Lift nécessaire
                      </option>
                    </Form.Select>
                     {/* ErrorMessage bileşenini kullanarak hata mesajını göster */}
                     <ErrorMessage name="elevator" component="div" className="error-message" />
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
                                        Tarif Catalogue € HTVA
                                      </Form.Label>
                                      <Form.Control
                                        type="number"
                                        placeholder="Entrez tarif catalogue"
                                        value={article.furnitureListPrice || ""}
                                        onChange={(e) => {
                                          const newFurnitureListPrice =
                                            parseFloat(e.target.value || 0);
                                          const discountRate =
                                            article.discountRate ?? 0; // Eğer discountRate undefined ise, default olarak 0 kullan
                                          const discountedPrice =
                                            newFurnitureListPrice -
                                            (newFurnitureListPrice *
                                              discountRate) /
                                              100;

                                          updateArticleItem(index, {
                                            ...article,
                                            furnitureListPrice:
                                              newFurnitureListPrice,
                                            price: discountedPrice, // Güncellenmiş indirimli fiyat
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

                                  {/* İndirim Oranı Seçimi */}
                                  <Col md={2}>
                                    <Form.Group>
                                      <Form.Label>Remise (%)</Form.Label>
                                      <Form.Select
                                        value={article.discountRate ?? "0"} // Eğer discountRate undefined ise, default olarak '0' kullan
                                        onChange={(e) => {
                                          const newDiscountRate = parseFloat(
                                            e.target.value || 0
                                          ); // Eğer e.target.value boş ise, 0 kullan
                                          const listPrice = parseFloat(
                                            article.furnitureListPrice || 0
                                          );
                                          const discountedPrice =
                                            listPrice -
                                            (listPrice * newDiscountRate) / 100;

                                          updateArticleItem(index, {
                                            ...article,
                                            discountRate: newDiscountRate, // Yeni indirim oranı
                                            price: discountedPrice, // İndirimli fiyat
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

                                  {/* Tarif Mobilier € - HTVA Input */}
                                  <Col>
                                    <Form.Group>
                                      <Form.Label
                                        style={{
                                          color: "#9f0f0f",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Tarif Mobilier € HTVA
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
                                        readOnly={true}
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

                                  {/* Display VAT Included Price */}
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
                              {/* Toplam KDV Dahil Fiyatı Koşullu Olarak Göster */}
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
                                {/* Product Selection */}
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label>Product</Form.Label>
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
                                    <Form.Label>Quantity</Form.Label>
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
                                    <Form.Label>Product</Form.Label>
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
                                    <Form.Label>Product</Form.Label>
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

                      {isTaxRateSelectedSurfaces && (
                        <div className="mt-2" style={{ color: "#9f0f0f" }}>
                          <h5>Total des Surfaces: €{totalFeeSurfaces}</h5>
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
                                    <Form.Label>Product</Form.Label>
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
                                    <Form.Label>Quantity</Form.Label>
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
                                            `itemsDivers[${index}].discountedPrice`,
                                            discountedPrice
                                          );
                                          setFieldValue(
                                            `itemsDivers[${index}].vatIncludedPrice`,
                                            calculateVATIncludedPriceAfterDiscount(
                                              discountedPrice,
                                              item.taxRate
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
                                      name={`itemsDivers[${index}].discountRate`}
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
                                          `itemsDivers[${index}].discountRate`,
                                          discountRate
                                        );
                                        setFieldValue(
                                          `itemsDivers[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsDivers[${index}].vatIncludedPrice`,
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
                                      {discountRatesDivers.map((rate) => (
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
                                      name={`itemsDivers[${index}].taxRate`}
                                      className="form-control"
                                      onChange={(e) => {
                                        const taxRate = e.target.value;
                                        setFieldValue(
                                          `itemsDivers[${index}].taxRate`,
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
                                          `itemsDivers[${index}].discountedPrice`,
                                          discountedPrice
                                        );
                                        setFieldValue(
                                          `itemsDivers[${index}].vatIncludedPrice`,
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

            <Form.Group className="mb-3">
              <Form.Label>Code:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
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

export default CreateNewDevisCommande;