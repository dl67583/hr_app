import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/styles/variables.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Users from './routes/Users';
import UserDetails from './routes/UserDetails';
import NotFound from './routes/NotFound';
import Home from './routes/Home'
import Departments from './routes/Departments';
import Dashboard from './routes/Dashboard';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/departments",
    element: <Departments />,
  },
  // {
  //   path: "/users:id",
  //   element: <UserDetails />,
  // },
  // {
  //   path: "/",
  //   element: <Home />,
  //   errorElement:<NotFound/>
  // },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <RouterProvider router={router} />

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
