import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Alert, Button } from "antd";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register } from "../slices/auth";
import { clearMessage } from "../slices/message";

const Register = () => {
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val) =>
          val && val.toString().length >= 6 && val.toString().length <= 40
      )
      .required("This field is required!"),
  });

  const handleRegister = (formValue) => {
    const { email, password } = formValue;

    setSuccessful(false);

    dispatch(register({ email, password }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card title="Register" headStyle={{ textAlign: "center" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div className="flex items-center flex-col">
                <div className="h-20">
                  <label className="block" htmlFor="email">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="border border-black rounded"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-700"
                  />
                </div>
                <div className="h-20 flex flex-col items-center">
                  <div>
                    <label className="block" htmlFor="password">
                      Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className="border border-black rounded"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-700"
                  />
                </div>
                <Button type="primary" ghost htmlType="submit">
                  Register
                </Button>
              </div>
            )}
          </Form>
        </Formik>
        {message && (
          <Alert
            message={message}
            type={successful ? "success" : "error"}
            className="mt-10"
          />
        )}
      </Card>
    </div>
  );
};

export default Register;
