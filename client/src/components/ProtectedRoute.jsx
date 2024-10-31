// import { useAuth } from './context/AuthContext';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, permissionType, resource }) => {
//   const { user } = useAuth();

//   // Assuming `user.roles` contains the user’s roles and permissions
//   if (!user || !user.roles.includes(permissionType)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };
