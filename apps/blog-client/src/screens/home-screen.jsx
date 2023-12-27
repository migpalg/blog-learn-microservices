import clsx from "clsx";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/button";

export const HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreatePostClick = () => {
    navigate("/post/create");
  };

  return (
    <div>
      <div className={clsx("shadow-md")}>
        <div
          className={clsx(
            "container",
            "mx-auto",
            "flex",
            "justify-between",
            "items-center",
            "px-4",
            "h-16"
          )}
        >
          <h1 className={clsx("text-xl", "font-bold")}>
            <Link to="/">Blog</Link>
          </h1>
          {location.pathname !== "/post/create" && (
            <Button onClick={handleCreatePostClick}>New post</Button>
          )}
        </div>
      </div>
      <div className={clsx("container", "mx-auto", "px-4", "py-6")}>
        <Outlet />
      </div>
    </div>
  );
};
