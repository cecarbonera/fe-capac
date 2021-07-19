import React from "react";
import AuthService from "../Services/authservice";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Dados do Usuário</h3>
      </header>
      <p>
        <strong>Usuário:</strong> {currentUser.usuario[0].Usuario}
      </p>
      <p>
        <strong>Token:</strong> {currentUser.acessToken.substring(0,140)}{" ..."}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.usuario[0].Id}
      </p>
      <p>
        <strong>E-mail:</strong>{" "}
        {currentUser.usuario[0].Email ?? "Sem e-mail cadastrado"}
      </p>
      <p>
        <strong>Tipo:</strong> {currentUser.usuario[0].Regra}
      </p>
    </div>
  );
};

export default Profile;
