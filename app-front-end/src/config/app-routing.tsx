import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import ProjectDetail from "../components/ProjectDetail";
import Teapot from "../components/Teapot";

export const router = createBrowserRouter([
    {
        path: "/", element: <App />, children: [
            { path: "/", element: <ProjectList /> },
            { path: "/addProject", element: <ProjectForm /> },
            { path: "/:id", element: <ProjectDetail /> },
            { path: "/random?mode=random", element: <ProjectDetail /> },
            { path: "/edit/:id", element: <ProjectForm /> },
            {path : "/teapot", element : <Teapot/>}
        ]
    }
])