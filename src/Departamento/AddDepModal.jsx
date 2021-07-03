import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import apiAxios from "../Services/apiAxios";
import { trackPromise } from "react-promise-tracker";
import { Formik } from "formik";
import * as Yup from "yup";

const AddDepModal = (props) => {
  //Atualização de Dados
  const handleForm = async (values) => {
    const dados = {
      Codigo: parseInt(values.Codigo),
      Descricao: values.Descricao,
    };

    return await trackPromise(
      apiAxios.post("Departamento/Inserir", dados).catch((error) => {
        alert(error);
      })
    );
  };

  //****** 
  //****** OBSERVAÇÂO: QUANDO O YUP NAO FUNCIONAR, DEVE-SE VALIDAR OS CAMPOS, POIS SE ALGUM CAMPO ESTÁ DECLARADO E 
  //****** NAO FOR USADO, A APLICACAO NAO FAZ O SUBMIT
  //******   
  const camposDepartamento = Yup.object({
    Codigo: Yup.number().required("Código inválido.").positive().integer(),
    Descricao: Yup.string()
      .required("Descrição inválida.")
      .max(120, "Informe no máximo 120 caracteres"),
  });

  return (
    <Formik
      initialValues={{ Codigo: null, Descricao: "" }}
      validationSchema={camposDepartamento}
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
                Departamentos
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
                      <label htmlFor='Descricao'>Descrição</label>
                      <Form.Control
                        type='text'
                        name='Descricao'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.Descricao}
                        className={
                          touched.Descricao && errors.Descricao ? "error" : null
                        }
                      />
                      {touched.Descricao && errors.Descricao ? (
                        <div className='error-message'>{errors.Descricao}</div>
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

export default AddDepModal;
