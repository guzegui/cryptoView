import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import urlStrings from "../../urls.json"
/*
npx json-server --watch db.json --port 3000
*/

function SignUpPage({
  handleLogin,
  users,
  alertMessage,
  setShowAlerts,
  showAlerts,
  setAlertInfo,
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    balance: {
      dollars: 100000000,
      bitcoin: 10,
      ethereum: 10,
      litecoin: 10,
      dogecoin: 10,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Email should be "example@example.com". Dashes are valid
  // Passwords should have at least 8 characters, and contain letters, special characters and numbers
  const regexCheck = (email, password) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = passwordRegex.test(password);

    if (!isEmailValid && !isPasswordValid) {
      return "both invalid";
    } else if (!isEmailValid) {
      return "invalid email";
    } else if (!isPasswordValid) {
      return "invalid password";
    } else {
      return "both pass";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check validity of password and email
    const validity = regexCheck(formData.email, formData.password);
    let type = "";
    let isEverythingOk = false;
    if (validity !== "both pass") {
      if (validity === "both invalid") {
        type =
          "Invalid email and password! Password should be at least 8 characters long and contain letters, numbers and special characters.";
      } else if (validity === "invalid email") {
        type = "Invalid email! ex. example@example.com";
      } else if (validity === "invalid password") {
        type =
          "Invalid password! It should be at least 8 characters long and contain letters, numbers and special characters";
      }
    } else {
      // Check if email or username already exists
      const emailExists = users.some((user) => user.email === formData.email);
      const usernameExists = users.some(
        (user) => user.username === formData.username
      );

      if (emailExists || usernameExists) {
        if (emailExists && usernameExists) {
          type = "Email and username already exist!";
        } else if (usernameExists) {
          type = "Username already exists";
        } else {
          type = "Email already exists";
        }
      }

      if (isEverythingOk) {
        axios
          .post(`${urlStrings.jsonServer}`, formData)
          .then((response) => {
            handleLogin(response.data, undefined);
            navigate(`/ticker`);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setShowAlerts(true);
        setAlertInfo({ type: type });
      }
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="example@example.com"
        />
      </div>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {showPassword ? (
            <VisibilityIcon onClick={handleTogglePassword} />
          ) : (
            <VisibilityOffIcon onClick={handleTogglePassword} />
          )}
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default SignUpPage;

/*



*/

/*
<form>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Password</label>
        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputFile">File input</label>
        <input type="file" id="exampleInputFile" />
        <p className="help-block">Example block-level help text here.</p>
      </div>
      <div className="checkbox">
        <label>
          <input type="checkbox" /> Check me out
        </label>
      </div>
      <button type="submit" className="btn btn-default">Submit</button>
    </form>

*/
