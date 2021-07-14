import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import apiAxios from "../Services/apiAxios";
import { trackPromise } from "react-promise-tracker";
import { Formik } from "formik";
import * as Yup from "yup";

const AddEmpModal = (props) => {
  const [deps, setDeps] = useState([]);
  const fotoPadrao = "anonimo.jpg";
  const [imagesrc, setImagesrc] = useState(
    process.env.REACT_APP_PHOTO_PATH + fotoPadrao
  );

  //Consultar os departamentos
  const ConsultarDepartamento = async () => {
    apiAxios
      .get("Departamento/ListarDeptoEmpr")
      .then((result) => {
        setDeps(result.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  //Leitura dados
  useEffect(() => {
    ConsultarDepartamento();
  }, [props.Codigo]);

  const handleForm = async (values) => {
    let _pathArq = imagesrc.substring(imagesrc.lastIndexOf("/") + 1);

    let dados = {
      Codigo: parseInt(values.Codigo),
      Nome: values.Nome,
      CodigoDepto: values.CodigoDepto,
      DataEntrada: values.DataEntrada,
      Foto: _pathArq,
    };

    return await trackPromise(
      apiAxios.post("Empregados/Inserir", dados).catch((error) => {
        alert(error);
      })
    );
  };

  const handleImagemSelecionada = async (e) => {
    const formData = new FormData();
    formData.append("imagem", e.target.files[0]);
    const config = { headers: { "content-type": "multipart/form-data" } };

    return await trackPromise(
      apiAxios
        .post("Empregados/SalvarArquivo", formData, config)
        .then((result) => {
          setImagesrc(process.env.REACT_APP_PHOTO_PATH + result.data);
        })
        .catch((error) => {
          alert(error);
        })
    );
  };

  //******
  //****** OBSERVAÇÂO: QUANDO O YUP NAO FUNCIONAR, DEVE-SE VALIDAR OS CAMPOS, POIS SE ALGUM CAMPO ESTÁ DECLARADO E
  //****** NAO FOR USADO, A APLICACAO NAO FAZ O SUBMIT
  //******
  const camposEmpregados = Yup.object({
    Codigo: Yup.number().required().positive().integer(),
    Nome: Yup.string().max(250, "Informe no máximo 250 caracteres").required(),
    DataEntrada: Yup.string().required(),
    CodigoDepto: Yup.string().required("Departamento inválido."),
  });

  return (
    <Formik
      initialValues={{
        Codigo: null,
        Nome: "",
        DataEntrada: "",
        CodigoDepto: "",
      }}
      validationSchema={camposEmpregados}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        //Chamada método p/ Gravação dados
        handleForm(values);

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
        isSubmitting,
      }) => (
        <div className='container'>
          <Modal
            {...props}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id='contained-modal-title-vcenter'>
                Empregados
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={6}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group>
                      <Form.Label>Código</Form.Label>
                      <Form.Control
                        type='text'
                        name='Codigo'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.Codigo}
                        className={
                          touched.Codigo && errors.Codigo ? "error" : null
                        }
                      />
                      {touched.Codigo && errors.Codigo ? (
                        <div className='error-message'>{errors.Codigo}</div>
                      ) : null}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type='text'
                        name='Nome'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.Nome}
                        className={touched.Nome && errors.Nome ? "error" : null}
                      />
                      {touched.Nome && errors.Nome ? (
                        <div className='error-message'>{errors.Nome}</div>
                      ) : null}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Departamento</Form.Label>
                      <select
                        name='CodigoDepto'
                        value={values.CodigoDepto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: "block" }}
                      >
                        {deps.map((dep) => (
                          <option key={dep.Codigo} value={dep.Codigo}>
                            {dep.Descricao}
                          </option>
                        ))}
                      </select>
                      {touched.CodigoDepto && errors.CodigoDepto ? (
                        <div className='error-message'>
                          {errors.CodigoDepto}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Data Entrada</Form.Label>
                      <Form.Control
                        type='date'
                        name='DataEntrada'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.DataEntrada}
                        className={
                          touched.DataEntrada && errors.DataEntrada
                            ? "error"
                            : null
                        }
                      />
                      {touched.DataEntrada && errors.DataEntrada ? (
                        <div className='error-message'>
                          {errors.DataEntrada}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group>
                      <Button
                        variant='primary'
                        type='submit'
                        disabled={isSubmitting}
                      >
                        Gravar
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
                <Col sm={6}>
                  <Image width='200px' height='200px' src={imagesrc} />
                  <input onChange={handleImagemSelecionada} type='File' />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={props.onHide}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </Formik>
  );
};

export default AddEmpModal;
