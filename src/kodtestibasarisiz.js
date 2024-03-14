import React, { useState } from 'react';
import { Formik, Field, FieldArray, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Row, Col, Form as BootstrapForm } from 'react-bootstrap';
import accessoriesData from "./assets/data/accessoires.json"
import machines from "./assets/data/electromenagers.json"


const initialValues = {
  products: [
    {
      furnitureName: '',
      listPrice: '',
      salePrice: '',
      taxRate: '',
    },
  ],
  accessories: [
    {
      productName: '',
      unitPrice: 0,
      quantity: '',
      taxRate: '',
    },
  ],
  machines: [
    {
      productName: '',
      unitPrice: 0,
      quantity: '',
      taxRate: '',
    },
  ],
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
    accessories: Yup.array().of(
      Yup.object().shape({
        productName: Yup.string().required('Product name is required'),
        quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive').integer('Quantity must be an integer'),
        taxRate: Yup.string().required('Tax rate is required'),
      })
    ),
    machines: Yup.array().of(
      Yup.object().shape({
        productName: Yup.string().required('Product name is required'),
        quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive').integer('Quantity must be an integer'),
        taxRate: Yup.string().required('Tax rate is required'),
      })
    ),
  });
  

  const calculateVATIncludedPrice = (unitPrice, quantity, taxRate) => {
    if (!unitPrice || !quantity || !taxRate) return ''; // Eğer birim fiyatı, miktarı veya vergi oranı boşsa, boş string döndür
    const totalSalePrice = parseFloat(unitPrice) * parseInt(quantity);
    return (totalSalePrice + (totalSalePrice * parseFloat(taxRate) / 100)).toFixed(2);
  };
  

const ProductForm = () => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, setFieldValue }) => (
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
                        value={calculateVATIncludedPrice(product.salePrice, product.taxRate)}
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

{/* Accessories Bölümü */}
<h2>Accessories</h2>
        <FieldArray name="accessories">
          {({ push, remove }) => (
            <>
              {values.accessories.map((accessory, index) => (
                <Row key={index} className="mb-3">
                  <Col>
                    <Field as="select" name={`accessories[${index}].productName`} onChange={e => {
                      const selectedProduct = accessoriesData.find(product => product.productName === e.target.value);
                      setFieldValue(`accessories[${index}].unitPrice`, selectedProduct ? selectedProduct.unitPrice : 0);
                      setFieldValue(e.target.name, e.target.value);
                    }}>
                      <option value="">Select</option>
                      {accessoriesData.map(acc => (
                        <option key={acc.productName} value={acc.productName}>{acc.productName}</option>
                      ))}
                    </Field>
                  </Col>
                  <Col>
                    <Field name={`accessories[${index}].quantity`} placeholder="Quantity" type="number" />
                    <ErrorMessage name={`accessories[${index}].quantity`} component="div" className="text-danger" />
                  </Col>
                  <Col>
                    <Field as={BootstrapForm.Select} name={`accessories[${index}].taxRate`}>
                      {/* Tax Rate Seçenekleri */}
                    </Field>
                  </Col>
                  <Col>
                    <BootstrapForm.Control
                      readOnly
                      value={calculateVATIncludedPrice(values.accessories[index].unitPrice, values.accessories[index].quantity, values.accessories[index].taxRate)}
                      placeholder="VAT Included Price"
                    />
                  </Col>
                  <Col>
                    <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={() => push({ productName: '', unitPrice: 0, quantity: '', taxRate: '' })}>
                Add Accessory
              </Button>
            </>
          )}
        </FieldArray>






          <Button type="submit" className="mt-3">Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
