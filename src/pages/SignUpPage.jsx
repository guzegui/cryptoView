import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const jsonServer = "http://localhost:3000/users";

/*
npx json-server --watch db.json --port 3000
*/

function SignUpPage({ handleLogin, users }) {
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

    let isEverythingOk = false;

    // Check validity of password and email
    const validity = regexCheck(formData.email, formData.password);
    if (validity === "both invalid") {
      alert(
        "Invalid email and password! Password should be at least 8 characters long and contain letters, numbers and special characters."
      );
    } else if (validity === "invalid email") {
      alert("Invalid email! ex. example@example.com");
    } else if (validity === "invalid password") {
      alert(
        "Invalid password! It should be at least 8 characters long and contain letters, numbers and special characters"
      );
    } else {
      // Check if email or username already exists
      const emailExists = users.some((user) => user.email === formData.email);
      const usernameExists = users.some(
        (user) => user.username === formData.username
      );

      if (emailExists || usernameExists) {
        if (emailExists && usernameExists) {
          alert("Email and username already exist!");
        } else if (usernameExists) {
          alert("Username already exists");
        } else {
          alert("Email already exists");
        }
      } else {
        isEverythingOk = true;
      }
    }

    if (isEverythingOk) {
      axios
        .post(`${jsonServer}`, formData)
        .then((response) => {
          handleLogin(response.data, undefined);
          navigate(`/`);
        })
        .catch((error) => {
          console.log(error);
        });
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
