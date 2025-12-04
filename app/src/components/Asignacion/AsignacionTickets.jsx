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


const ticketColumns = [
  { key: "titulo", label: "Título" },
  { key: "categoria", label: "Categoría" },
  { key: "prioridad", label: "Prioridad" },
  { key: "sla", label: "SLA" },
];

const tecnicoColumns = [
  { key: "nombre", label: "Título" },
  { key: "cargaTrabajo", label: "Carga de Trabajo" },
  { key: "disponibilidad", label: "Disponibilidad" },
  { key: "especialidad", label: "Especialidad" },
];

export default function AsignacionTickets() {
  const { user, isAuthenticated, clearUser, authorize } = useUser();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        console.log("Usuario ID:", user?.id || 1);
        const response = await TicketService.getTicketPendiente();
        console.log("Respuesta de tickets:", response);
        const responseData = response?.data?.data || {};
        console.log("Datos de tickets:", responseData);


        setTickets(Array.isArray(responseData) ? responseData : []);
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
      {/* Título */}
      <div className="mb-6 flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Asignar Tickets</h1>
        </div>
        <div className="flex gap-5">
         <Button
                type="button"
                className="flex items-center gap-2 text-white hover:bg-primary/80 mt-6"
                onClick={() => navigate(-1)}
            >
                Asignar automaticamente
            </Button>
         <Button
                type="button"
                className="flex items-center gap-2 text-white hover:bg-primary/80 mt-6"
                onClick={() => navigate(-1)}
            >

                Asignar manualmente
            </Button>
            </div>
      </div>

      {/* Tabla Simple */}
      <div className="flex">
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
                key={ticket.id}
                className="hover:bg-muted/30 transition-colors duration-150"
              >
                <TableCell className="py-4 px-6">
                  <div className="font-medium text-foreground">
                    {ticket.titulo}
                  </div>
                </TableCell>
                
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 text-foreground">
                    {ticket.categoria}    
                  </div>
                </TableCell>

                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 text-foreground">
                    {ticket.prioridad}    
                  </div>
                </TableCell>
                
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 text-foreground">
                    {ticket.tiempoRespuesta}    
                  </div>
                </TableCell>
                
           
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {tecnicoColumns.map((column) => (
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
                key={ticket.id}
                className="hover:bg-muted/30 transition-colors duration-150"
              >
                <TableCell className="py-4 px-6">
                  <div className="font-medium text-foreground">
                    {ticket.titulo}
                  </div>
                </TableCell>
                
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 text-foreground">
                    {ticket.categoria}    
                  </div>
                </TableCell>

                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 text-foreground">
                    {ticket.prioridad}    
                  </div>
                </TableCell>
                
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 text-foreground">
                    {ticket.sla}    
                  </div>
                </TableCell>
                
           
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </div>
      {/* Botón Simple */}
      <Button
        variant="outline"
        className="flex items-center gap-2 text-white hover:bg-primary/80 mt-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar
      </Button>
    </div>
  );
}