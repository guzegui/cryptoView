import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios";



function DashboardPage() {
 
    useEffect(() => {
      }, []);

  return (
    <div>DashboardPage
    {localStorage.getItem('loggedInUser')}</div>
  )
}

export default DashboardPage