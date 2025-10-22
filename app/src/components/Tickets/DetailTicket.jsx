import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TicketService from '../../services/TicketService';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';

export function DetailTicket() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TicketService.getTicketById(id);
                console.log("API Response:", response.data);

                if (response.data.success) {
                    const ticketData = response.data.data?.data?.ticket;
                    const historialData = response.data.data?.data?.historial || [];

                    setTicket(ticketData);
                    setHistorial(historialData);
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
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold">{ticket.titulo}</h1>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex gap-4">
                            <span className="font-semibold">ID Ticket:</span>
                            <p className="text-muted-foreground">{ticket.idTicket}</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-semibold">Descripción:</span>
                            <p className="text-muted-foreground">{ticket.descripcion}</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-semibold">Solicitante:</span>
                            <p className="text-muted-foreground">{ticket.usuarioSolicitante}</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-semibold">Categoría:</span>
                            <p className="text-muted-foreground">{ticket.categoria}</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-semibold">Estado:</span>
                            <p className="text-muted-foreground">{ticket.estado}</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-semibold">Prioridad:</span>
                            <p className="text-muted-foreground">{ticket.prioridad}</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-semibold">Fecha de creación:</span>
                            <p className="text-muted-foreground">{ticket.fechaCreacion}</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-semibold">Fecha de cierre:</span>
                            <p className="text-muted-foreground">{ticket.fechaCierre}</p>
                        </div>
                    </CardContent>
                </Card>

                <h2 className="text-2xl font-semibold mt-6">Historial</h2>
                {historial.length === 0 ? (
                    <EmptyState message="No hay historial disponible." />
                ) : (
                    historial.map((h) => (
                        <Card key={h.idHistorial}>
                            <CardContent className="p-4 space-y-2">
                                <div className="flex gap-4">
                                    <span className="font-semibold">Estado anterior:</span>
                                    <p>{h.estadoAnterior}</p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-semibold">Estado nuevo:</span>
                                    <p>{h.estadoNuevo}</p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-semibold">Fecha:</span>
                                    <p>{h.fecha}</p>
                                </div>
                                {h.observaciones && (
                                    <div className="flex gap-4">
                                        <span className="font-semibold">Observaciones:</span>
                                        <p>{h.observaciones}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
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
