import React, { useState } from "react";
import "./components/create-new-devis-commande/create-new-devis-commande.css";
import { Formik, Field, FieldArray, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Row, Col, Form as BootstrapForm, Card, InputGroup, Dropdown, FormControl, Accordion } from 'react-bootstrap';
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai';
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


const Kodtestiekleniyordeneniyor = () => {


  const initialValues = {
    products: [
      {
        furnitureName: '',
        listPrice: '',
        salePrice: '',
        taxRate: '',
      },
    ],
    itemsAccessoires: [],
  };
  
  const validationSchema = Yup.object().shape({
    products: Yup.array().of(
      Yup.object().shape({
        furnitureName: Yup.string().required('Furniture name is required'),
        listPrice: Yup.number().required('List price is required').positive('List price must be positive'),
        salePrice: Yup.number().required('Sale price is required').positive('Sale price must be positive'),
        taxRate: Yup.string().required('Tax rate is required'),
      })
    ),
    itemsAccessoires: Yup.array().of(
      Yup.object().shape({
          productId: Yup.string().required('Le produit est requis'),
          quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
          taxRate: Yup.string().required('Obligatoire'),
      })
  ),  
  });
  
  const calculateTaxIncludedPrice = (salePrice, taxRate) => {
    if (!salePrice || !taxRate) return ''; // Eğer salePrice veya taxRate boşsa, boş string döndür
    return (parseFloat(salePrice) + (parseFloat(salePrice) * parseFloat(taxRate) / 100)).toFixed(2);
  };


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
      {({ values }) => (
        <Form>
          <FieldArray name="products">
            {({ push, remove }) => (
              <>
                {values.products.map((product, index) => (
                  <Row key={index} className="mb-3">
                    <Col>
                      <Field name={`products[${index}].furnitureName`} as={BootstrapForm.Control} placeholder="Furniture Name" />
                      <ErrorMessage name={`products[${index}].furnitureName`} component="div" className="text-danger" />
                    </Col>
                    <Col>
                      <Field name={`products[${index}].listPrice`} as={BootstrapForm.Control} placeholder="List Price" type="number" />
                      <ErrorMessage name={`products[${index}].listPrice`} component="div" className="text-danger" />
                    </Col>
                    <Col>
                      <Field name={`products[${index}].salePrice`} as={BootstrapForm.Control} placeholder="Sale Price" type="number" />
                      <ErrorMessage name={`products[${index}].salePrice`} component="div" className="text-danger" />
                    </Col>
                    <Col>
                      <Field as={BootstrapForm.Select} name={`products[${index}].taxRate`}>
                        <option value="">Select</option>
                        <option value="0">0%</option>
                        <option value="6">6%</option>
                        <option value="10">10%</option>
                        <option value="20">20%</option>
                        <option value="21">21%</option>
                      </Field>
                      <ErrorMessage name={`products[${index}].taxRate`} component="div" className="text-danger" />
                    </Col>
                    <Col>
                      <BootstrapForm.Control
                        readOnly
                        value={calculateTaxIncludedPrice(product.salePrice, product.taxRate)}
                        placeholder="TAX Included Price"
                      />
                    </Col>
                    <Col>
                      <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="primary" onClick={() => push({ furnitureName: '', listPrice: '', salePrice: '', taxRate: '' })}>
                  Add Product
                </Button>
              </>
            )}
          </FieldArray>
          <div className="mt-3">
            Total Price: $
            {values.products.reduce((acc, curr) => acc + (curr.salePrice && curr.taxRate ? parseFloat(curr.salePrice) + (parseFloat(curr.salePrice) * parseFloat(curr.taxRate) / 100) : 0), 0).toFixed(2) || ''}
          </div>
          <Button type="submit" className="mt-3">Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default Kodtestiekleniyordeneniyor;
