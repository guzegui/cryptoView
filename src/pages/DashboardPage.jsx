import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const jsonServer = "http://localhost:3000/users";

function DashboardPage({ tableInfo }) {
  const [user, setUser] = useState({});
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
      DashboardPage
      {!user ? (
        <div>Loading...</div>
      ) : (
        <div>
          {user.id}
          {user.username}
          {user.email}
          {user.password}
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
