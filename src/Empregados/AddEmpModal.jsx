import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Form, Image } from "react-bootstrap";
import apiAxios from "../Services/apiAxios";
import { trackPromise } from "react-promise-tracker";

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

  const handleSubmit = async (e) => {
    let _pathArq = imagesrc.substring(imagesrc.lastIndexOf("/") + 1);

    let dados = {
      Codigo: parseInt(e.target.Codigo.value),
      Nome: e.target.Nome.value,
      CodigoDepto: e.target.CodigoDepto.value,
      DataEntrada: e.target.DataEntrada.value,
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

  return (
    <div className="container">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header clooseButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Empregados
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={6}>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="Codigo">
                  <Form.Label>Código</Form.Label>
                  <Form.Control type="text" name="Codigo" requerid />
                </Form.Group>
                <Form.Group controlId="Nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" name="Nome" requerid />
                </Form.Group>
                <Form.Group controlId="CodigoDepto">
                  <Form.Label>Departamento</Form.Label>
                  <Form.Control as="select">
                    {deps.map((dep) => (
                      <option key={dep.Codigo} value={dep.Codigo}>
                        {dep.Descricao}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="DataEntrada">
                  <Form.Label>Data Entrada</Form.Label>
                  <Form.Control type="date" name="DataEntrada" required />
                </Form.Group>
                <Form.Group>
                  <Button variant="primary" type="submit">
                    Gravar
                  </Button>
                </Form.Group>
              </Form>
            </Col>
            <Col sm={6}>
              <Image width="200px" height="200px" src={imagesrc} />
              <input onChange={handleImagemSelecionada} type="File" />
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

export default AddEmpModal;
