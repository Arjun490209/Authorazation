import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"; 
import Signup from "./pages/Signup";
import Todo from './pages/Todo'
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";

export const API = import.meta.env.VITE_API_URL
const router = createBrowserRouter([
  {
    path: "/",
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <Home />
      </>
    </ProtectedRoute>
  )
  },
  {
    path: "/login",
    element: <Login />,
  },
   {
    path: "/create-todo",
    element: <Todo />,
  },
   {
    path: "/signup",
    element: <Signup/>,
  },
  {
    path: "/verify/:token",
    element: <Verify />,
  },
   {
    path: "/verify",
    element: <VerifyEmail/>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>,
  },
  {
    path: "/verify-otp/:email",
    element: <VerifyOTP/>,
  },
   {
    path: "/change-password/:email",
    element: <ChangePassword/>,
  },
]);

const App = () => {
  return <div>
    <RouterProvider router={router} />
    
  </div>;
};

export default App;
