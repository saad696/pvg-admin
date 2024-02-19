import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

interface props {
  Component: React.FC;
  role?: string[]
}

const ProtectedRoutes: React.FC<props> = ({ Component, role = [] }) => {
  const { user } = useContext(UserContext);
  
  const userHasAccess = role.includes(user.role)

  return (
    <>{user.isLoggedIn && userHasAccess ? <Component /> : <Navigate to={"/auth/login"} />}</>
  );
};

export default ProtectedRoutes;
