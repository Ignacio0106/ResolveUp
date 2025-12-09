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
import EspecialidadService from "@/services/EspecialidadService";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";


export default function AsignacionTickets() {
  const { user, isAuthenticated, clearUser, authorize } = useUser();
  const [tickets, setTickets] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicosByTicket, setTecnicosByTicket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTecnicoId, setSelectedTecnicoId] = useState(null);
  const [justificacion, setJustificacion] = useState("");
  const { t } = useTranslation();
  
  const navigate = useNavigate();


  const ticketColumns = [
  { key: "titulo", label: t("asignacionesTickets.columns.ticketTitle") },
  { key: "categoria", label: t("asignacionesTickets.columns.ticketCategory") },
  { key: "prioridad", label: t("asignacionesTickets.columns.ticketPriority") },
  { key: "sla", label: t("asignacionesTickets.columns.ticketSla") },
];

const tecnicoColumns = [
  { key: "nombre", label: t("asignacionesTickets.columns.technicianName") },
  { key: "cargaTrabajo", label: t("asignacionesTickets.columns.technicianWorkload") },
  { key: "disponibilidad", label: t("asignacionesTickets.columns.technicianAvailability") },
  { key: "especialidad", label: t("asignacionesTickets.columns.technicianSpecialty") },
];

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const responseTickets = await TicketService.getTicketPendiente();
        const responseTecnicos = await TecnicoService.getListado();
        console.log("Response tickets pendientes1: ", responseTickets);
        const responseData = responseTickets?.data?.data || {};
        console.log("Response data tickets pendientes2: ", responseData);
        setTickets(responseData);
        const responseDataTecnicos = responseTecnicos?.data?.data || {};
        setTecnicos(responseDataTecnicos);
        setTecnicosByTicket(responseDataTecnicos);
      } catch (err) {
        toast.error(err.message || "Error al cargar tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

useEffect(() => {
  const fetchTecnicosPorCategoria = async () => {
    try {
      if (!selectedTicketId || selectedTicketId == null) return;
      
      console.log("Vuelve a entrar por aqui: ", selectedTicketId);
      const ticketSeleccionado = tickets.find(
        (t) => t.id === selectedTicketId
      );

      const especialidadesTicket = await EspecialidadService.getByCategoria(ticketSeleccionado.idCategoria);
      let tecnicosByTicket = new Set();
      tecnicos.forEach(tecnico => {
        if(tecnico.especialidades){
          tecnico.especialidades.forEach(espTecnico => {
            especialidadesTicket.data.data.forEach(espTicket => {
              if(espTicket.id === espTecnico.id){
                tecnicosByTicket.add(tecnico);
              }
            });
          });
        }
      });
      setTecnicosByTicket(Array.from(tecnicosByTicket));

    } catch (err) {
      toast.error(err.message || "Error al cargar técnicos por categoría");
    }
  };

  fetchTecnicosPorCategoria();
}, [selectedTicketId, tickets, tecnicos]);



  if (loading) return <LoadingGrid type="grid" />;
/*   if (tickets.length === 0)
    return <EmptyState message={t("asignacionesTickets.noTicketsFound")} />; */

  const TicketSeleccionado = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  const TecnicoSeleccionado = (tecnicoId) => {
    setSelectedTecnicoId(tecnicoId);
  };

  const AsignarManual = async () => {
  try {
    if (!selectedTicketId) {
      toast.error(t("asignacionesTickets.mustSelectPendingTicket"));
      return;
    }

    if (!selectedTecnicoId) {
      toast.error(t("asignacionesTickets.mustSelectTechnician"));
      return;
    }

    if (!justificacion.trim()) {
      toast.error(t("asignacionesTickets.mustEnterJustification"));
      return;
    }

    const datos = {
      idTicket: selectedTicketId,
      idTecnico: selectedTecnicoId,
      justificacion: justificacion,
      idUsuarioAsignador: user.id,
      fecha: new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Costa_Rica'}))
    };
    console.log("Datos para asignación manual:", datos);
    const response = await TicketService.asignarManual(datos);
    console.log("que devolvio asignar", response)
    if (response.data?.success) {
      toast.success(response.data.message || t("asignacionesTickets.successManualAssignment"));

      // Refrescar lista de tickets pendientes
      const responseTickets = await TicketService.getTicketPendiente();
      console.log("Response tickets pendientes after assignment: ", responseTickets);
      const responseData = responseTickets?.data?.data || [];

      const responseTecnicos = await TecnicoService.getListado();
      const responseDataTecnicos = responseTecnicos?.data?.data || [];

      // Limpiar selección
setSelectedTicketId(null);
setSelectedTecnicoId(null);
setJustificacion("");

setTickets(responseData);
setTecnicosByTicket(responseDataTecnicos);
    } else {
      toast.error(response.data?.message || t("asignacionesTickets.errorManualAssignment"));
    }
  } catch (err) {
    toast.error(err.message || t("asignacionesTickets.errorManualAssignment"));
  }
};

  return (
    <div className="container mx-auto py-8">
      {/* Título */}
      <div className="mb-6 flex items-center justify-between max-w-6xl mx-auto">
        <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("asignacionesTickets.title")}</h1>
        </div>
        <div className="flex gap-5">
         <Button
  type="button"
  className="flex items-center gap-2 text-white hover:bg-primary/80 mt-6"
  onClick={AsignarManual}
>
  {t("asignacionesTickets.buttons.assignManual")}
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
            {tickets.length === 0 ? (
    <TableRow>
      <TableCell colSpan={ticketColumns.length} className="text-center py-6">
        No hay tickets pendientes
      </TableCell>
    </TableRow>
  ) : (
  tickets.map((ticket) => (
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
                        onChange={() => TicketSeleccionado(ticket.id)}
                      />
                      {ticket.titulo}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 ">{ticket.categoria}</TableCell>
                  <TableCell className="py-4 ">{ticket.prioridad}</TableCell>
                  <TableCell className="py-4 ">    
                    <div className="flex flex-col gap-2">
                    <Badge>{ticket.slaRespuesta}</Badge>
                    <Badge>{ticket.slaResolucion}</Badge>
                    </div>
                    </TableCell>
                </TableRow>
              ))
              )}
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
            {tecnicosByTicket.length === 0 ? (
    <TableRow>
      <TableCell colSpan={tecnicoColumns.length} className="text-center py-6">
        Selecciona un ticket para ver técnicos disponibles
      </TableCell>
    </TableRow>
  ) : (tecnicosByTicket.map((tecnico) => (
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
                        onChange={() => TecnicoSeleccionado(tecnico.id)}
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
              ))
              )}
          </TableBody>
        </Table>
      </div>
      </div>
      <div className="mt-4 max-w-6xl mx-auto">
  <label className="block text-sm font-medium mb-1">
    {t("asignacionesTickets.fields.justificationLabel")}
  </label>
  <textarea
    className="w-full border rounded-md p-2 text-sm"
    rows={3}
    value={justificacion}
    onChange={(e) => setJustificacion(e.target.value)}
    placeholder={t("asignacionesTickets.fields.justificationPlaceholder")}
  />
</div>

      {/* Botón Simple */}
      <Button
        variant="outline"
        className="flex items-center gap-2 text-white hover:bg-primary/80 mt-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("asignacionesTickets.buttons.back")}
      </Button>
    </div>
  );
}