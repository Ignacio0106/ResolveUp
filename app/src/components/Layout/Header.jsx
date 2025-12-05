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
  ChevronsUpDownIcon,
  CheckIcon,
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";
import { useNotificaciones } from "@/hooks/UseNotificaciones"; 
import { useEffect} from "react";
import { Clock, Send, CheckCircle } from "lucide-react";
import { Circle } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, clearUser, authorize } = useUser();
const usuarioID = 5; // ID fijo para pruebas
  const { notificaciones, cantidadNoLeidas, marcarLeida, recargarNotificaciones, } = useNotificaciones();
useEffect(() => {
  recargarNotificaciones(usuarioID);
}, [usuarioID]);

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
      description: "Gestionar técnicos del sistema",
    },
    {
      title: "Listado de Categorías",
      href: "/categoria/table",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Categorías de tickets",
    },
    {
      title: "Listado de Tickets",
      href: "/ticket/table",
      icon: <TicketCheck className="h-4 w-4" />,
      description: "Ver todos los tickets",
    },
    {
      title: "Asignaciones",
      href: "/asignacion/table",
      icon: <FolderCode className="h-4 w-4" />,
      description: "Gestionar asignaciones",
    },
    {
      title: "Asignar Tickets",
      href: "/asignacion/tickets",
      icon: <FolderCode className="h-4 w-4" />,
      description: "Gestionar asignaciones",
    },

/*     {
      title: "Crear Usuario",
      href: "/usuario/create",
      icon: <UserPlus className="h-4 w-4" />,
      description: "Añadir nuevo usuario",
    }, */
  ];
  const { t } = useTranslation();
  const userItems = [
    {
      title: t("header.user.login"),
      href: "/usuario/login",
      icon: <LogIn className="h-4 w-4" />,
      description: t("header.user.loginD"),
      show: !isAuthenticated,
    },
    {
      title: t("header.user.register"),
      href: "/usuario/create",
      icon: <UserPlus className="h-4 w-4" />,
      description: t("header.user.registerD"),
      show: !isAuthenticated,
    },
        {
      title: t("header.logout.button"),
      href: "#login",
      icon: <UserPlus className="h-4 w-4" />,
      description: t("header.logout.description"),
      show: isAuthenticated,
      action: clearUser,
    },
  ];
                 <button className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-destructive/15 transition-all duration-200 group">
                      <div className="mt-0.5 p-2 rounded-lg bg-destructive/60 group-hover:bg-primary/50 transition-colors duration-200 flex items-center justify-center">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium group-hover:font-semibold transition-all duration-150">{t("header.logout.button")}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {t("header.logout.description")}
                        </div>
                      </div>
                    </button>
const idiomas = [
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "en", label: "English", flag: "🇺🇸" }
];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { i18n } = useTranslation();


