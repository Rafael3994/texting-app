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
import MyProvider from '@src/context/Tokens.context';



const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  // TODO: CREATE A NEW USER PAGE
  {
    path: 'lobby',
    element: <LobbyPage />
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
  // TODO: ¿¿ ADMIN PAGE ???
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MyProvider>
      <RouterProvider router={router} />
    </MyProvider>
  </React.StrictMode>,
)
