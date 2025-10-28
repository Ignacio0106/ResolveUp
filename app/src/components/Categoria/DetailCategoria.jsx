import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoriaService from '../../services/CategoriasService';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';
import { ChevronRight } from "lucide-react"; 
import { Badge } from "@/components/ui/badge"; 


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
  <h1 className="text-4xl font-bold mb-8">{categoria.nombreCategoria}</h1>

  <Card>
    <CardContent className="p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* IZQUIERDA: Datos generales */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="font-semibold">ID Categoría:</span>
            <span className="text-muted-foreground">{categoria.idCategoria}</span>
          </div>
          <div className="flex gap-2">
  <span className="font-semibold">Tiempo máximo de respuesta:</span>
  <span className="text-muted-foreground">{categoria.tiempoMaxRespuesta} min</span>
</div>
<div className="flex gap-2">
  <span className="font-semibold">Tiempo máximo de resolución:</span>
  <span className="text-muted-foreground">{categoria.tiempoMaxResolucion} min</span>
</div>

        </div>

        {/* DERECHA: Especialidades y Etiquetas */}
        <div className="space-y-6">
          {categoria.especialidades && categoria.especialidades.length > 0 && (
            <div>
              <span className="font-semibold mb-2 block">Especialidades:</span>
              <div className="flex flex-wrap gap-2">
                {categoria.especialidades.map((esp) => (
                  <Badge
                    key={esp.idEspecialidad}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {esp.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {categoria.etiquetas && categoria.etiquetas.length > 0 && (
            <div>
              <span className="font-semibold mb-2 block">Etiquetas:</span>
              <div className="flex flex-wrap gap-2">
                {categoria.etiquetas.map((et) => (
                  <Badge
                    key={et.idEtiqueta}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {et.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
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

    );
}
