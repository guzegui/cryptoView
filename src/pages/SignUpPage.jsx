import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const jsonServer = "http://localhost:3000/users";

/*
npx json-server --watch db.json --port 3000
*/

function SignUpPage({ loggedInState, handleLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    balance: {
      dollars: 100,
    },
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
    console.log(formData);

    axios
      .post(`${jsonServer}`, formData)
      .then((response) => {
        console.log(response);
        localStorage.setItem('loggedInUser', JSON.stringify(formData));
        handleLogin(response.data);
        navigate(`/`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleTogglePassword}>
          {showPassword ? "Hide" : "Show"} Password
        </button>
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