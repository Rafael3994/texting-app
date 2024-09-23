import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from '@src/pages/login/Login.tsx';
import LobbyPage from '@src/pages/lobby/Lobby.tsx';
import MyContext from './context/MyContext';



const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: 'lobby',
    element: <LobbyPage />
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MyContext>
      <RouterProvider router={router} />
    </MyContext>
  </React.StrictMode>,
)
