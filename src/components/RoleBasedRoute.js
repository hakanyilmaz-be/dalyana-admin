// src/components/RoleBasedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { userRole } = useAuth();

    return allowedRoles.includes(userRole) ? children : <Navigate to="/" />;
};

export default RoleBasedRoute;
