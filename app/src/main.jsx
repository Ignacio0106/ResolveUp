import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { RouterProvider } from 'react-router'
import { PageNotFound } from './components/Home/PageNotFound'
import TableMovies from './components/Tecnico/TableTecnico'
import { DetailTecnico } from './components/Tecnico/DetailTecnico'
import TableCategorias from './components/Categoria/TableCategoria'
import { DetailCategoria } from './components/Categoria/DetailCategoria'
import { DetailTicket } from './components/Tickets/DetailTicket'
import TableTicket from './components/Tickets/TableTicket'

//Crear las rutas
const rutas=createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      //Ruta Principal localhoust: 5173
    {index:true, element:<Home />},
    //Pagina no encontrada o Ruta comodin
    {path:'*', element:<PageNotFound/>},
    { path: "tecnico/table", element: <TableMovies /> },   // lista peliculas ADMIN 
    { path: "tecnico/detail/:id", element: <DetailTecnico /> }, // detalle técnico

     { path: "categoria/table", element: <TableCategorias /> }, // lista categorías
      { path: "categoria/detail/:id", element: <DetailCategoria /> }, // detalle categoría

      { path: "ticket/table/:id", element: <TableTicket /> }, // lista tickets
      { path: "ticket/detail/:id", element: <DetailTicket /> }, // detalle ticket
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {rutas}/>
  </StrictMode>,
)
