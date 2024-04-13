import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const jsonServer = "http://localhost:3000/users";

function DashboardPage({user, setUser}) {
  const id = localStorage.getItem("loggedInUser").slice(7, 11);

  useEffect(() => {
    axios.get(`${jsonServer}/${id}`).then((response) => {
      const user = response.data;
      console.log(user);
      setUser(user);
    });
  }, []);

  return (
    <div>
      {!user ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>Id: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Password: {user.password}</p>
          <p>Balance: ${user.balance?.dollars || "Loading..."}</p>
        </div>
      )}
    </div>
  );
}

/*
{
  "id": "b450",
  "username": "asdfasd",
  "email": "asdfasdf",
  "password": "asdfasdf",
  "balance": {
    "dollars": 100
  }
}


*/

export default DashboardPage;
