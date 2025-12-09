import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n';
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


import { CreateTecnico } from './components/Tecnico/CreateTecnico'
import { UpdateTecnico } from './components/Tecnico/UpdateTecnico'
import CreateCategoria from './components/Categoria/CreateCategoria'
import { UpdateCategoria } from './components/Categoria/UpdateCategoria'
import { Toaster } from "react-hot-toast";
import { CreateTicket } from './components/Tickets/CreateTicket'

import { CreateUsuario } from './components/Usuario/CreateUsuario'
import Login from './components/Usuario/Login'
import { RoleRoute } from './components/Auth/RoleRoute';
import { UpdateTicket } from './components/Tickets/UpdateTicket';
import AsignacionTickets from './components/Asignacion/AsignacionTickets';


//Crear las rutas
const rutas=createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      //Ruta Principal localhoust: 5173
    {index:true, element:<Home />},
    //Pagina no encontrada o Ruta comodin
    {path:'*', element:<PageNotFound/>},

    { path: "tecnico/table", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <TableTecnico /></RoleRoute> },   // lista peliculas ADMIN 
    { path: "tecnico/detail/:id", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <DetailTecnico /></RoleRoute> }, // detalle técnico
    { path: "tecnico/create", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <CreateTecnico /></RoleRoute> },
      { path: "tecnico/update/:id", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <UpdateTecnico /></RoleRoute> },


     { path: "categoria/table", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <TableCategorias /></RoleRoute> }, // lista categorías
      { path: "categoria/detail/:id", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <DetailCategoria /> </RoleRoute> }, // detalle categoría
      { path: "categoria/create", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <CreateCategoria /> </RoleRoute> },
      { path: "categoria/update/:id", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <UpdateCategoria /> </RoleRoute> },

      { path: "ticket/table", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <TableTicket /></RoleRoute> }, // lista tickets
      { path: "ticket/detail/:id", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <DetailTicket /> </RoleRoute> }, // detalle ticket
      { path: "ticket/create", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <CreateTicket /> </RoleRoute> },
      { path: "ticket/update/:id", element: <RoleRoute requiredRoles={["Administrador", "Técnico", "Cliente"]}> <UpdateTicket /> </RoleRoute> },

      { path: "asignacion/table", element: <RoleRoute requiredRoles={["Administrador", "Técnico"]}> <TableAsignacion /></RoleRoute> }, // lista asignaciones
      { path: "asignacion/detail/:id", element: <RoleRoute requiredRoles={["Administrador", "Técnico"]}> <DetailAsignacion /> </RoleRoute> }, // detalle asignación
      { path: "asignacion/tickets", element: <RoleRoute requiredRoles={["Administrador"]}> <AsignacionTickets /> </RoleRoute> },

      { path: "usuario/create", element: <CreateUsuario /> },      
      { path: "usuario/login", element: <Login /> },

    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router = {rutas}/>
  </StrictMode>,
)
