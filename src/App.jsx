import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "../src/Services/authservice";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import BoardUser from "./Components/BoardUser";
import Empregados from "../src/Empregados/Empregados";
import Departamento from "../src/Departamento/Departamento";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.Logout();
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">        
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to={"/departamento"} className="nav-link">Departamentos</Link>
          </li>
          <li className="nav-item">
            <Link to={"/empregados"} className="nav-link">Empregados</Link>
          </li>
          {currentUser && (
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">Usuário</Link>
            </li>
          )}
        </div>
        {currentUser ? 
        (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">{currentUser.username}</Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>LogOut</a>
            </li>
          </div>
        ) 
        : 
        (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>
      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/user" component={BoardUser} />
          <Route path="/departamento" component={Departamento} />
          <Route path="/empregados" component={Empregados} />
        </Switch>
      </div>
    </div>
  );
};

export default App;