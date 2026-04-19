import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const UserIsAuthenticated = ({ children }) => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export const UserIsNotAuthenticated = ({ children }) => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    return !isLoggedIn ? children : <Navigate to="/" replace />;
};

export const UserIsAdmin = ({ children }) => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const userInfo = useSelector(state => state.user.userInfo);
    return (isLoggedIn && userInfo?.roleId === "R1") ? children : <Navigate to="/home" replace />;
};

export const UserIsDoctor = ({ children }) => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const userInfo = useSelector(state => state.user.userInfo);
    return (isLoggedIn && userInfo?.roleId === "R2") ? children : <Navigate to="/home" replace />;
};

export const UserIsPatientOrAdmin = ({ children }) => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const userInfo = useSelector(state => state.user.userInfo);
    const isPatientOrAdmin = userInfo?.roleId === "R3" || userInfo?.roleId === "R1";
    return (isLoggedIn && isPatientOrAdmin) ? children : <Navigate to="/home" replace />;
};

export const userIsAuthenticated = (Component) => (props) => <UserIsAuthenticated><Component {...props} /></UserIsAuthenticated>;
export const userIsNotAuthenticated = (Component) => (props) => <UserIsNotAuthenticated><Component {...props} /></UserIsNotAuthenticated>;
export const userIsAdmin = (Component) => (props) => <UserIsAdmin><Component {...props} /></UserIsAdmin>;
export const userIsDoctor = (Component) => (props) => <UserIsDoctor><Component {...props} /></UserIsDoctor>;
export const userIsPatientOrAdmin = (Component) => (props) => <UserIsPatientOrAdmin><Component {...props} /></UserIsPatientOrAdmin>;