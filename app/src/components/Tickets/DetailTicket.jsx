import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TicketService from '../../services/TicketService';
import ValoracionService from '@/services/ValoracionService';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { useUser } from '@/hooks/useUser';

export function DetailTicket() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const { user } = useUser();

    const [ticket, setTicket] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [valoraciones, setValoraciones] = useState([]);
    const [puntajes, setPuntajes] = useState([]); // Para el combo dinámico
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNewValoracion, setShowNewValoracion] = useState(false);
    const [newValoracion, setNewValoracion] = useState({
        idPuntaje: "",
        comentario: ""
    });

    // Fetch ticket y datos relacionados
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TicketService.getTicketById(id);
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

    // Fetch puntajes desde backend
    useEffect(() => {
        const fetchPuntajes = async () => {
            try {
                const res = await ValoracionService.getPuntajes(); // Endpoint que devuelve la tabla PuntajeValoracion
                setPuntajes(res.data.data); // [{id:1, descripcion:"1"}, ...]
            } catch (err) {
                console.error(err);
                toast.error("Error al cargar puntajes");
            }
        };
        fetchPuntajes();
    }, []);

    const createNewValoracion = async () => {
    if (!newValoracion.idPuntaje) {
        return toast.error("Debes seleccionar un puntaje");
    }

    try {
        // Crear la valoración en el backend
        await ValoracionService.createValoracion({
            idTicket: ticket.idTicket,
            idUsuario: user?.id,
            idPuntaje: Number(newValoracion.idPuntaje),
            comentario: newValoracion.comentario
        });

        toast.success("Valoración agregada con éxito");

        // Volver a cargar todo el ticket con valoraciones y historial actualizado
        const response = await TicketService.getTicketById(id);
        if (response.data.success) {
            const ticketData = response.data.data?.data?.ticket;
            const historialData = response.data.data?.data?.historial || [];
            const valoracionesData = response.data.data?.data?.valoraciones || [];

            setTicket(ticketData);
            setHistorial(Array.isArray(historialData) ? historialData : []);
            setValoraciones(Array.isArray(valoracionesData) ? valoracionesData : []);
        }

        // Limpiar form
        setNewValoracion({ idPuntaje: "", comentario: "" });
        setShowNewValoracion(false);

    } catch (err) {
        console.error(err);
        toast.error("Este ticket ya tiene una valoración");
    }
};


    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title={t("ticket.errorTitle")} message={error} />;
    if (!ticket) return <EmptyState message={t("ticket.infTickets")} />;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold">{ticket.titulo}</h1>

                {/* Card principal dividida en dos columnas */}
                <Card className="shadow-lg rounded-xl border">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Lado izquierdo */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground">ID Ticket:</span>
                                    <p className="text-foreground font-medium">{ticket.idTicket}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.columns.solicitante")}</span>
                                    <p className="text-foreground font-medium">{ticket.usuarioSolicitante}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.categoria")}</span>
                                    <p className="text-foreground font-medium">{ticket.categoria}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.fechaCreacion")}</span>
                                    <p className="text-foreground font-medium">{ticket.fechaCreacion}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.slaRespuesta") || "SLA de respuesta"}</span>
                                    <p className="text-foreground font-medium">{ticket.slaRespuesta ? `${ticket.slaRespuesta} min` : "—"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.fechaLimiteRespuesta") || "Fecha límite respuesta"}</span>
                                    <p className="text-foreground font-medium">{ticket.fechaLimiteRespuesta || "—"}</p>
                                </div>
                            </div>

                            {/* Lado derecho */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.columns.estado")}</span>
                                    <p className={`font-medium ${
                                        ticket.estado === "Asignado" ? "text-green-600" :
                                        ticket.estado === "Pendiente" ? "text-yellow-600" :
                                        "text-red-600"
                                    }`}>{ticket.estado}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.prioridad")}</span>
                                    <p className={`font-medium ${
                                        ticket.prioridad === "Alta" ? "text-red-600" :
                                        ticket.prioridad === "Media" ? "text-yellow-600" :
                                        "text-green-600"
                                    }`}>{ticket.prioridad}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.fechaCierre")}</span>
                                    <p className="text-foreground font-medium">{ticket.fechaCierre || "—"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.slaResolucion") || "SLA de resolución"}</span>
                                    <p className="text-foreground font-medium">{ticket.slaResolucion ? `${ticket.slaResolucion} min` : "—"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{t("ticket.fechaLimiteResolucion") || "Fecha límite resolución"}</span>
                                    <p className="text-foreground font-medium">{ticket.fechaLimiteResolucion || "—"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="mt-6 border-t pt-4">
                            <span className="font-semibold text-foreground">{t("ticket.descripcion")}</span>
                            <p className="text-foreground mt-1">{ticket.descripcion}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Historial */}
                <h2 className="text-2xl font-semibold mt-6 mb-4">{t("ticket.historial")}</h2>
                {historial.length === 0 ? (
                    <EmptyState message="No hay historial disponible." />
                ) : (
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-primary/50">
                                <TableRow>
                                    <TableHead>{t("ticket.estadoAnt")}</TableHead>
                                    <TableHead>{t("ticket.estadoNue")}</TableHead>
                                    <TableHead>{t("ticket.fecha")}</TableHead>
                                    <TableHead>{t("ticket.observaciones")}</TableHead>
                                    <TableHead>{t("ticket.imagen")}</TableHead>
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
                                                    <img key={i} src={`${BASE_URL}/${img}`} alt="Evidencia" className="w-20 h-20 object-cover rounded-md border inline-block mr-2"/>
                                                ))
                                            ) : <span>-</span>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Valoraciones */}
                {ticket.estado === "Cerrado" && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Valoraciones</h2>
                        <Button type="button" variant="outline" size="icon" onClick={() => setShowNewValoracion(!showNewValoracion)}>+</Button>
                    </div>
                )}
                {showNewValoracion && (
                    <div className="grid grid-cols-2 gap-2 mb-4 p-3 border rounded-lg bg-muted/30">
                        {/* Combo dinámico de puntajes */}
                        <select
                            value={newValoracion.idPuntaje}
                            onChange={(e) => setNewValoracion({ ...newValoracion, idPuntaje: e.target.value })}
                            className="border p-2 rounded"
                        >
                            <option value="">Selecciona un puntaje</option>
                            {puntajes.map(p => (
                                <option key={p.id} value={p.id}>{p.descripcion}</option>
                            ))}
                        </select>

                        {/* Comentario */}
                        <Input
                            placeholder="Comentario"
                            type="text"
                            value={newValoracion.comentario}
                            onChange={(e) => setNewValoracion({ ...newValoracion, comentario: e.target.value })}
                        />

                        <Button className="col-span-2" type="button" onClick={createNewValoracion}>
                            Guardar valoración
                        </Button>
                    </div>
                )}


                {valoraciones.length === 0 ? (
                    <EmptyState message="No hay valoraciones disponibles." />
                ) : (
                    
                    <div className="rounded-md border overflow-x-auto">
                        
                        <Table>
                            <TableHeader className="bg-primary/50">
                                <TableRow>
                                    <TableHead>{t("ticket.Punt")}</TableHead>
                                    <TableHead>{t("ticket.Come")}</TableHead>
                                    <TableHead>{t("ticket.fecha")}</TableHead>
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
                    <ArrowLeft className="w-4 h-4"/>
                    {t("technician.list.backButton")}
                </Button>
            </div>
        </div>
    );
}
