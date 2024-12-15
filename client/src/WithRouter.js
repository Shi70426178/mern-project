import React from 'react';
import { useLocation } from 'react-router-dom';

const WithRouter = ({ children }) => {
    const location = useLocation();
    return React.cloneElement(children, { location });
};

export default WithRouter;
