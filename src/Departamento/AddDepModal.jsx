import React from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import apiAxios from "../Services/apiAxios";
import { trackPromise } from "react-promise-tracker";

const AddDepModal = (props) => {
  //Atualização de Dados
  const handleSubmit = async (e) => {
    const dados = {
      Codigo: parseInt(e.target.Codigo.value),
      Descricao: e.target.Descricao.value,
    };

    return await trackPromise(
      apiAxios.post("Departamento/Inserir", dados).catch((error) => {
        alert(error);
      })
    );
  };

  return (
    <div className="container">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Adicionar Departamentos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={6}>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Código</Form.Label>
                  <Form.Control type="text" name="Codigo" requerid />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control type="text" name="Descricao" requerid />
                </Form.Group>
                <Form.Group>
                  <Button variant="primary" type="submit">
                    Gravar
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddDepModal;
