import React from 'react';
import { Formik, Field, FieldArray, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Row, Col, Form as BootstrapForm } from 'react-bootstrap';

const initialValues = {
  products: [
    {
      furnitureName: '',
      listPrice: '',
      salePrice: '',
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
});

const calculateTaxIncludedPrice = (salePrice, taxRate) => {
  if (!salePrice || !taxRate) return ''; // Eğer salePrice veya taxRate boşsa, boş string döndür
  return (parseFloat(salePrice) + (parseFloat(salePrice) * parseFloat(taxRate) / 100)).toFixed(2);
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

export default ProductForm;
