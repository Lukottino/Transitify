import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');

    if(type === "ADMIN"){
        return <Navigate to="/administration" />;
    }

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default RedirectRoute;