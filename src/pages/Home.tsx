import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { MainLayout } from "..";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { helperService } from "../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(UserContext);

  useEffect(() => {
    // Store the last visited route
    if(location.pathname === '/') return
    sessionStorage.setItem('lastVisitedRoute', location.pathname);
  }, [location]);

  useEffect(() => {
    const lastVisitedRoute = sessionStorage.getItem('lastVisitedRoute');
    navigate(lastVisitedRoute || helperService.defaultRoute(user.role));
  }, []);

  return (
    <>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
};

export default Home;
