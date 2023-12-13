import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, FieldArray, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Button, InputGroup, Dropdown, FormControl } from 'react-bootstrap';
import { AiOutlinePlus, AiTwotoneDelete, AiFillEdit } from 'react-icons/ai';
import './InvoiceForm.css';
import customers from './customers.json';
import accessoires from '../../assets/data/accessoires.json';
import divers from '../../assets/data/divers.json'
import electromenagers from '../../assets/data/electromenagers.json'
import sanitaires from '../../assets/data/sanitaires.json'
import surfaces from '../../assets/data/surfaces.json'

const products = [...accessoires, ...divers, ...electromenagers, ...sanitaires, ...surfaces];
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
        invoiceDate: '', 
        invoiceNumber: '', 
        invoiceType: 'Facture',
    };

  
    

    const handleSubmit = (values, { setSubmitting, isValid, errors }) => {
      console.log("All form values:", values);
      if (isValid) {
          console.log('Form Values:', values);
      } else if (errors && Object.keys(errors).length > 0) {
          console.error('Validation errors:', errors);
      }
      setSubmitting(false);
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
                    customerId: Yup.string().required('Le client est requis'),
                    items: Yup.array().of(
                        Yup.object().shape({
                            productId: Yup.string().required('Le produit est requis'),
                            quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
                            taxRate: Yup.string().required('Obligatoire'),
                        })
                    ),
                    accessoires: Yup.array().of(
                      Yup.object().shape({
                        name: Yup.string().required('Obligatoire'),
                        price: Yup.number().required('Obligatoire'),
                        quantity: Yup.number().min(1, 'La quantité doit être minimum 1').required('La quantité est requise'),
                        taxRate: Yup.string().required('Obligatoire'),
                        })
                    ),
                    invoiceDate: Yup.date().required('La date de facture est requise'),
                    invoiceNumber: Yup.string().required('Le numéro de facture est requis'),
                })}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => {
                  
                  const updateAccessory = (index, updatedValues) => {
  const newAccessoires = [...values.accessoires];
  newAccessoires[index] = { ...newAccessoires[index], ...updatedValues };
  setFieldValue('accessoires', newAccessoires);
};


                //  console.log('Current Form Values:', values); // Add this line
                  return (
                    <FormikForm>

                    {/* New Fields */}
                    <Row className="mb-3">
                            {/* Invoice Date */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Date de facture</Form.Label>
                                    <Field 
                                        name="invoiceDate" 
                                        type="date" 
                                        as={Form.Control} 
                                    />
                                      <ErrorMessage name="invoiceDate" component="div" className="error-message" />
                                </Form.Group>
                            </Col>

                            {/* Invoice Number */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Numéro de facture</Form.Label>
                                    <Field 
                                        name="invoiceNumber" 
                                        as={Form.Control} 
                                        placeholder="Entrez le numéro de facture"
                                    />
                                    <ErrorMessage name="invoiceNumber" component="div" className="error-message" />
                                </Form.Group>
                            </Col>

                            {/* Invoice Type */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Type de facture</Form.Label>
                                    <Field 
                                        name="invoiceType" 
                                        as="select" 
                                        className="form-control"
                                    >
                                        <option value="Facture">Facture</option>
                                        <option value="Note de crédit">Note de crédit</option>
                                        <option value="Annulation de facture">Annulation de facture</option>
                                    </Field>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Customer Selection */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Client</Form.Label>
                                    <SearchableSelect
                                        name="customerId"
                                        data={customers}
                                        setFieldValue={setFieldValue}
                                        value={values.customerId}
                                        placeholder="Sélectionnez un client"
                                    />
                                    <ErrorMessage name="customerId" component="div" className="error-message" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <FieldArray name="accessoires">
  {({ remove, push }) => (
    <>
      {values.accessoires.map((accessoire, index) => (
        <Row key={index} className="mb-3 align-items-center">
          {/* Accessoire Name Input */}
          <Col md={3}>
            <Form.Group>
              <Form.Label>Article</Form.Label>
              <Field 
                name={`accessoires[${index}].name`} 
                as={Form.Control}
                placeholder="Entrez l'article"
                onChange={(e) => {
    updateAccessory(index, { name: e.target.value });
}}
              />
              <ErrorMessage name={`accessoires[${index}].name`} component="div" className="error-message" />
            </Form.Group>
          </Col>

           {/* Unit Price Input */}
           <Col md={2}>
  <Form.Group>
    <Form.Label>Prix ​unitaire</Form.Label>
    <Field 
  type="number" 
  name={`accessoires[${index}].price`} 
  as={Form.Control}
  placeholder="Entrez le prix"
  onChange={(e) => {
    const newPrice = parseFloat(e.target.value) || 0;
    const { quantity = 1, taxRate = 0 } = values.accessoires[index];
    const vatIncludedPrice = calculateVATIncludedPrice(newPrice, taxRate, quantity);
    const subtotal = calculateSubtotal(newPrice, quantity);

    updateAccessory(index, { price: newPrice, vatIncludedPrice, subtotal });
}}


/>
    <ErrorMessage name={`accessoires[${index}].price`} component="div" className="error-message" />
  </Form.Group>
</Col>


       {/* Quantity Input */}
       <Col md={1}>
  <Form.Group>
    <Form.Label>Quantité</Form.Label>
    <InputGroup>
    <Field 
  type="number" 
  name={`accessoires[${index}].quantity`} 
  as={Form.Control}
  value={accessoire.quantity}
  onChange={(e) => {
    const newQuantity = parseInt(e.target.value, 10) || 0;
    const { price = 0, taxRate = 0 } = values.accessoires[index];
    const vatIncludedPrice = calculateVATIncludedPrice(price, taxRate, newQuantity);
    const subtotal = calculateSubtotal(price, newQuantity);

    updateAccessory(index, { quantity: newQuantity, vatIncludedPrice, subtotal });
}}


/>
      <ErrorMessage name={`accessoires[${index}].quantity`} component="div" className="error-message" />
    </InputGroup>
  </Form.Group>
</Col>


{/* Subtotal Price Display */}
<Col md={2}>
  <Form.Group>
    <Form.Label className='parent-text'>SousTotal</Form.Label>
    <p className="price-text">{`${typeof accessoire.subtotal === 'number' ? accessoire.subtotal.toFixed(2) : '0.00'} €`}</p>
  </Form.Group>
</Col>

{/* Tax Rate Selection */}
<Col md={1}>
  <Form.Group>
    <Form.Label>TVA</Form.Label>
    <Field as="select" name={`accessoires[${index}].taxRate`} className="form-control" 
      onChange={(e) => {
        const newTaxRate = parseInt(e.target.value, 10) || 0;
        const { price = 0, quantity = 1 } = values.accessoires[index];
        const vatIncludedPrice = calculateVATIncludedPrice(price, newTaxRate, quantity);

        updateAccessory(index, { taxRate: newTaxRate, vatIncludedPrice });
    }}>
      <option value="">Sélectionnez</option>
      {taxRates.map(rate => (
        <option key={rate} value={rate}>{`${rate}%`}</option>
      ))}
    </Field>
    <ErrorMessage name={`accessoires[${index}].taxRate`} component="div" className="error-message" />
  </Form.Group>
</Col>

{/* Display VAT Included Price */}
<Col md={2}>
  <Form.Group>
    <Form.Label className='parent-text'>TVA incluse</Form.Label>
    <p className="price-text">
      {accessoire.taxRate === '' || accessoire.taxRate === undefined
        ? 'Entrez taxe'
        : `${accessoire.vatIncludedPrice.toFixed(2)}€`}
    </p>
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
      
      <Row className='mb-2'>
      <Col>
      <Button variant="outline-primary" onClick={() => {
          push({ name: '', price: '', quantity: 1, taxRate: '', vatIncludedPrice: 0, subtotal: 0 });
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

                        {/* Product Items */}
                        <FieldArray name="items">
                            {({ remove, push }) => (
                                <>
                                    {values.items.map((item, index) => (
                                        <Row key={index} className="mb-3 align-items-center">
                                            {/* Product Selection */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Produit</Form.Label>
                                                    <SearchableSelect
                                                        name={`items[${index}].productId`}
                                                        data={products}
                                                        setFieldValue={setFieldValue}
                                                        value={item.productId}
                                                        placeholder="Sélectionnez"
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
                                                    <Form.Label>Quantité</Form.Label>
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
                                                    <Form.Label className='parent-text'>Prix ​​unitaire</Form.Label>
                                                    <p className="price-text">{`${item.price}€`}</p>
                                                </Form.Group>
                                            </Col>
                                            {/* Subtotal Price Display */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className='parent-text'>Sous total</Form.Label>
                                                    <p className="price-text">{`${item.subtotal ? item.subtotal.toFixed(2) : '0.00'}€`}</p>
                                                </Form.Group>
                                            </Col>
                                            {/* Tax Rate Selection */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>TVA</Form.Label>
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
                                                    <ErrorMessage name={`items[${index}].taxRate`} component="div" className="error-message" />
                                                </Form.Group>
                                            </Col>
                                            {/* VAT Included Price Display */}
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className='parent-text'>TVA incluse</Form.Label>
                                                    <p className="price-text">
                                                        {item.taxRate ?
                                                            `${item.vatIncludedPrice.toFixed(2)}€` :
                                                            'Entrez taxe'}
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
                                    <Button variant="outline-primary"  onClick={() => {
          push({ productId: '', quantity: 1, price: 0, taxRate: '', vatIncludedPrice: 0, subtotal: 0 });
       //   console.log('Added new product item', values);
        }}
      >
        <AiOutlinePlus /> Ajouter un produit
      </Button>
                                </>
                            )}
                        </FieldArray>

                      

{/* Submit Button */}
<div className="mt-4">
  <Button type="submit" variant="success">Créer la facture</Button>
</div>
          </FormikForm>
          );
                }}
      </Formik>
    </Container>
  );
};
export default InvoiceCreationForm;
