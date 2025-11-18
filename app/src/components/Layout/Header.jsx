import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Film,
  BookOpen,
  Filter,
  LogIn,
  UserPlus,
  LogOut,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  LaptopMinimalCheck,
  FolderCode,
  TicketCheck,
  Bell,
  Settings,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "../hooks/useUser";



export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
//const { user/*, isAuthenticated, clearUser, authorize*/ } = useUser();
//console.log("User in Header:", user?.email || "Invitado");

const navItems = [
  { title: "Películas", href: "/movie", icon: <Film className="h-4 w-4" /> },
  {
    title: "Catálogo de Películas",
    href: "/movie/",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Filtrar Películas",
    href: "/movie/filter",
    icon: <Filter className="h-4 w-4" />,
  },
];

const mantItems = [
  { 
    title: "Listado de Técnicos", 
    href: "/tecnico/table",
    icon: <User className="h-4 w-4" />,
    description: "Gestionar técnicos del sistema"
  },
  {
    title: "Listado de Categorías",
    href: "/categoria/table",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Categorías de tickets"
  },
  {
    title: "Listado de Tickets",
    href: "/ticket/table",
    icon: <TicketCheck className="h-4 w-4" />,
    description: "Ver todos los tickets"
  },
  {
    title: "Asignaciones",
    href: "/asignacion/table",
    icon: <FolderCode className="h-4 w-4" />,
    description: "Gestionar asignaciones"
  },
  {
    title: "Crear Usuario",
    href: "/usuario/create",
    icon: <UserPlus className="h-4 w-4" />,
    description: "Añadir nuevo usuario"
  },
  {
    title: "Crear Ticket",
    href: "/ticket/create",
    icon: <TicketCheck className="h-4 w-4" />,
    description: "Crear nuevo ticket"
  },
];

