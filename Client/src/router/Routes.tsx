import { createBrowserRouter, Navigate } from "react-router";
import App from "../components/App";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UsersPage from "../pages/UsersPage";
import ErrorPage from "../errors/ErrorPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import DesksPage from "../pages/DesksPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "Login", element: <LoginPage /> },
            { path: "Register", element: <RegisterPage /> },
            { path: "Users", element: <UsersPage /> },
            { path: "Error", element: <ErrorPage /> },
            { path: "server-error", element: <ServerError /> },
            { path: "not-found", element: <NotFound /> },
            { path: "Desks", element: <DesksPage /> },
            { path: "*", element: <Navigate to="/not-found" /> },
        ]
    }
])