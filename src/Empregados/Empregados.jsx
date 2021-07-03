import React, { useState, useEffect } from "react";
import { Table, Button, ButtonToolbar } from "react-bootstrap";
import AddEmpModal from "./AddEmpModal";
import EditEmpModal from "./EditEmpModal";
import apiAxios from "../Services/apiAxios";

const Empregados = () => {
  const [emps, setEmps] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalAddShow, setModalAddShow] = useState(false);
  const [dados, setDados] = useState({
    codigo: 0,
    nome: "",
    codigoDepto: 0,
    dataEntrada: null,
    foto: "",
  });

  //Consultar Empregados
  const Consultar = async () => {
    apiAxios
      .get("Empregados/Listar")
      .then((result) => {
        setEmps(result.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  function setarValores(linha) {
    setModalShow(true);
    setDados({
      codigo: linha.Codigo,
      nome: linha.Nome,
      codigoDepto: linha.CodigoDepto.split("-")[0].trim(),
      dataEntrada: linha.DataEntrada,
      foto: linha.Foto,
    });
  }

  //Leitura/Atualização dados
  useEffect(() => {
    Consultar();
  }, [emps]);

  //Arrow function
  const ExcluirEmpregado = (empid) => {
    if (window.confirm("Deseja excluir o empregado "+ empid+ " ?")) {
      apiAxios.delete("Empregados/Excluir/" + empid).catch((error) => {
        alert(error);
      });

      //Atualizar a base dados
      Consultar();
      
    }
  };

  return (
    <div>
      <Table className="mt-4" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Nome</th>
            <th>Departamento</th>
            <th>Data Entrada</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {emps.map((emp) => (
            <tr key={emp.Codigo}>
              <td>{emp.Codigo}</td>
              <td>{emp.Nome}</td>
              <td>{emp.CodigoDepto}</td>
              <td>{new Date(emp.DataEntrada).toLocaleDateString()}</td>
              <td>
                <ButtonToolbar>
                  <Button
                    className="mr-2"
                    variant="info"
                    onClick={() => setarValores(emp)}
                  >
                    Editar
                  </Button>
                  <Button
                    className="mr-2"
                    variant="danger"
                    onClick={() => ExcluirEmpregado(emp.Codigo)}
                  >
                    Excluir
                  </Button>
                  <EditEmpModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    Codigo={dados.codigo}
                    Nome={dados.nome}
                    CodigoDepto={dados.codigoDepto}
                    DataEntrada={dados.dataEntrada}
                    Foto={dados.foto}
                  />
                </ButtonToolbar>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ButtonToolbar>
        <Button variant="primary" onClick={() => setModalAddShow(true)}>
          Novo Empregado
        </Button>
        <AddEmpModal
          show={modalAddShow}
          onHide={() => setModalAddShow(false)}
        />
      </ButtonToolbar>
    </div>
  );
};

export default Empregados;
