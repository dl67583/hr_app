import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles/Navbar.css"
import "./styles/Footer.css"
import App from "./App";
import { AuthProvider } from './context/AuthContext';
import reportWebVitals from "./reportWebVitals";

// const router = createBrowserRouter([
//   {
//     path: "/users",
//     element: <Users />,
//   },
//   {
//     path: "/departments",
//     element: <Departments />,
//   },
//   // {
//   //   path: "/users:id",
//   //   element: <UserDetails />,
//   // },
//   // {
//   //   path: "/",
//   //   element: <Home />,
//   //   errorElement:<NotFound/>
//   // },
// ]);

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
