import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

// UI (shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Servicios
import SlaService from "@/services/SlaService";
import EtiquetaService from "@/services/EtiquetaService";
import EspecialidadService from "@/services/EspecialidadService";
import CategoriasService from "@/services/CategoriasService";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";
import { useNavigate, useParams } from "react-router-dom";
import TicketService from "@/services/TicketService";

// Validación con Yup
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  idSLA: yup.number().typeError("Debe seleccionar un SLA").required("Debe seleccionar un SLA"),
  etiquetas: yup.array().min(1, "Seleccione al menos una etiqueta"),
  especialidades: yup.array().min(1, "Seleccione al menos una especialidad"),
});

export default function CreateTicket() {
  const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [ticket, setTicket] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [valoraciones, setValoraciones] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TicketService.createTicket();
                console.log("API Response:", response.data.data);

                if (response.data.success) {
                    const ticketData = response.data.data?.data?.ticket;
                    const historialData = response.data.data?.data?.historial || [];
                    const valoracionesData = response.data.data?.data?.valoraciones || [];

                    setTicket(ticketData);
                    setHistorial(Array.isArray(historialData) ? historialData : []);
                    setValoraciones(Array.isArray(valoracionesData) ? valoracionesData : []);
                } else {
                    setError(response.data.message || "Error desconocido");
                }
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar ticket" message={error} />;
    if (!ticket) return <EmptyState message="No se encontró información del ticket." />;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold">{ticket.titulo}</h1>

                {/* Card principal dividida en dos columnas */}
                <Card className="shadow-lg rounded-xl border">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-8">
                            {/* Lado izquierdo */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-white">ID Ticket:</span>
                                    <p className="text-white font-medium">{ticket.idTicket}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">Solicitante:</span>
                                    <p className="text-white font-medium">{ticket.usuarioSolicitante}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">Categoría:</span>
                                    <p className="text-white font-medium">{ticket.categoria}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">Fecha de creación:</span>
                                    <p className="text-white font-medium">{ticket.fechaCreacion}</p>
                                </div>
                            </div>

                            {/* Lado derecho */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">Estado:</span>
                                    <p className={`font-medium ${
                                        ticket.estado === "Asignado" ? "text-green-600" :
                                        ticket.estado === "Pendiente" ? "text-yellow-600" :
                                        "text-red-600"
                                    }`}>
                                        {ticket.estado}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">Prioridad:</span>
                                    <p className={`font-medium ${
                                        ticket.prioridad === "Alta" ? "text-red-600" :
                                        ticket.prioridad === "Media" ? "text-yellow-600" :
                                        "text-green-600"
                                    }`}>
                                        {ticket.prioridad}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">Fecha de cierre:</span>
                                    <p className="text-white font-medium">{ticket.fechaCierre || "—"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Descripción en toda la tarjeta */}
                        <div className="mt-6 border-t pt-4">
                            <span className="font-semibold text-white">Descripción:</span>
                            <p className="text-white mt-1">{ticket.descripcion}</p>
                        </div>
                    </CardContent>
                </Card>

              {/* Historial en tabla */}
<h2 className="text-2xl font-semibold mt-6 mb-4">Historial</h2>
{historial.length === 0 ? (
  <EmptyState message="No hay historial disponible." />
) : (
  <div className="rounded-md border overflow-x-auto">
    <Table>
      <TableHeader className="bg-primary/50">
        <TableRow>
          <TableHead>Estado Anterior</TableHead>
          <TableHead>Estado Nuevo</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Observaciones</TableHead>
          <TableHead>Imagen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historial.map((h) => (
          <TableRow key={h.idHistorial}>
            <TableCell>{h.estadoAnterior}</TableCell>
            <TableCell>{h.estadoNuevo}</TableCell>
            <TableCell>{h.fecha}</TableCell>
            <TableCell>{h.observaciones || "-"}</TableCell>
            <TableCell>
              {h.imagenes ? (
                h.imagenes.split(",").map((img, i) => (
                  <img
                    key={i}
                    src={`${BASE_URL}/${img}`}
                    alt="Evidencia"
                    className="w-20 h-20 object-cover rounded-md border inline-block mr-2"
                  />

                //   <img
                //     key={i}
                //     src={`${BASE_URL}/${h.data.historial.imagenes}`}
                //     alt="Evidencia"
                //     className="w-20 h-20 object-cover rounded-md border inline-block mr-2"
                //   />
                ))
              ) : (
                <span>-</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}



                {/* Valoraciones */}
                {/* Valoraciones en tabla */}
<h2 className="text-2xl font-semibold mt-6 mb-4">Valoraciones</h2>
{valoraciones.length === 0 ? (
    <EmptyState message="No hay valoraciones disponibles." />
) : (
    <div className="rounded-md border overflow-x-auto">
        <Table>
            <TableHeader className="bg-primary/50">
                <TableRow>
                    <TableHead>Puntaje</TableHead>
                    <TableHead>Comentario</TableHead>
                    <TableHead>Fecha</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {valoraciones.map((v, index) => (
                    <TableRow key={index}>
                        <TableCell>{v.puntaje}</TableCell>
                        <TableCell>{v.comentario}</TableCell>
                        <TableCell>{v.fecha}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
)}


                <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Regresar
                </Button>
            </div>
        </div>
    );
}