const selectedLanguage = idiomas.find((l) => l.value === i18n.language);

  return (
    <header className="w-full fixed top-0 left-0 z-999 border-b-4 backdrop-blur-xl bg-primary/70">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold hover:scale-[1.02] transition-transform duration-300 group"
        >
          <div className="p-2.5 rounded-full border border-accent bg-card group-hover:border-primary/70 transition-all duration-300">
            <LaptopMinimalCheck className="h-5 w-5 text-accent group-hover:text-primary transition-colors duration-300" />
          </div>

          <div className="flex flex-col">
            <span className="hidden sm:inline text-lg font-extrabold leading-tight text-foreground/90">
              ResolveUp
            </span>
            <span className="hidden lg:inline text-xs text-muted-foreground font-medium">
              {t("header.greeting", { name: user?.nombre || t("header.guest") })}
            </span>
          </div>
        </Link>
        
        <div className="hidden lg:flex flex-1 justify-center">
          <Menubar className="w-auto bg-transparent border-none shadow-none space-x-2">
            {/* Listados */}
            <MenubarMenu>
              <MenubarTrigger className="group relative text-foreground font-medium flex items-center gap-2.5 px-4 py-2 rounded-full
                                         bg-background/60 border-2 border-border
                                        hover:border-accent hover:bg-background/90
                                         transition-all duration-200">
                <Film className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-200" />
                <span className="hidden xl:inline text-sm">{t("header.menus.lists")}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200" />
              </MenubarTrigger>
              <MenubarContent className="bg-card border border-border rounded-b-2xl p-3 min-w-[250px]">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-foreground/85 hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-accent/50 group-hover:bg-primary/70 transition-colors duration-200 flex items-center justify-center">
                      <div className="h-4 w-4">
                        {item.icon}
                      </div>
                    </div>
                    <span className="font-medium group-hover:font-semibold transition-all duration-150">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </MenubarContent>
            </MenubarMenu>

            {/* Mantenimientos */}
            <MenubarMenu>
              <MenubarTrigger className="group relative text-foreground font-medium flex items-center gap-2.5 px-4 py-2 rounded-full
                                         bg-background/60 border-2 border-border
                                        hover:border-accent hover:bg-background/90
                                         transition-all duration-200">
                <Layers className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-200" />
                <span className="hidden xl:inline text-sm">{t("header.menus.maintenance")}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200" />
              </MenubarTrigger>
              <MenubarContent className="bg-card border border-border rounded-b-2xl p-3 min-w-[280px]">
                {mantItems.map((item, index) => (
                  <div key={item.href}>
                    <Link
                      to={item.href}
                      className="group flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-foreground/85 hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-accent/50 group-hover:bg-primary/70 transition-colors duration-200 flex items-center justify-center">
                        <div className="h-4 w-4">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium group-hover:font-semibold transition-all duration-150">
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
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
           <Popover>
  <PopoverTrigger asChild>
    <button className="relative p-2 rounded-full hover:bg-muted/60 transition-colors group">
      <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      {cantidadNoLeidas > 0 && (
        <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center border border-card">
          {cantidadNoLeidas}
        </Badge>
      )}
    </button>
  </PopoverTrigger>



<PopoverContent className="w-96 max-h-96 p-4 bg-card overflow-y-auto rounded-2xl shadow-xl font-sans">
  {notificaciones.length === 0 && (
    <div className="text-sm text-muted-foreground p-4 text-center italic">
      No hay notificaciones
    </div>
  )}

  {notificaciones
    .slice()
    .sort((a, b) => Number(a.leida) - Number(b.leida))
    .map((notif) => {
      const estaLeida = Number(notif.leida) === 1;

      // Colores tipo "badge"
      const badgeColor = !estaLeida ? "bg-yellow-400" : "bg-green-400";
      const badgeTextColor = !estaLeida ? "text-yellow-900" : "text-green-900";

      return (
        <div
          key={notif.id}
          className={`flex justify-between items-start p-4 mb-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.03] ${
            !estaLeida ? "bg-background/80" : "bg-background/60"
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Checkbox consistente */}
            <input
              type="checkbox"
              checked={estaLeida}
              onChange={() => marcarLeida(notif.id, usuarioID)}
              className="w-5 h-5 mt-1 flex-shrink-0"
            />

            {/* Icono dinámico */}
            <span className="flex-shrink-0 mt-1">
              {estaLeida ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-yellow-500" />
              )}
            </span>

            {/* Contenido */}
            <div className="flex flex-col">
              {/* Badge tipo */}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeColor} ${badgeTextColor} mb-2`}
              >
                {notif.tipo}
              </span>

              {/* Mensaje */}
              <span className="text-sm font-medium text-foreground/90 mb-2">{notif.mensaje}</span>

              {/* Remitente y fecha */}
              <div className="flex justify-between items-center gap-2 text-xs font-light text-muted-foreground">
                {notif.remitente && <span className="italic">De: {notif.remitente}</span>}
                <span>{new Date(notif.fecha).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      );
    })}
</PopoverContent>











</Popover>


<Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="group relative text-foreground font-medium flex items-center gap-2.5 px-4 py-2 rounded-full
                                         bg-background/60 border-2 border-border
                                        hover:border-accent hover:bg-background/90
                                         transition-all duration-200 w-[200px] justify-between"
        >
                    <span className="flex items-center gap-2 truncate">
                      {selectedLanguage ? (
                                      <>
                <span className="text-base leading-none">{selectedLanguage.flag}</span>
                <span className="text-sm">{selectedLanguage.label}</span>
              </>            ) : (
                <span className="text-sm text-muted-foreground">{t("header.language.placeholder")}</span>
            )}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0 bg-card border border-border rounded-xl shadow-md">
        <Command className="w-full bg-card rounded-2xl"> 
          <CommandInput className="w-full h-9 px-3 text-sm border-b border-border/70 bg-card placeholder:text-muted-foreground/70 focus-visible:outline-none" placeholder="Buscar idioma..." />
          <CommandList>
            <CommandEmpty className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm">Idioma no encontrado.</CommandEmpty>
            <CommandGroup>
              {idiomas.map((idioma) => (
                <CommandItem
                  key={idioma.value}
                  value={idioma.value}
                  onSelect={(currentValue) => {
                    i18n.changeLanguage(currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                         cursor-pointer"
                >
                  <CheckIcon
                    className={cn(
                      "mr-1.5 h-4 w-4 text-primary",
                      value === idioma.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {idioma.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

          {/* Usuario Desktop */}
          <div className="hidden lg:block">
            <Menubar className="bg-transparent border-none shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="group
          relative
          flex items-center justify-between gap-3
          px-4 py-2
          rounded-full
          text-sm font-medium text-foreground
          bg-background/60 border-2 border-border
          hover:bg-background/90 hover:border-accent
          data-[state=open]:border-accent data-[state=open]:bg-background
          transition-all duration-200">
                  <Avatar className="h-8 w-8 border-2 border-border">
                    <AvatarImage src={""} alt={""} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                      {user?.nombre
                        ? user.nombre
                            .split(" ").map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block text-left">
                    <div className="text-sm font-medium">{user?.nombre ?? t("header.guest")}</div>
                    <div className="text-xs text-muted-foreground">{user?.correo ?? ""}</div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200" />
                </MenubarTrigger>
                <MenubarContent className="bg-card/95 border border-border rounded-2xl p-2 min-w-[240px] shadow-xl">
                  {userItems.filter(i => i.show).map(item => (
                      <MenubarItem key={item.href} asChild>
                        
                        <Link
                          to={item.href}
                          onClick={() => item.action && item.action()}
                          className="flex items-start gap-3 py-2.5 px-3 rounded-xl text-sm text-foreground/90 hover:text-foreground hover:bg-chart-2/60 transition-all duration-200 group"
                        >
                          <div
                            className="mt-0.5 p-2 rounded-lg bg-chart-5/75 group-hover:bg-chart-5/90 transition-colors duration-200 flex items-center justify-center"
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium group-hover:font-semibold transition-all duration-150">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Menú Móvil */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden inline-flex items-center justify-center p-2 rounded-full bg-muted/80 hover:bg-muted transition-all duration-200 active:scale-95">
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-sidebar/98 backdrop-blur-xl text-sidebar-foreground border-sidebar-border w-80"
            >
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
                <div className="p-4 bg-sidebar/80 rounded-lg border border-sidebar-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-sidebar-border">
                      <AvatarImage src={"hj"} alt={""} />
                      <AvatarFallback className="bg-gradient-to-br from-sidebar-primary to-sidebar-accent text-sidebar-primary-foreground">
                        IG
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{/* user?.name */}</div>
                      <div className="text-sm text-muted-foreground">
                        {/* user?.email */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones rápidas móvil */}
                <div className="flex gap-2">
                  <Link
                    to="/cart"
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-accent/15 rounded-lg hover:bg-accent/25 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm">Carrito</span>
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      3
                    </Badge>
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-secondary/15 rounded-lg hover:bg-secondary/25 transition-colors">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Notif.</span>
                    <Badge className="bg-destructive text-destructive-foreground text-xs">
                      2
                    </Badge>
                  </button>
                </div>

                {/* Menús móvil */}
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
                          <div className="p-1.5 rounded-md bg-primary/15 group-hover:bg-primary/25 transition-colors">
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
                          <div className="p-1.5 rounded-md bg-secondary/15 group-hover:bg-secondary/25 transition-colors mt-0.5">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </div>
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
                          <div
                            className={`p-1.5 rounded-md transition-colors mt-0.5 ${
                              item.title === "Login" || item.title === "Registrarse"
                                ? "bg-chart-5/20 group-hover:bg-chart-5/30"
                                : "bg-accent/20 group-hover:bg-accent/30"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={() => setMobileOpen(false)}
                        className="w-full flex items-start gap-3 py-3 px-4 rounded-lg text-destructive hover:bg-destructive/15 hover:text-destructive transition-all duration-200 group"
                      >
                        <div className="p-1.5 rounded-md bg-destructive/15 group-hover:bg-destructive/25 transition-colors mt-0.5">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Cerrar Sesión</div>
                          <div className="text-xs text-destructive/70 mt-0.5">
                            Salir del sistema
                          </div>
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