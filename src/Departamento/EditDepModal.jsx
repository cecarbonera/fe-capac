import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import apiAxios from "../Services/apiAxios";
import { trackPromise } from "react-promise-tracker";
import { Formik } from "formik";
import * as Yup from "yup";

function EditDepModal(props) {
  //Atualização de Dados
  const handleForm = async (values) => {
    let dados = {
      Codigo: parseInt(values.Codigo),
      Descricao: values.Descricao,
    };

    return await trackPromise(
      apiAxios.put("Departamento/Atualizar", dados).catch((error) => {
        alert(error);
      })
    );
  };

  //******
  //****** OBSERVAÇÂO: QUANDO O YUP NAO FUNCIONAR, DEVE-SE VALIDAR OS CAMPOS, POIS SE ALGUM CAMPO ESTÁ DECLARADO E
  //****** NAO FOR USADO, A APLICACAO NAO FAZ O SUBMIT
  //******
  //Validação Yup
  const camposDepartamento = Yup.object({
    Codigo: Yup.string()
      .required()    
      .min(1, "Código entre 1 e 999")
      .max(3, "Código entre 1 e 999"),
    Descricao: Yup.string()
      .required("Descrição inválida.")
      .max(120, "Informe no máximo 120 caracteres"),
  });

  return (
    <Formik
      validationSchema={camposDepartamento}
      enableReinitialize={true}
      initialValues={{ Codigo: props.Codigo, Descricao: props.Descricao }}
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
                Editar Departamento
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
                        className={
                          touched.Descricao && errors.Descricao ? "error" : null
                        }
                      />
                      {touched.Codigo && errors.Codigo ? (
                        <div className='error-message'>{errors.Codigo}</div>
                      ) : null}
                    </Form.Group>
                    <Form.Group controlId='Descricao'>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        type='text'
                        name='Descricao'
                        defaultValue={values.Descricao}
                        value={values.Descricao}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
              <Button onClick={props.onHide}>Fechar</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </Formik>
  );
}

export default EditDepModal;
