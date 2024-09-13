import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/login/Login.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  // TODO: CREATE A NEW USER PAGE
  // TODO:  LOBBY PAGE
  {
    path: 'lobby',
    element: <div><h1>LOBBY</h1></div>
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
  // TODO: ¿¿ ADMIN PAGE ???
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