const userItems = [
  { 
    title: "Perfil", 
    href: "/user/profile", 
    icon: <User className="h-4 w-4" />,
    description: "Ver mi perfil"
  },
  { 
    title: "Configuración", 
    href: "/user/settings", 
    icon: <Settings className="h-4 w-4" />,
    description: "Ajustes de cuenta"
  },
  {
    title: "Login",
    href: "/user/login",
    icon: <LogIn className="h-4 w-4" />,
    description: "Iniciar sesión"
  },
  {
    title: "Registrarse",
    href: "/user/create",
    icon: <UserPlus className="h-4 w-4" />,
    description: "Crear nueva cuenta"
  },
];

  return (
    <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-xl bg-gradient-to-r from-card/95 via-sidebar/95 to-card/95 border-b border-border shadow-xl">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 max-w-7xl mx-auto text-foreground">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold tracking-wide hover:scale-105 transition-all duration-300 group"
        >
          <div className="relative">
            {/* Contenedor principal usando tus colores */}
            <div className="p-2.5 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:rotate-2">
              <LaptopMinimalCheck className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
            </div>
            
          </div>
          
          <div className="flex flex-col">
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-extrabold text-lg leading-tight">
              ResolveUp
            </span>
            <span className="hidden lg:inline text-[10px] text-muted-foreground font-medium tracking-wider -mt-0.5 uppercase">
              ¡Hola, {/*user.name*/}!
            </span>
          </div>
        </Link>

        {/* -------- Menú Escritorio con colores del sistema -------- */}
        <div className="hidden lg:flex flex-1 justify-center">
          <Menubar className="w-auto bg-transparent border-none shadow-none space-x-2">
            
            {/* Listados */}
            <MenubarMenu>
<MenubarTrigger className="group relative text-foreground/95 font-medium flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-card/80 to-muted/40 hover:from-accent/15 hover:to-primary/10 hover:border-accent/40 hover:shadow-sm hover:shadow-accent/15 transition-all duration-300 ease-out data-[state=open]:from-accent/25 data-[state=open]:to-primary/15 data-[state=open]:border-accent/50 data-[state=open]:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
  <Film className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity duration-200" /> 
  <span className="hidden xl:inline text-sm">Listados</span>
  <ChevronDown className="h-3 w-3 opacity-60 group-hover:opacity-80 transition-all duration-200 data-[state=open]:rotate-180" />
</MenubarTrigger>
              <MenubarContent className="bg-gradient-to-br from-card/95 via-card/90 to-muted/20 backdrop-blur-xl border border-border/50 rounded-2xl p-3 min-w-[250px] shadow-2xl shadow-accent/15 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                {navItems.map((item, index) => (
<Link
  to={item.href}
  className="group flex items-center gap-3 py-3 px-4 rounded-xl text-sm hover:bg-gradient-to-r hover:from-muted/30 hover:to-accent/10 hover:shadow-sm hover:shadow-accent/10 transition-all duration-300 ease-out text-foreground/85 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
>
  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 group-hover:from-primary/20 group-hover:to-accent/15 group-hover:scale-105 transition-all duration-300">
    <div className="h-4 w-4 text-accent/80 group-hover:text-primary transition-colors duration-300">
      {item.icon}
    </div>
  </div>
  <span className="font-medium group-hover:font-semibold transition-all duration-200">
    {item.title}
  </span>
</Link>
                ))}
              </MenubarContent>
            </MenubarMenu>

            {/* Mantenimientos */}
            <MenubarMenu>
              <MenubarTrigger className="group relative text-foreground/95 font-medium flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-card/80 to-muted/40 hover:from-accent/15 hover:to-primary/10 hover:border-accent/40 hover:shadow-sm hover:shadow-accent/15 transition-all duration-300 ease-out data-[state=open]:from-accent/25 data-[state=open]:to-primary/15 data-[state=open]:border-accent/50 data-[state=open]:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Layers className="h-4 w-4 group-hover:scale-105 transition-all duration-300" /> 
                <span className="hidden xl:inline">Mantenimientos</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180" />
              </MenubarTrigger>
              <MenubarContent className="bg-card/95 backdrop-blur-xl border-border rounded-lg p-2 min-w-[280px] shadow-xl">
                {mantItems.map((item, index) => (
                  <div key={item.href}>
<Link
  to={item.href}
  className="group flex items-start gap-3 py-3 px-4 rounded-xl text-sm hover:bg-gradient-to-r hover:from-muted/30 hover:to-accent/10 hover:shadow-sm hover:shadow-accent/10 transition-all duration-300 ease-out text-foreground/85 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
>
  <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/15 to-accent/8 group-hover:from-secondary/25 group-hover:to-accent/18 group-hover:scale-105 transition-all duration-300 mt-0.5 flex-shrink-0">
    <div className="h-4 w-4 text-secondary group-hover:text-accent transition-colors duration-300">
      {item.icon}
    </div>
  </div>
  <div className="flex-1 min-w-0">
    <div className="font-medium group-hover:font-semibold transition-all duration-200 group-hover:text-foreground">
      {item.title}
    </div>
    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/90 mt-0.5 transition-colors duration-200">
      {item.description}
    </div>
  </div>
</Link>
                
                    {index === 3 && <MenubarSeparator className="bg-border my-2" />}
                  </div>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* -------- Sección Derecha -------- */}
        <div className="flex items-center gap-3">
          {/* Notificaciones */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors group hidden md:block">
            <Bell className="h-5 w-5 text-foreground/80 group-hover:text-foreground transition-colors" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-destructive text-destructive-foreground text-xs flex items-center justify-center border-2 border-card">
              2
            </Badge>
          </button>

          {/* Carrito */}
          <Link 
            to="/cart" 
            className="relative p-2 rounded-lg hover:bg-muted transition-colors group hidden md:block"
          >
            <ShoppingCart className="h-5 w-5 text-foreground/80 group-hover:text-foreground transition-colors" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-accent text-accent-foreground text-xs flex items-center justify-center border-2 border-card">
              3
            </Badge>
          </Link>

          {/* Usuario Desktop */}
          <div className="hidden lg:block">
            <Menubar className="bg-transparent border-none shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="text-foreground font-medium flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-all duration-200 data-[state=open]:bg-muted/80">
                  <Avatar className="h-7 w-7 border-2 border-border">
                    <AvatarImage src={'hj'} alt={''} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs">
                      IG
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block text-left">
                    <div className="text-sm font-medium">{/*user.name*/}</div>
                    <div className="text-xs text-muted-foreground">{/*user.email*/}</div>
                  </div>
                  <ChevronDown className="h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180" />
                </MenubarTrigger>
                <MenubarContent className="bg-card/95 backdrop-blur-xl border-border rounded-lg p-2 min-w-[240px] shadow-xl">
                  {userItems.map((item, index) => (
                    <div key={item.href}>
                      {index === 2 && <MenubarSeparator className="bg-border my-2" />}
                      <MenubarItem asChild>
                        <Link
                          to={item.href}
                          className="flex items-start gap-3 py-3 px-4 rounded-lg text-sm hover:bg-muted transition-all duration-200 text-foreground/90 hover:text-foreground group"
                        >
                          <div className={`p-1.5 rounded-md transition-colors mt-0.5 ${
                            item.title === 'Login' || item.title === 'Registrarse' 
                              ? 'bg-chart-5/20 group-hover:bg-chart-5/30' 
                              : 'bg-accent/20 group-hover:bg-accent/30'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                          </div>
                        </Link>
                      </MenubarItem>
                    </div>
                  ))}
                  <MenubarSeparator className="bg-border my-2" />
                  <MenubarItem asChild>
                    <button className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-sm hover:bg-destructive/20 transition-all duration-200 text-destructive hover:text-destructive group">
                      <div className="p-1.5 rounded-md bg-destructive/20 group-hover:bg-destructive/30 transition-colors">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Cerrar Sesión</div>
                        <div className="text-xs text-destructive/60 mt-0.5">Salir del sistema</div>
                      </div>
                    </button>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Menú Móvil */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 active:scale-95">
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-sidebar/98 backdrop-blur-xl text-sidebar-foreground border-sidebar-border w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3 text-sidebar-foreground">
                  <div className="p-2 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-lg">
                    <LaptopMinimalCheck className="h-5 w-5 text-sidebar-primary-foreground" />
                  </div>
                  ResolveUp
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 space-y-6">
                {/* Usuario móvil */}
                <div className="p-4 bg-muted/20 rounded-lg border border-sidebar-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-sidebar-border">
                      <AvatarImage src={'hj'} alt={''} />
                      <AvatarFallback className="bg-gradient-to-br from-sidebar-primary to-sidebar-accent text-sidebar-primary-foreground">
                        IG
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{/*user.name*/}</div>
                      <div className="text-sm text-muted-foreground">{/*user.email*/}</div>
                    </div>
                  </div>
                </div>

                {/* Acciones rápidas móvil */}
                <div className="flex gap-2">
                  <Link 
                    to="/cart" 
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm">Carrito</span>
                    <Badge className="bg-accent text-accent-foreground text-xs">3</Badge>
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Notif.</span>
                    <Badge className="bg-destructive text-destructive-foreground text-xs">2</Badge>
                  </button>
                </div>

                {/* Menús móvil usando colores del sistema */}
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Film className="h-4 w-4" /> Listados
                    </h4>
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 py-3 px-4 rounded-lg text-sidebar-foreground/90 hover:bg-muted/20 hover:text-sidebar-foreground transition-all duration-200 group"
                        >
                          <div className="p-1.5 rounded-md bg-primary/20 group-hover:bg-primary/30 transition-colors">
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Layers className="h-4 w-4" /> Mantenimientos
                    </h4>
                    <div className="space-y-1">
                      {mantItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-start gap-3 py-3 px-4 rounded-lg text-sidebar-foreground/90 hover:bg-muted/20 hover:text-sidebar-foreground transition-all duration-200 group"
                        >
                          <div className="p-1.5 rounded-md bg-secondary/20 group-hover:bg-secondary/30 transition-colors mt-0.5">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <User className="h-4 w-4" /> Usuario
                    </h4>
                    <div className="space-y-1">
                      {userItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-start gap-3 py-3 px-4 rounded-lg text-sidebar-foreground/90 hover:bg-muted/20 hover:text-sidebar-foreground transition-all duration-200 group"
                        >
                          <div className={`p-1.5 rounded-md transition-colors mt-0.5 ${
                            item.title === 'Login' || item.title === 'Registrarse' 
                              ? 'bg-chart-5/20 group-hover:bg-chart-5/30' 
                              : 'bg-accent/20 group-hover:bg-accent/30'
                          }`}>
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                      <button 
                        onClick={() => setMobileOpen(false)}
                        className="w-full flex items-start gap-3 py-3 px-4 rounded-lg text-destructive hover:bg-destructive/20 hover:text-destructive transition-all duration-200 group"
                      >
                        <div className="p-1.5 rounded-md bg-destructive/20 group-hover:bg-destructive/30 transition-colors mt-0.5">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Cerrar Sesión</div>
                          <div className="text-xs text-destructive/60 mt-0.5">Salir del sistema</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}