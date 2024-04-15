import React, { useEffect, useState } from "react";
import "./create-new-devis-commande.css";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { Form, Button } from "react-bootstrap";

const Uygulama2 = () => {

  const initialValues = {
    deliveryFee: "",
    montageFee: "",
    totalFee: "",
    grandTotal: "",
  };

  const validationSchema = Yup.object({
    deliveryFee: Yup.string(),
    montageFee: Yup.string(),
    totalFee: Yup.string(),
    grandTotal: Yup.number(),
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

  const calculateGrandTotal = (deliveryFee, montageFee) => {
    const delivery = parseFloat(deliveryFee || 0);
    const montage = parseFloat(montageFee || 0);
    return (delivery + montage).toFixed(2);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        
        const updateFees = (fieldName, value) => {
          setFieldValue(fieldName, value);
          const grandTotal = calculateGrandTotal(
            fieldName === "deliveryFee" ? value : values.deliveryFee,
            fieldName === "montageFee" ? value : values.montageFee
          );
          setFieldValue("grandTotal", grandTotal);
        };

        return (
          <Form noValidate onSubmit={handleSubmit}>

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
                onChange={(e) => updateFees("deliveryFee", e.target.value)}
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
                onChange={(e) => updateFees("montageFee", e.target.value)}
                isInvalid={!!formik.errors.montageFee}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.montageFee}
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

              <Form.Control
                type="text"
                style={{
                  color: "#9f0f0f",
                  borderColor: "#9f0f0f",
                  width: "170px",
                }}
                placeholder="Total TVAC"
                value={`${values.grandTotal}€`}
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
export default Uygulama2;