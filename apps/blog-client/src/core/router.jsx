import { createBrowserRouter } from "react-router-dom";
import { HomeScreen } from "../screens/home-screen";
import { CreatePostScreen } from "../screens/create-post-screen";
import { ListPostsScreen } from "../screens/list-posts-screen";

/**
 * Routes of the application
 * @type {import("react-router-dom").RouteObject[]}
 */
export const routes = [
  {
    path: "/",
    element: <HomeScreen />,
    children: [
      {
        index: true,
        element: <ListPostsScreen />,
      },
      {
        path: "post/create",
        element: <CreatePostScreen />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
