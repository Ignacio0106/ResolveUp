import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, ArrowLeft } from "lucide-react";
import TicketService from "@/services/TicketService"; // tu servicio
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
  const { id } = useParams(); // idUsuario desde la URL
  const [tickets, setTickets] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await TicketService.getListadoDetalle(id);
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
  }, [id]);

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error" message={error} />;
  if (tickets.length === 0)
    return <EmptyState message="No se encontraron tickets." />;

  return (
    <div className="container mx-auto py-8">
      {/* Usuario y rol centrado y grande */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">{usuario}</h2>
        <p className="text-lg font-medium text-white">{rol}</p>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-6">Listado de Tickets</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary/50">
            <TableRow>
              {ticketColumns.map((column) => (
                <TableHead key={column.key} className="text-left font-semibold">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.idTicket}>
                <TableCell className="font-medium">{ticket.titulo}</TableCell>
                <TableCell>{ticket.usuarioSolicitante}</TableCell>
                <TableCell>{ticket.fechaCreacion}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/ticket/detail/${ticket.idTicket}`)
                          }
                        >
                          <ArrowRight className="h-4 w-4 text-green-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver detalle</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar
      </Button>
    </div>
  );
}
