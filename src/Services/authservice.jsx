import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const Register = async (usuario, senha, regra, email) => {
  debugger;
  const dados = {
    Id: 0,
    Usuario: usuario,
    Senha: senha,
    Regra: (regra === '' || regra === null ? "F" : regra),
    Email: email,
  };

  return await trackPromise(
    axios
      .post(`${process.env.REACT_APP_API}Usuarios/Inserir`, dados)
      .catch((error) => {
        alert(error);
      })
  );
};

const Login = async (usuario, senha) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}Usuarios/Login/${usuario}/${senha}`
    );
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    alert(error);
  }
};

const Logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  Register,
  Login,
  Logout,
  getCurrentUser,
};
