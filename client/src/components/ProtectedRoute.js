// ProtectedRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({
  element: Component,
  isAuthenticated,
  allowedRoles,
  userRole,
  ...rest
}) => (
  <Route
    {...rest}
    element={
      isAuthenticated && allowedRoles.includes(userRole) ? (
        <Component {...rest} />
      ) : (
        <Navigate to="/login" replace />
      )
    }
  />
);

export default ProtectedRoute;
