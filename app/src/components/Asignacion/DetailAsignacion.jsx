import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';
import { ChevronRight } from "lucide-react"; 
import { Badge } from "@/components/ui/badge"; 
import AsignacionService from '@/services/AsignacionService';


export function DetailAsignacion() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [asignacion, setAsignacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AsignacionService.getDetalleAsignacion(id);
                console.log(response.data);
                if (response.data.success) {
                    setAsignacion(response.data.data);
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
    if (error) return <ErrorAlert title="Error al cargar asignación" message={error} />;
    if (!asignacion) return <EmptyState message="No se encontró información de la asignación." />;

    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
  <h1 className="text-4xl font-bold">{asignacion.descripcion}</h1>
  <p><strong>Fecha:</strong> {asignacion.fecha}</p>

  {console.log(asignacion)}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    <Card>
    <CardContent>
      <h2 className="text-2xl font-bold mb-4">Información del Ticket</h2>
    </CardContent>
    <CardContent>
      <p><strong>Título:</strong> {asignacion.ticket.data.ticket.titulo}</p>
      <p><strong>Descripción:</strong> {asignacion.ticket.data.ticket.descripcion}</p>
      <p><strong>Categoria:</strong> {asignacion.ticket.data.ticket.categoria}</p>
      <p><strong>Prioridad:</strong> {asignacion.ticket.data.ticket.prioridad}</p>
    </CardContent>
    </Card>
    <Card>
    <CardContent>
      <h2 className="text-2xl font-bold mb-4">Información del Técnico</h2>
      </CardContent>
      <CardContent>
      <p>Nombre: {asignacion.tecnico.nombreUsuario}</p>
      <p>Especialidades</p>
      <div className="mb-2 gap-2 flex flex-wrap">
        {asignacion.tecnico.especialidades.map((especialidad, index) => (
          <Badge key={index} className="mr-2 text-sm">{especialidad.nombre}</Badge>
        ))}
      </div>
      <p>Carga de trabajo: {asignacion.tecnico.cargaTrabajo}</p>
    </CardContent>
    </Card>

      <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
            <CardHeader>
              <CardTitle className="text-lg">Método de Asignación</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="text-base">
                {asignacion.metodo.nombre}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Puntaje de Prioridad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{asignacion.puntajePrioridad}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tiempo Restante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {asignacion.tiempoRestanteResolucion}
              </p>
            </CardContent>
          </Card>
      </div>
</div>
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
