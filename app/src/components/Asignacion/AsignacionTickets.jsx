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
import TecnicoService from "@/services/TecnicoService";


const ticketColumns = [
  { key: "titulo", label: "Título" },
  { key: "categoria", label: "Categoría" },
  { key: "prioridad", label: "Prioridad" },
  { key: "sla", label: "SLA" },
];

const tecnicoColumns = [
  { key: "nombre", label: "Nombre" },
  { key: "cargaTrabajo", label: "Carga de Trabajo" },
  { key: "disponibilidad", label: "Disponibilidad" },
  { key: "especialidad", label: "Especialidad" },
];

export default function AsignacionTickets() {
  const { user, isAuthenticated, clearUser, authorize } = useUser();
  const [tickets, setTickets] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTecnicoId, setSelectedTecnicoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const responseTickets = await TicketService.getTicketPendiente();
        const responseTecnicos = await TecnicoService.getListado();
        const responseData = responseTickets?.data?.data || {};
        console.log("Tickets recibidos:", responseData);
        setTickets(Array.isArray(responseData) ? responseData : []);
        const responseDataTecnicos = responseTecnicos?.data?.data || {};
        console.log("Tecnicos recibidos:", responseDataTecnicos);
        setTecnicos(Array.isArray(responseDataTecnicos) ? responseDataTecnicos : []);
      } catch (err) {
        setError(err.message || "Error al cargar tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const responseTickets = await TicketService.getTicketPendiente();
        const responseTecnicos = await TecnicoService.getListado();
        const responseData = responseTickets?.data?.data || {};
        console.log("Tickets recibidos:", responseData);
        setTickets(Array.isArray(responseData) ? responseData : []);
        const responseDataTecnicos = responseTecnicos?.data?.data || {};
        console.log("Tecnicos recibidos:", responseDataTecnicos);
        setTecnicos(Array.isArray(responseDataTecnicos) ? responseDataTecnicos : []);
      } catch (err) {
        setError(err.message || "Error al cargar tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTecnicos();
  }, []);

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error" message={error} />;
  if (tickets.length === 0)
    return <EmptyState message="No se encontraron tickets." />;

  const handleTicketSelect = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  const handleTecnicoSelect = (tecnicoId) => {
    setSelectedTecnicoId(tecnicoId);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Título */}
      <div className="mb-6 flex items-center justify-between max-w-6xl mx-auto">
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
      <div className="flex gap-6">
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
                  <TableCell className="py-4">
                    <div className="font-medium text-foreground">
                      <input
                        type="radio"
                        name="ticket"
                        value={ticket.id}
                        checked={selectedTicketId === ticket.id}
                        onChange={() => handleTicketSelect(ticket.id)}
                      />
                      {ticket.titulo}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 ">{ticket.categoria}</TableCell>
                  <TableCell className="py-4 ">{ticket.prioridad}</TableCell>
                  <TableCell className="py-4 ">    
                    <div className="flex flex-col gap-2">
                    <Badge>{ticket.cumplimientoResolucion}</Badge>
                    <Badge>{ticket.cumplimientoRespuesta}</Badge>
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
            {tecnicos.map((tecnico) => (
                <TableRow
                  key={tecnico.id}
                  className="hover:bg-muted/30 transition-colors duration-150"
                >
                  <TableCell className="py-4 ">
                    <div className="font-medium text-foreground">
                      <input
                        type="radio"
                        name="tecnico"
                        value={tecnico.id}
                        checked={selectedTecnicoId === tecnico.id}
                        onChange={() => handleTecnicoSelect(tecnico.id)}
                      />
                      {tecnico.nombre}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 ">{tecnico.cargaTrabajo}</TableCell>
                  <TableCell className="py-4 ">{tecnico.disponibilidad}</TableCell>
                  <TableCell className="py-4 ">  
                      <div className="flex flex-col gap-2">
    {Array.isArray(tecnico.especialidades) ? (
      tecnico.especialidades.map((esp, index) => (
        <Badge key={index}>{esp.nombre}</Badge>
      ))
    ) : (
      <Badge>{tecnico.especialidades?.nombre ?? "Sin especialidad"}</Badge>
    )}
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