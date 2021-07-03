import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import apiAxios from "../Services/apiAxios";
import { trackPromise } from "react-promise-tracker";
import { Formik } from "formik";
import * as Yup from "yup";

function EditEmpModal(props) {
  const [deps, setdeps] = useState([]);
  const [imagesrc, setImagesrc] = useState("");

  //Consultar os dados no banco
  const ConsultarDepartamento = async () => {
    apiAxios
      .get("Departamento/ListarDeptoEmpr")
      .then((result) => {
        setdeps(result.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  //Atualização dados
  useEffect(() => {
    //Consultar os Departamentos
    ConsultarDepartamento();

    //Setar a imagem padrão
    setImagesrc(
      process.env.REACT_APP_PHOTO_PATH +
        (props.Foto === "" ? "anonimo.jpg" : props.Foto)
    );
  }, [props.Codigo]);

  const handleForm = async (values) => {
    const dados = {
      Codigo: parseInt(values.Codigo),
      Nome: values.Nome,
      CodigoDepto: values.CodigoDepto,
      DataEntrada: values.DataEntrada,
      Foto: imagesrc,
    };

    return await trackPromise(
      apiAxios.put("Empregados/Atualizar", dados).catch((error) => {
        alert(error);
      })
    );
  };

  //Atualizar a imagem em tela
  const handleImagemSelecionada = (e) => {
    const formData = new FormData();

    formData.append("imagem", e.target.files[0]);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    apiAxios
      .post("Empregados/SalvarArquivo", formData, config)
      .then((result) => {
        setImagesrc(process.env.REACT_APP_PHOTO_PATH + result.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  //******
  //****** OBSERVAÇÂO: QUANDO O YUP NAO FUNCIONAR, DEVE-SE VALIDAR OS CAMPOS, POIS SE ALGUM CAMPO ESTÁ DECLARADO E
  //****** NAO FOR USADO, A APLICACAO NAO FAZ O SUBMIT
  //******
  const campos = Yup.object({
    Codigo: Yup.number().required("Codigo inválido.").positive().integer(),
    Nome: Yup.string()
      .max(250, "Informe no máximo 250 caracteres")
      .required("Nome inválido."),
    CodigoDepto: Yup.string().required("Departamento inválido."),
    DataEntrada: Yup.string().required("Data de Entrada inválida."),
    Foto: Yup.string().required("Foto inválida."),
  });

  return (
    <Formik
      initialValues={{
        Codigo: props.Codigo,
        Nome: props.Nome,
        CodigoDepto: props.CodigoDepto,
        DataEntrada: props.DataEntrada,
        Foto: props.Foto,
      }}
      enableReinitialize={true}
      validationSchema={campos}
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
                Editar Empregados
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={6}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='Codigo'>
                      <Form.Label>Código</Form.Label>
                      <Form.Control
                        type='text'
                        name='Codigo'
                        disabled
                        defaultValue={values.Codigo}
                        value={values.Codigo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.Codigo && errors.Codigo ? (
                        <div className='error-message'>{errors.Codigo}</div>
                      ) : null}
                    </Form.Group>
                    <Form.Group controlId='Nome'>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type='text'
                        name='Nome'
                        defaultValue={values.Nome}
                        value={values.Nome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.Nome && errors.Nome ? (
                        <div className='error-message'>{errors.Nome}</div>
                      ) : null}
                    </Form.Group>
                    <Form.Group controlId='CodigoDepto'>
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
                    <Form.Group controlId='DataEntrada'>
                      <Form.Label>Data Entrada</Form.Label>
                      <Form.Control
                        type='date'
                        name='DataEntrada'
                        defaultValue={values.DataEntrada}
                        value={values.DataEntrada}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
}

export default EditEmpModal;
