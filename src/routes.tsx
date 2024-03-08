import { Outlet, createBrowserRouter } from "react-router-dom";
import {
  AddTags,
  Announcements,
  BasicDetails,
  Blog,
  BlogDetails,
  BlogListing,
  Contact,
  CreateUser,
  Experience,
  ExperienceListing,
  Home,
  HostRides,
  Newsletter,
  Projects,
  ProjectsListing,
  RegisteredUsers,
} from ".";
import Login from "./auth/Login";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { roleAccess } from "./utils/constants";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoutes Component={Home} role={roleAccess.all} />,
    children: [
      {
        path: "portfolio",
        children: [
          {
            path: "basic-details",
            element: (
              <ProtectedRoutes
                Component={BasicDetails}
                role={roleAccess.portfolio}
              />
            ),
          },
          {
            path: "project",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoutes
                    Component={Projects}
                    role={roleAccess.portfolio}
                  />
                ),
              },
              {
                path: "listing",
                element: (
                  <ProtectedRoutes
                    Component={ProjectsListing}
                    role={roleAccess.portfolio}
                  />
                ),
              },
              {
                path: ":id/edit",
                element: (
                  <ProtectedRoutes
                    Component={Projects}
                    role={roleAccess.portfolio}
                  />
                ),
              },
            ],
          },
          {
            path: "experience",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoutes
                    Component={Experience}
                    role={roleAccess.portfolio}
                  />
                ),
              },
              {
                path: "listing",
                element: (
                  <ProtectedRoutes
                    Component={ExperienceListing}
                    role={roleAccess.portfolio}
                  />
                ),
              },
              {
                path: ":id/edit",
                element: (
                  <ProtectedRoutes
                    Component={Experience}
                    role={roleAccess.portfolio}
                  />
                ),
              },
            ],
          },
          {
            path: "blog",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoutes
                    Component={Blog}
                    role={roleAccess.portfolio}
                  />
                ),
              },
              {
                path: "listing",
                element: (
                  <ProtectedRoutes
                    Component={BlogListing}
                    role={roleAccess.portfolio}
                  />
                ),
              },
              {
                path: ":id",
                element: (
                  <ProtectedRoutes
                    Component={BlogDetails}
                    role={roleAccess.portfolio}
                  />
                ),
              },
              {
                path: ":id/edit",
                element: (
                  <ProtectedRoutes
                    Component={Blog}
                    role={roleAccess.portfolio}
                  />
                ),
              },
            ],
          },
          {
            path: "contact",
            element: (
              <ProtectedRoutes
                Component={Contact}
                role={roleAccess.portfolio}
              />
            ),
          },
        ],
      },
      {
        path: "vikin",
        children: [
          {
            path: "host-ride",
            element: (
              <ProtectedRoutes Component={HostRides} role={roleAccess.vikin} />
            ),
          },
          {
            path: "announcements",
            element: (
              <ProtectedRoutes
                Component={Announcements}
                role={roleAccess.vikin}
              />
            ),
          },
          {
            path: "newsletter",
            element: (
              <ProtectedRoutes Component={Newsletter} role={roleAccess.vikin} />
            ),
          },
          {
            path: "users",
            element: (
              <ProtectedRoutes
                Component={RegisteredUsers}
                role={roleAccess.vikin}
              />
            ),
          },
          {
            path: "Blog",
            element: (
              <ProtectedRoutes Component={Blog} role={roleAccess.vikin} />
            ),
          },
          {
            path: "contact",
            element: (
              <ProtectedRoutes Component={Contact} role={roleAccess.vikin} />
            ),
          },
        ],
      },
      {
        path: "create-user",
        element: (
          <ProtectedRoutes Component={CreateUser} role={roleAccess.admin} />
        ),
      },
      {
        path: "create-tags",
        element: (
          <ProtectedRoutes Component={AddTags} role={roleAccess.portfolio} />
        ),
      },
    ],
  },
]);
