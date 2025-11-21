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
  Trash2
} from "lucide-react";
import TicketService from "@/services/TicketService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";

const ticketColumns = [
  { key: "titulo", label: "Título" },
  { key: "usuarioSolicitante", label: "Solicitante" },
  { key: "fechaCreacion", label: "Fecha Creación" },
  { key: "actions", label: "Acciones" },
];

export default function TableTicket() {
  const [tickets, setTickets] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await TicketService.getListadoDetalle();
        const responseData = response?.data?.data || {};
        const ticketsArray = responseData.data || [];

        setTickets(Array.isArray(ticketsArray) ? ticketsArray : []);
        setUsuario(responseData.usuario || "");
        setRol(responseData.rol || "");
      } catch (err) {
        setError(err.message || "Error al cargar tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error" message={error} />;
  if (tickets.length === 0)
    return <EmptyState message="No se encontraron tickets." />;

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
              <h2 className="text-xl font-semibold text-foreground">{usuario}</h2>
              <Badge variant="secondary" className="mt-1">
                {rol}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total tickets</div>
            <div className="text-2xl font-bold text-foreground">{tickets.length}</div>
          </div>
        </div>
      </div>

      {/* Título */}
      <div className="mb-6 flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Listado de Tickets</h1>
        <p className="text-muted-foreground">Gestiona y revisa todos los tickets asignados</p>
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
                        <TooltipContent>Crear ticket</TooltipContent>
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
            {tickets.map((ticket) => (
              <TableRow 
                key={ticket.idTicket}
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
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {ticket.fechaCreacion}
                  </div>
                </TableCell>
                
                <TableCell className="py-4 px-6">
{/*                   <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                navigate(`/ticket/update/${ticket.id}`)
                                                }
                                                >
                                                <Edit className="h-4 w-4 text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Actualizar</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider> */}

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Eliminar</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-lg hover:bg-primary/10"
                          onClick={() => navigate(`/ticket/detail/${ticket.idTicket}`)}
                        >
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Ver detalle
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
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
        Regresar
      </Button>
    </div>
  );
}