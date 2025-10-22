import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MovieService from '../../services/TecnicoService';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Check, X, ArrowLeft } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';

export function DetailTecnico() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tecnico, setTecnico] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MovieService.getDetalleTecnico(id);
                console.log(response.data);
                if (response.data.success) {
                    setTecnico(response.data.data); // guardamos directamente el objeto técnico
                } else {
                    setError(response.data.message);
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
    if (error) return <ErrorAlert title="Error al cargar técnico" message={error} />;
    if (!tecnico) return <EmptyState message="No se encontró información del técnico." />;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold">{tecnico.nombreUsuario}</h1>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <User className="h-5 w-5 text-primary" />
                            <span className="font-semibold">Correo:</span>
                            <p className="text-muted-foreground">{tecnico.correoUsuario}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Disponibilidad:</span>
                            {tecnico.disponibilidad === "1" ? (
                                <Check className="text-green-600" />
                            ) : (
                                <X className="text-red-600" />
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Carga de trabajo:</span>
                            <p className="text-muted-foreground">{tecnico.cargaTrabajo}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Especialidades:</span>
                            <p className="text-muted-foreground">{tecnico.especialidades}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">ID Técnico:</span>
                            <p className="text-muted-foreground">{tecnico.idTecnico}</p>
                        </div>
                    </CardContent>
                </Card>

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
