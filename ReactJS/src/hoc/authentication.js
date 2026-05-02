import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

// 1. UserIsAuthenticated
const UserIsAuthenticatedComponent = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};
const mapStateToPropsAuth = state => ({ isLoggedIn: state.user.isLoggedIn });
export const UserIsAuthenticated = connect(mapStateToPropsAuth)(UserIsAuthenticatedComponent);

// 2. UserIsNotAuthenticated
const UserIsNotAuthenticatedComponent = ({ isLoggedIn, children }) => {
    return !isLoggedIn ? children : <Navigate to="/" replace />;
};
export const UserIsNotAuthenticated = connect(mapStateToPropsAuth)(UserIsNotAuthenticatedComponent);

// 3. UserIsAdmin
const UserIsAdminComponent = ({ isLoggedIn, userInfo, children }) => {
    return (isLoggedIn && userInfo?.roleId === "R1") ? children : <Navigate to="/home" replace />;
};
const mapStateToPropsUser = state => ({ 
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo 
});
export const UserIsAdmin = connect(mapStateToPropsUser)(UserIsAdminComponent);

// 4. UserIsDoctor
const UserIsDoctorComponent = ({ isLoggedIn, userInfo, children }) => {
    return (isLoggedIn && userInfo?.roleId === "R2") ? children : <Navigate to="/home" replace />;
};
export const UserIsDoctor = connect(mapStateToPropsUser)(UserIsDoctorComponent);

// 5. UserIsPatientOrAdmin
const UserIsPatientOrAdminComponent = ({ isLoggedIn, userInfo, children }) => {
    const isPatientOrAdmin = userInfo?.roleId === "R3" || userInfo?.roleId === "R1" || userInfo?.roleId === "R2";
    return (isLoggedIn && isPatientOrAdmin) ? children : <Navigate to="/home" replace />;
};
export const UserIsPatientOrAdmin = connect(mapStateToPropsUser)(UserIsPatientOrAdminComponent);

// HOC wrappers cho Component
export const userIsAuthenticated = (Component) => (props) => <UserIsAuthenticated><Component {...props} /></UserIsAuthenticated>;
export const userIsNotAuthenticated = (Component) => (props) => <UserIsNotAuthenticated><Component {...props} /></UserIsNotAuthenticated>;
export const userIsAdmin = (Component) => (props) => <UserIsAdmin><Component {...props} /></UserIsAdmin>;
export const userIsDoctor = (Component) => (props) => <UserIsDoctor><Component {...props} /></UserIsDoctor>;
export const userIsPatientOrAdmin = (Component) => (props) => <UserIsPatientOrAdmin><Component {...props} /></UserIsPatientOrAdmin>;