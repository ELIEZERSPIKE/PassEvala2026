// import React from 'react';
// import { useAuth } from '../features/auth/context/AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-600">Chargement...</p>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
//           <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
//             Se connecter
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
