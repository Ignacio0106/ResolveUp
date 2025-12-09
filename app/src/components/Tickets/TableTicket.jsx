import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  ArrowLeft, 
  User, 
  Calendar,
  Ticket,
  Eye,
  FileText,
  Plus,
  Edit,
  Trash2,
  ListTodo
} from "lucide-react";
import TicketService from "@/services/TicketService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import { useUser } from "@/hooks/useUser";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";




export default function TableTicket() {
  const { user } = useUser();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {t} = useTranslation();
  const ticketColumns = [
  { key: "titulo", label: t("ticket.columns.titulo") },
  { key: "usuarioSolicitante", label: t("ticket.columns.solicitante") },
  { key: "estado", label: t("ticket.columns.estado") },
  { key: "actions", label: t("ticket.columns.acciones") },
];
const mostrarActualizar = (rol, estado) => {
  if (rol === "Administrador") {
    return ["Resuelto", "Cerrado"].includes(estado);
  }

  if (rol === "Técnico") {
    return ["Asignado", "En Proceso"].includes(estado);
  }

  if (rol === "Cliente") {
    return ["Resuelto", "Cerrado"].includes(estado);
  }

  return false;
};


  useEffect(() => {
    if (!user?.id) return;
    const fetchTickets = async () => {
      try {
        const response = await TicketService.getTicketsByUsuario(user.id);
        const lista = response?.data?.data ?? [];
        setTickets(lista ? lista : []);
        if(!response.data.success){
          toast.error(response.data.message);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setTickets([]);
        } else {
          setError(err.message || "Error al cargar tickets");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error" message={error} />;
/*   if (tickets.length === 0)
    return <EmptyState message={t("ticket.noTicketsFound")} />;
 */
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Simple y Limpio */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user?.nombre || "Usuario"}</h2>
              <Badge variant="secondary" className="mt-1">
                {user?.rol?.nombre || "Rol"}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">{t("ticket.totalTickets")}</div> 
            <div className="text-2xl font-bold text-foreground">{tickets.length}</div>
          </div>
        </div>
      </div>

      {/* Título */}
      <div className="mb-6 flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("ticket.listTitle")}</h1>
        <p className="text-muted-foreground">{t("ticket.listSubtitle")}</p>
        </div>
              <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="icon" className="text-primary">
                                <Link to="/ticket/create">
                                    <Plus className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("ticket.tooltip.create")}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
      </div>

      {/* Tabla Simple */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {ticketColumns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className="font-semibold text-foreground py-4 px-6"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={ticketColumns.length} className="text-center py-6">
                    No tienes tickets creados
                  </TableCell>
                </TableRow>
              ) : (
              tickets.map((ticket) => (
              <TableRow 
                key={ticket.id}
                className="hover:bg-muted/30 transition-colors duration-150"
              >
                <TableCell className="py-4 px-6">
                  <div className="font-medium text-foreground">
                    {ticket.titulo}
                  </div>
                </TableCell>
                
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {ticket.usuarioSolicitante?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-foreground">{ticket.usuarioSolicitante}</span>
                  </div>
                </TableCell>
                
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 text-foreground">
                    {ticket.estado}
{/*                     ticket.fechaCreacion
    ? new Date(ticket.fechaCreacion).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '' */}
    
                  </div>
                </TableCell>
                
                <TableCell className="py-4 px-6">
                    {mostrarActualizar(user?.rol?.nombre, ticket.estado) && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/ticket/update/${ticket.id}`)}
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("ticket.tooltip.update")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )}
                                  <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{t("ticket.tooltip.delete")}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-lg hover:bg-primary/10"
                          onClick={() => navigate(`/ticket/detail/${ticket.id}`)}
                        >
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("ticket.tooltip.detail")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Botón Simple */}
      <Button
        variant="outline"
        className="mt-6 gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("technician.list.backButton")}
      </Button>
    </div>
  );
}