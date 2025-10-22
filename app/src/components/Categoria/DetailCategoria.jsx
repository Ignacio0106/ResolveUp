import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoriaService from '../../services/CategoriasService';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';

export function DetailCategoria() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categoria, setCategoria] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await CategoriaService.getDetalleCategoria(id);
                console.log(response.data);
                if (response.data.success) {
                    setCategoria(response.data.data); 
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
    if (error) return <ErrorAlert title="Error al cargar categoría" message={error} />;
    if (!categoria) return <EmptyState message="No se encontró información de la categoría." />;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-bold">{categoria.nombreCategoria}</h1>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">ID Categoría:</span>
                            <p className="text-muted-foreground">{categoria.idCategoria}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Tiempo máximo de respuesta:</span>
                            <p className="text-muted-foreground">{categoria.tiempoMaxRespuesta} minutos</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Tiempo máximo de resolución:</span>
                            <p className="text-muted-foreground">{categoria.tiempoMaxResolucion} minutos</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Especialidades:</span>
                            <p className="text-muted-foreground">{categoria.especialidades}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Etiquetas:</span>
                            <p className="text-muted-foreground">{categoria.etiquetas}</p>
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
