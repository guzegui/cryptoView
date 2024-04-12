import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios";



function DashboardPage({loggedIn}) {
 
    useEffect(() => {
        console.log(loggedIn); // Check loggedIn inside useEffect with loggedIn as dependency
      }, [loggedIn]);

  return (
    <div>DashboardPage
    {console.log(loggedIn)}</div>
  )
}

export default DashboardPage