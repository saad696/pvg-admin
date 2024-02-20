import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.tsx";
import { UserContext } from "./context/UserContext.tsx";
import { auth, db } from "./firebase/firebase.ts";
import { doc, getDoc } from "firebase/firestore";
import { message, Spin } from "antd";
import { helperService } from "./utils/helper.ts";
import { LoadingContext } from "./context/LoadingContext.tsx";

const App = () => {
  const [user, setUser] = useState<UserContext>({
    user: null,
    role: "",
    isLoggedIn: false,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    auth.onAuthStateChanged(async (_user) => {
      if (_user) {
        if (user.role) {
          setUser((prevState) => ({
            ...prevState,
            user: _user,
            isLoggedIn: true,
          }));
          setLoading(false);
        } else {
          try {
            const userRoleDocRef = doc(db, "user-roles", _user.uid);
            const userRole = await getDoc(userRoleDocRef);

            if (userRole.exists()) {
              setUser({
                user: _user,
                role: userRole.data().role,
                isLoggedIn: true,
              });
            } else {
              message.error("No role defined for this user");
              helperService.logout();
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            message.error("Something went wrong while getting user role!");
          }
        }
      } else {
        setLoading(false);
        setUser({ user: null, role: "", isLoggedIn: false });
        auth.signOut();
      }
    });
  }, []);

  return (
    <>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <UserContext.Provider value={{ user, setUser }}>
          <RouterProvider router={router} />
          <Spin spinning={loading} fullscreen />
        </UserContext.Provider>
      </LoadingContext.Provider>
    </>
  );
};

export default App;
