import { createBrowserRouter } from "react-router-dom"
import {Home} from './pages/home/index'
import {Admin} from './pages/admin/index'
import {Login} from './pages/login/index'
import {Networks} from './pages/networks/index'
import {Private} from './routes/private'
import { Error} from "./pages/error"
const router = createBrowserRouter([
  {
    path:"/",
    element: <Home/>
  },
  {
    path:"/admin",
    element: <Private> <Admin/></Private>
  },

  {
    path:"/login",
    element: <Login/>
  },
  {
    path:"/networks",
    element: <Private> <Networks/></Private>
  },
  {
    path:"*",
    element: <Error/>
  }
])
export  {router}