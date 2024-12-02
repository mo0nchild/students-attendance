import { createBrowserRouter } from "react-router-dom";
import HomePage from "@pages/HomePage";

export const routers = createBrowserRouter([
    {
        path: '/',
        element: HomePage()
    }
])