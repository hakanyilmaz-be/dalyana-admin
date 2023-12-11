import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Button, InputGroup, Dropdown, FormControl } from 'react-bootstrap';
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai';
import './InvoiceForm.css';
import customers from './customers.json';
import products from './products.json';
import accessoires from './accessoires.json';

const taxRates = [0, 6, 10, 20, 21];

const SearchableSelect = ({ name, data, setFieldValue, value, placeholder, isProduct, index, setPrice, values, calculateVATIncludedPrice, calculateSubtotal }) => {
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
                          const currentQuantity = values.items[index].quantity || 1;
                          const selectedProduct = products.find(p => p.id === item.id);
                          const price = selectedProduct ? selectedProduct.price : 0;
                          setPrice(index, price, currentQuantity);
                          setFieldValue(`items[${index}].vatIncludedPrice`, calculateVATIncludedPrice(price, values.items[index].taxRate, currentQuantity));
                          setFieldValue(`items[${index}].subtotal`, calculateSubtotal(price, currentQuantity));
                      } else {
                          // Handle accessory logic
                          const selectedAccessoire = accessoires.find(a => a.id === item.id);
                          if (selectedAccessoire) {
                            const price = parseFloat(selectedAccessoire.price);
                              const currentQuantity = values.accessoires[index].quantity || 1;
    
                              setFieldValue(`accessoires[${index}].price`, price);
                              setFieldValue(`accessoires[${index}].vatIncludedPrice`, calculateVATIncludedPrice(price, values.accessoires[index].taxRate, currentQuantity));
                              setFieldValue(`accessoires[${index}].subtotal`, calculateSubtotal(price, currentQuantity));
                          }
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

const InvoiceCreationForm = () => {
    const initialValues = {
        customerId: '',
        items: [],
        accessoires: [],
    };

    const handleSubmit = (values) => {
        console.log('Form Values:', values);
    };

    const calculateVATIncludedPrice = (price, taxRate, quantity) => {
        return price * quantity * (1 + taxRate / 100);
    };

    const calculateSubtotal = (price, quantity) => {
        return price * quantity;
    };

    return (
        <Container className="invoice-form-container">
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    customerId: Yup.string().required('Customer is required'),
                    items: Yup.array().of(
                        Yup.object().shape({
                            productId: Yup.string().required('Product is required'),
                            quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
                            taxRate: Yup.string().required('Tax rate is required'),
                        })
                    ),
                    accessoires: Yup.array().of(
                        Yup.object().shape({
                            accessoryId: Yup.string().required('Accessory is required'),
                            quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
                            // Additional validations for accessories
                        })
                    ),
                })}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        {/* Customer Selection */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Customer</Form.Label>
                                    <SearchableSelect
                                        name="customerId"
                                        data={customers}
                                        setFieldValue={setFieldValue}
                                        value={values.customerId}
                                        placeholder="Select Customer"
                                    />
                                    <ErrorMessage name="customerId" component="div" className="error-message" />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Product Items */}
                        <FieldArray name="items">
                            {({ remove, push }) => (
                                <>
                                    {values.items.map((item, index) => (
                                        <Row key={index} className="mb-3 align-items-center">
                                            {/* Product Selection */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Product</Form.Label>
                                                    <SearchableSelect
                                                        name={`items[${index}].productId`}
                                                        data={products}
                                                        setFieldValue={setFieldValue}
                                                        value={item.productId}
                                                        placeholder="Select Product"
                                                        isProduct={true}
                                                        index={index}
                                                        setPrice={(idx, price, quantity) => {
                                                            setFieldValue(`items[${idx}].price`, price);
                                                            setFieldValue(`items[${idx}].vatIncludedPrice`, calculateVATIncludedPrice(price, item.taxRate, quantity));
                                                            setFieldValue(`items[${idx}].subtotal`, calculateSubtotal(price, quantity));
                                                        }}
                                                        values={values}
                                                        calculateVATIncludedPrice={calculateVATIncludedPrice}
                                                        calculateSubtotal={calculateSubtotal}
                                                    />
                                                    <ErrorMessage name={`items[${index}].productId`} component="div" className="error-message" />
                                                </Form.Group>
                                            </Col>
                                            {/* Quantity Input */}
                                            <Col md={1}>
                                                <Form.Group>
                                                    <Form.Label>Quantity</Form.Label>
                                                    <InputGroup>
                                                        <Field
                                                            type="number"
                                                            name={`items[${index}].quantity`}
                                                            as={Form.Control}
                                                            onChange={(e) => {
                                                                const quantity = e.target.value;
                                                                setFieldValue(`items[${index}].quantity`, quantity);
                                                                setFieldValue(`items[${index}].vatIncludedPrice`, calculateVATIncludedPrice(item.price, item.taxRate, quantity));
                                                                setFieldValue(`items[${index}].subtotal`, calculateSubtotal(item.price, quantity));
                                                            }}
                                                        />
                                                        <ErrorMessage name={`items[${index}].quantity`} component="div" className="error-message" />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            {/* Price Display */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className='parent-text'>Unit Price</Form.Label>
                                                    <p className="price-text">{`${item.price}€`}</p>
                                                </Form.Group>
                                            </Col>
                                            {/* Subtotal Price Display */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className='parent-text'>Subtotal</Form.Label>
                                                    <p className="price-text">{`${item.subtotal ? item.subtotal.toFixed(2) : '0.00'}€`}</p>
                                                </Form.Group>
                                            </Col>
                                            {/* Tax Rate Selection */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Tax Rate</Form.Label>
                                                    <Field as="select" name={`items[${index}].taxRate`} className="form-control" onChange={(e) => {
                                                        const taxRate = e.target.value;
                                                        setFieldValue(`items[${index}].taxRate`, taxRate);
                                                        setFieldValue(`items[${index}].vatIncludedPrice`, calculateVATIncludedPrice(item.price, taxRate, item.quantity));
                                                        setFieldValue(`items[${index}].subtotal`, calculateSubtotal(item.price, item.quantity));
                                                    }}>
                                                        <option value="">Select Tax Rate</option>
                                                        {taxRates.map(rate => (
                                                            <option key={rate} value={rate}>{`${rate}%`}</option>
                                                        ))}
                                                    </Field>
                                                </Form.Group>
                                            </Col>
                                            {/* VAT Included Price Display */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className='parent-text'>VAT Included</Form.Label>
                                                    <p className="price-text">
                                                        {item.taxRate ?
                                                            `${item.vatIncludedPrice.toFixed(2)}€` :
                                                            'Select tax'}
                                                    </p>
                                                </Form.Group>
                                            </Col>
                                            {/* Remove Item Button */}
                                            <Col xs="auto">
                                                <Button variant="outline-danger" onClick={() => remove(index)}>
                                                    <AiTwotoneDelete />
                                                </Button>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button variant="outline-primary" onClick={() => push({ productId: '', quantity: 1, price: 0, taxRate: '', vatIncludedPrice: 0, subtotal: 0 })}>
                                        <AiOutlinePlus /> Add Product
                                    </Button>
                                </>
                            )}
                        </FieldArray>

                        <FieldArray name="accessoires">
  {({ remove, push }) => (
    <>
      {values.accessoires.map((accessoire, index) => (
        <Row key={index} className="mb-3 align-items-center">
          {/* Accessoire Selection */}
          <Col md={2}>
            <Form.Group>
              <Form.Label>Accessoire</Form.Label>
              <SearchableSelect
                name={`accessoires[${index}].accessoireId`}
                data={accessoires}
                setFieldValue={setFieldValue}
                value={accessoire.accessoireId}
                placeholder="Select Accessoire"
                isProduct={false}
                index={index}
                setPrice={(idx, price, quantity) => {
                  setFieldValue(`accessoires[${idx}].price`, price);
                  setFieldValue(`accessoires[${idx}].vatIncludedPrice`, calculateVATIncludedPrice(price, accessoire.taxRate, quantity));
                  setFieldValue(`accessoires[${idx}].subtotal`, calculateSubtotal(price, quantity));
                }}
                values={values}
                calculateVATIncludedPrice={calculateVATIncludedPrice}
                calculateSubtotal={calculateSubtotal}
              />
              <ErrorMessage name={`accessoires[${index}].accessoireId`} component="div" className="error-message" />
            </Form.Group>
          </Col>

       {/* Quantity Input */}
<Col md={1}>
  <Form.Group>
    <Form.Label>Quantity</Form.Label>
    <InputGroup>
      <Field 
        type="number" 
        name={`accessoires[${index}].quantity`} 
        as={Form.Control}
        value={accessoire.quantity}
        onChange={(e) => {
          const newQuantity = e.target.value;
          setFieldValue(`accessoires[${index}].quantity`, newQuantity);
          setFieldValue(`accessoires[${index}].vatIncludedPrice`, calculateVATIncludedPrice(accessoire.price, accessoire.taxRate, newQuantity));
          setFieldValue(`accessoires[${index}].subtotal`, calculateSubtotal(accessoire.price, newQuantity));
        }} 
      />
      <ErrorMessage name={`accessoires[${index}].quantity`} component="div" className="error-message" />
    </InputGroup>
  </Form.Group>
</Col>

         {/* Unit Price Display */}
<Col md={2}>
  <Form.Group>
    <Form.Label>Unit Price</Form.Label>
    <p className="price-text">{`${typeof accessoire.price === 'number' ? accessoire.price.toFixed(2) : '0.00'} €`}</p>
  </Form.Group>
</Col>

{/* Subtotal Price Display */}
<Col md={2}>
  <Form.Group>
    <Form.Label>Subtotal</Form.Label>
    <p className="price-text">{`${typeof accessoire.subtotal === 'number' ? accessoire.subtotal.toFixed(2) : '0.00'} €`}</p>
  </Form.Group>
</Col>

{/* Tax Rate Selection */}
<Col md={2}>
  <Form.Group>
    <Form.Label>Tax Rate</Form.Label>
    <Field as="select" name={`accessoires[${index}].taxRate`} className="form-control" onChange={(e) => {
      const newTaxRate = e.target.value;
      setFieldValue(`accessoires[${index}].taxRate`, newTaxRate);
      setFieldValue(`accessoires[${index}].vatIncludedPrice`, calculateVATIncludedPrice(accessoire.price, newTaxRate, accessoire.quantity));
    }}>
      <option value="">Select Tax Rate</option>
      {taxRates.map(rate => (
        <option key={rate} value={rate}>{`${rate}%`}</option>
      ))}
    </Field>
  </Form.Group>
</Col>
{/* VAT Included Price Display */}
<Col md={2}>
  <Form.Group>
    <Form.Label>VAT Included</Form.Label>
    <p className="price-text">{accessoire.taxRate ?`${accessoire.vatIncludedPrice.toFixed(2)}€` :'Select tax'}</p>
   
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
      <Button variant="outline-primary" onClick={() => push({ accessoireId: '', quantity: 1, price: 0, taxRate: '', vatIncludedPrice: 0, subtotal: 0 })}>
        <AiOutlinePlus /> Add Accessoire
      </Button>
    </>
  )}
</FieldArray>


{/* Submit Button */}
<div className="mt-4">
  <Button type="submit" variant="primary">Create Invoice</Button>
</div>


          </Form>
        )}
      </Formik>
    </Container>
  );
};
export default InvoiceCreationForm;
