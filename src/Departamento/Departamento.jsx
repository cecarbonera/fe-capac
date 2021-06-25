import React, { useState, useEffect } from "react";
import { Table, Button, ButtonToolbar } from "react-bootstrap";
import AddDepModal from "./AddDepModal";
import EditDepModal from "./EditDepModal";
import apiAxios from "../Services/apiAxios";

const Departamento = () => {
  const [deps, setDeps] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalAddShow, setModalAddShow] = useState(false);
  const [dados, setDados] = useState({ codigo: 0, descricao: "" });

  //Consultar Departamentos
  const Consultar = async () => {
    apiAxios
      .get("Departamento/Listar")
      .then((result) => {
        setDeps(result.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  function setarValores(linha) {
    setModalShow(true);
    setDados({ codigo: linha.Codigo, descricao: linha.Descricao });
  }

  //Leitura/Atualização dos dados
  useEffect(() => {
    Consultar();
  }, []);

  const ExcluirDepartamento = (depid) => {
    if (window.confirm("Deseja excluir o departamento " + depid + " ?")) {
      apiAxios.delete("Departamento/Excluir/" + depid).catch((error) => {
        alert(error);
      });
    }
  };

  return (
    <div>
      <Table className="mt-4" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Departamento</th>
            <th>Descrição</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {deps.map((dep) => (
            <tr key={dep.Codigo}>
              <td>{dep.Codigo}</td>
              <td>{dep.Descricao}</td>
              <td>
                <ButtonToolbar>
                  <Button
                    className="mr-2"
                    variant="info"
                    onClick={() => setarValores(dep)}
                  >
                    Editar
                  </Button>
                  <Button
                    className="mr-2"
                    variant="danger"
                    onClick={() => ExcluirDepartamento(dep.Codigo)}
                  >
                    Excluir
                  </Button>
                  <EditDepModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    Codigo={dados.codigo}
                    Descricao={dados.descricao}
                  />
                </ButtonToolbar>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ButtonToolbar>
        <Button variant="primary" onClick={() => setModalAddShow(true)}>
          Novo Departamento
        </Button>
        <AddDepModal
          show={modalAddShow}
          onHide={() => setModalAddShow(false)}
        />
      </ButtonToolbar>
    </div>
  );
};

export default Departamento;
