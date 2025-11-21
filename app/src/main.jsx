import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { RouterProvider } from 'react-router'
import { PageNotFound } from './components/Home/PageNotFound'
import { DetailTecnico } from './components/Tecnico/DetailTecnico'
import TableCategorias from './components/Categoria/TableCategoria'
import { DetailCategoria } from './components/Categoria/DetailCategoria'
import TableTicket from './components/Tickets/TableTicket'
import { DetailTicket } from './components/Tickets/DetailTicket'
import TableTecnico from './components/Tecnico/TableTecnico'
import { TableAsignacion } from './components/Asignacion/TableAsignacion'
import { DetailAsignacion } from './components/Asignacion/DetailAsignacion'
import { CreateUsuario } from './components/Usuario/CreateUsuario'
import Login from './components/Iniciar/Login'
import { CreateTecnico } from './components/Tecnico/CreateTecnico'
import { UpdateTecnico } from './components/Tecnico/UpdateTecnico'
import CreateCategoria from './components/Categoria/CreateCategoria'
import { UpdateCategoria } from './components/Categoria/UpdateCategoria'
import { Toaster } from "react-hot-toast";
import { CreateTicket } from './components/Tickets/CreateTicket'
import { UpdateTicket } from './components/Tickets/UpdateTicket'
//Crear las rutas
const rutas=createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      //Ruta Principal localhoust: 5173
    {index:true, element:<Home />},
    //Pagina no encontrada o Ruta comodin
    {path:'*', element:<PageNotFound/>},
    { path: "tecnico/table", element: <TableTecnico /> },   // lista peliculas ADMIN 
    { path: "tecnico/detail/:id", element: <DetailTecnico /> }, // detalle técnico
    { path: "tecnico/create", element: <CreateTecnico /> },
      { path: "tecnico/update/:id", element: <UpdateTecnico /> },


     { path: "categoria/table", element: <TableCategorias /> }, // lista categorías
      { path: "categoria/detail/:id", element: <DetailCategoria /> }, // detalle categoría
      { path: "categoria/create", element: <CreateCategoria /> },
      { path: "categoria/update/:id", element: <UpdateCategoria /> },

      { path: "ticket/table", element: <TableTicket /> }, // lista tickets
      { path: "ticket/detail/:id", element: <DetailTicket /> }, // detalle ticket
      { path: "ticket/create", element: <CreateTicket /> },
      { path: "ticket/update/:id", element: <UpdateTicket /> },

      { path: "asignacion/table", element: <TableAsignacion /> }, // lista asignaciones
      { path: "asignacion/detail/:id", element: <DetailAsignacion /> }, // detalle asignación

      { path: "usuario/create", element: <CreateUsuario /> },

      { path: "iniciar/login", element: <Login /> }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router = {rutas}/>
  </StrictMode>,
)
