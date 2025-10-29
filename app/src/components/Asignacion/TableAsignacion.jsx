import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AsignacionService from "@/services/AsignacionService";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';
import { ChevronRight } from "lucide-react"; 
import { Badge } from "@/components/ui/badge"; 

// Headers de la tabla
const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function startOfWeekSunday(date) {
  const d = new Date(date);
  const day = d.getDay(); 
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function siguienteSemana(asignaciones, date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 7);
  console.log(d.toDateString());
  cargarAsignacionesParaSemana(asignaciones, d);
}
function semanaAnterior(asignaciones, date) {
  const d = new Date(date);
  d.setDate(d.getDate() - 7);
  cargarAsignacionesParaSemana(asignaciones, d);
}
function cargarAsignacionesParaSemana(asignaciones, startDate) {
  const semanaAsignaciones = new Array(7).fill(null).map(() => []);
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeekSunday(startDate));
        currentDate.setDate(startOfWeekSunday(startDate).getDate() + i);
        asignaciones.map((day) => {
            new Date(day.fecha).toDateString() === currentDate.toDateString() ? semanaAsignaciones[i].push(day) : semanaAsignaciones[i].push();
        });
    }
    return semanaAsignaciones;
}
export function TableAsignacion() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [asignacion, setAsignacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AsignacionService.getAsignacionesByTecnico(id);
                //console.log(response.data);
                if (response.data.success) {
                    setAsignacion(response.data.data); // guardamos directamente el objeto de asignación
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
      <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Asignaciones</h1>
                <div className="flex items-center gap-4">
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => semanaAnterior(asignacion, new Date())}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Anterior
                    </Button>
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => siguienteSemana(asignacion, new Date())}
                    >
                        Siguiente
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-secondary/20 overflow-hidden">
                {/* Header con días de la semana */}
                <div className="grid grid-cols-7 bg-muted border-b-4 border-secondary/20">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="p-4 text-center font-semibold border-r border-secondary/20">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 bg-muted">
                    {cargarAsignacionesParaSemana(asignacion, new Date()).map((asignacionD) => {
                        if(asignacionD.length===0){
                            return <div className="mb-2 rounded border p-2 flex flex-col gap-1" />
                        } else {
            return <div className="mb-2 rounded border p-2 flex flex-col gap-1">
                        {asignacionD.map((item) => (
            <div key={item.id} className="mb-2 rounded border p-2 ">
              <p>{item.idTicket}</p>
              <p>{item.categoria}</p>
              <p>{item.estado}</p>
              <p>{item.tiempoRestanteResolucion}</p>
            </div>
                    ))}  
            </div>
                        }
                    })}
      </div>
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
