import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../Services/authservice";
import { Formik } from "formik";
import * as Yup from "yup";

//******
//****** OBSERVAÇÂO: QUANDO O YUP NAO FUNCIONAR, DEVE-SE VALIDAR OS CAMPOS, POIS SE ALGUM CAMPO ESTÁ DECLARADO E
//****** NAO FOR USADO, A APLICACAO NAO FAZ O SUBMIT
//******
//Validação Yup
const camposRegister = Yup.object({
  username: Yup.string().required("Usuário obrigatório."),
  password: Yup.string().required("Senha inválida."),
  regra: Yup.string().required(),
  email: Yup.string().email("E-mail inválido.").required("E-mail obrigatório."),
});

const Register = () => {
  const form = useRef();
  const checkBtn = useRef();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = (values) => {

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.Register(values.username, values.password, values.regra, values.email).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <Formik
      validationSchema={camposRegister}
      enableReinitialize={true}
      initialValues={{ username: "", password: "", regra: "", email: "" }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        //Chamada método p/ Gravação dados
        handleRegister(values);

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
              {!successful && (
                <div>
                  <div className='form-group'>
                    <label htmlFor='username'>Username</label>
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
                    <label htmlFor='email'>E-mail</label>
                    <Input
                      type='text'
                      className='form-control'
                      name='email'
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.email && errors.email ? "error" : null}
                    />
                    {touched.email && errors.email ? (
                      <div className='error-message'>{errors.email}</div>
                    ) : null}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='regra'>Tipo Usuário</label>
                    <select
                      class='form-control'
                      name='regra'
                      value={values.regra}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value='D' selected>
                        Diretor
                      </option>
                      <option value='G'>Gerente</option>
                      <option value='F'>Funcionário</option>
                      <option value='E'>Estagiário</option>
                    </select>
                  </div>
                  <div className='form-group'>
                    <button className='btn btn-primary btn-block'>Login</button>
                  </div>
                </div>
              )}
              {message && (
                <div className='form-group'>
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role='alert'
                  >
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

export default Register;
