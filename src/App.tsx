import { createBrowserRouter } from "react-router-dom";
import { UserHome } from './pages/home/index';
import { Admin } from './pages/admin/index';
import { Login } from './pages/login/index';
import { Networks } from './pages/networks/index';
import { Private } from './routes/private';
import { Error } from "./pages/error";
import { Register } from "./pages/register";

const router = createBrowserRouter([
  {
   path:"/links" ,
   element:<UserHome />

   },
  
  {
    path: "/admin/:username",
    element: <Private><Admin /></Private>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/networks",
    element: <Private><Networks /></Private>,
  },
  {
    path: "*",
    element: <Error />,
  },
]);

export { router };