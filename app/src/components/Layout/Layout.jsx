import React from "react";
import Header from "./Header"; 
import { Footer } from "./Footer"; 
import { Outlet } from "react-router-dom"; 
import UserProvider from "@/context/UserProvider";
import { NotificacionProvider } from "@/context/NotificacionProvider";
 
export function Layout() { 
  return ( 
    <UserProvider>
      <NotificacionProvider>
    <div className="flex min-h-screen flex-col"> 
      <Header /> 
      <main className="flex-1 pt-16 pb-16"> 
        <Outlet /> 
      </main> 
      <Footer /> 
    </div> 
    </NotificacionProvider>
    </UserProvider>
    
  ); 
} 