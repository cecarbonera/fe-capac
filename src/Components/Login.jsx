import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../Services/authservice";
import { Formik } from "formik";
import * as Yup from "yup";

const Login = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //******
  //****** OBSERVAÇÂO: QUANDO O YUP NAO FUNCIONAR, DEVE-SE VALIDAR OS CAMPOS, POIS SE ALGUM CAMPO ESTÁ DECLARADO E
  //****** NAO FOR USADO, A APLICACAO NAO FAZ O SUBMIT
  //******
  //Validação Yup
  const camposLogin = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
  });

  const handleLogin = (values) => {
    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.Login(values.username, values.password).then(
        () => {
          props.history.push("/profile");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <Formik
      validationSchema={camposLogin}
      enableReinitialize={true}
      initialValues={{ username: "", password: "" }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        //Chamada método p/ Gravação dados
        handleLogin(values);

        setTimeout(() => {
          resetForm();
          setSubmitting(false);
        }, 500);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <div className='col-md-12'>
          <div className='card card-container'>
            <img
              src='//ssl.gstatic.com/accounts/ui/avatar_2x.png'
              alt='profile-img'
              className='profile-img-card'
            />
            <Form onSubmit={handleSubmit} ref={form}>
              <div className='form-group'>
                <label htmlFor='username'>Usuário</label>
                <Input
                  type='text'
                  className='form-control'
                  name='username'
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    touched.username && errors.username ? "error" : null
                  }
                />
                {touched.username && errors.username ? (
                  <div className='error-message'>{errors.username}</div>
                ) : null}
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Senha</label>
                <Input
                  type='password'
                  className='form-control'
                  name='password'
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    touched.password && errors.password ? "error" : null
                  }
                />
                {touched.password && errors.password ? (
                  <div className='error-message'>{errors.password}</div>
                ) : null}
              </div>
              <div className='form-group'>
                <button
                  className='btn btn-primary btn-block'
                  disabled={loading}
                >
                  {loading && (
                    <span className='spinner-border spinner-border-sm'></span>
                  )}
                  <span>Login</span>
                </button>
              </div>
              {message && (
                <div className='form-group'>
                  <div className='alert alert-danger' role='alert'>
                    {message}
                  </div>
                </div>
              )}
              <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Login;