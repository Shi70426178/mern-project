import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin }) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated
    const user = JSON.parse(localStorage.getItem('user'));
    const userIsAdmin = user && user.isAdmin;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (isAdmin && !userIsAdmin) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
