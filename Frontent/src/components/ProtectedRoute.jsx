import React from 'react'
import {getData} from '../context/userContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const {user} = getData()
  return (
    <div>
        {
        user ? children : <Navigate to={'/login'}/>
        }
    </div>
  )
}

export default ProtectedRoute