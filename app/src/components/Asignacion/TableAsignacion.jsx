import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import AsignacionService from "@/services/AsignacionService";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FolderCode, HelpCircle, LaptopMinimalCheck, Network, ShieldCheck } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';
import { ChevronRight } from "lucide-react"; 
import { Badge } from "@/components/ui/badge"; 
import { Progress } from '../ui/progress';
import { useUser } from '@/hooks/useUser';


// Headers de la tabla
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function getDomingo(date) {
  const d = new Date(date);
  const dia = d.getDay(); 
  d.setDate(d.getDate() - dia);
  d.setHours(0, 0, 0, 0);
  return d;
}

function cargarAsignacionesParaSemana(asignaciones, startDate) {
  const semanaAsignaciones = new Array(7).fill(null).map(() => []);
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(getDomingo(startDate));
        //console.log("Current Date:", currentDate);
        currentDate.setDate(getDomingo(startDate).getDate() + i);
        asignaciones.map((day) => {
                  if (new Date(day.fecha).toDateString() === currentDate.toDateString()) {
                    semanaAsignaciones[i].push(day);
                }
        });
    }
    return semanaAsignaciones;
}
function ProgressLabelOutside( item ) {
  let valor = "";
  //console.log("Si entra");
  switch (item.estado) {
    case "Pendiente":
      valor = "0";
            break;
        case "Asignado":
            valor = "20";
            break;
        case "En Proceso":
            valor = "55";
            break;
        case "Resuelto":
            valor = "90";
            break;
        case "Cerrado":
            valor = "100";
            break;
        default:
            valor = "0";
        }
    return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div color="blue-gray" variant="h6">
          {item.estado} 
        </div>
        <div color="blue-gray" variant="h6">
          {valor}%
        </div>
      </div>
        <Progress value={parseInt(valor)} />
    </div>
    );
};
function iconos(item){
    let valor = "";
  switch (item.categoria) {
    case "Soporte a sistemas educativos":
      valor = <FolderCode />;
            break;
    case "Hardware":
        valor = <LaptopMinimalCheck />;
            break;
        case "Redes y conectividad":
            valor = <Network />;
            break;
        case "Seguridad informática":
            valor = <ShieldCheck />;
            break;
        default:
            valor = <HelpCircle />;
        }
    return {valor};
}

export function TableAsignacion() {
    const { user, isAuthenticated, clearUser, authorize } = useUser();

    const navigate = useNavigate();
    const [asignacion, setAsignacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [semana, setSemana] = useState(() => new Date());

  const cambiarSemana = (fecha, dias) => {
    const d = new Date(getDomingo(fecha));
    d.setDate(d.getDate() + dias);
    setSemana(new Date(d)); 
  };
function color(asignacionesDelDia) {
    return (
        <div className="mb-2 rounded border p-2 flex flex-col gap-1">
            {asignacionesDelDia.map((item) => {
                let bgColor = "";
                let hoverColor = "";
                
                if (item.prioridad === "Alta") {
                    bgColor = "bg-red-600/20";
                    hoverColor = "hover:bg-red-600/30";
                } else if (item.prioridad === "Media") {
                    bgColor = "bg-yellow-600/20";
                    hoverColor = "hover:bg-yellow-600/30";
                } else {
                    bgColor = "bg-green-600/20";
                    hoverColor = "hover:bg-green-600/30";
                }

                return (
                    <div 
                        key={item.id} 
                        onClick={() => navigate(`/asignacion/detail/${item.id}`)} 
                        className={`mb-2 rounded border p-2 ${bgColor} hover:cursor-pointer ${hoverColor}`}
                    >
                                    <div className="flex items-center justify-between">
              <p className="font-medium">
                Ticket <span className="font-mono">#{item.idTicket}</span>
              </p>
            </div>
                        <div className="flex items-center">
                            <p>{item.categoria}</p>
                            <div className="flex ml-0.5">{iconos(item).valor}</div>
                        </div>
                        <div>{ProgressLabelOutside(item)}</div>
                                    <p className="mt-2 text-gray-300">
              {item.tiempoRestanteResolucion}
            </p>
                    </div>
                );
            })}
        </div>
    );
}

function cargarTabla(asignacion, semana){
    return cargarAsignacionesParaSemana(asignacion, semana).map((asignacionD) => {
        if(asignacionD.length===0){
            return <div className="mb-2 rounded border p-2 flex flex-col gap-1">
                        <div className="mb-2 rounded border p-2">No hay asignaciones para esta semana</div>
                    </div>
        } else {
            console.log("Lo que le estoy enviendo",asignacionD);
            return color(asignacionD);
                }
        })}

    useEffect(() => {
        const fetchData = async () => {
            try {   
                const response = await AsignacionService.getAsignacionesByUsuario(1);
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
    }, []);

    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar asignación" message={error} />;
    if (!asignacion) return <EmptyState message="No se encontró información de la asignación." />;

    return (
      <div className="container mx-auto py-8">
            <div className="flex flex-col items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Asignaciones</h1>
                <div className="flex items-center gap-4">
                    <Button
                        className="flex items-center gap-2 hover:bg-/10 hover:cursor-pointer"
                        onClick={() => cambiarSemana(semana, -7)}
                    > 
                        <ArrowLeft className="w-4 h-4" />
                        Anterior
                    </Button>
                        <p className="text-lg text-muted-foreground">
                            {semana.toLocaleDateString('es-ES', { year: 'numeric', month: 'long'})}
                        </p>
                    <Button
                        className="flex items-center gap-2 hover:bg-primary/10 hover:cursor-pointer"
                        onClick={() => cambiarSemana(semana, 7)}
                    >
                        Siguiente
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-secondary/20 overflow-hidden overflow-x-auto">
                {/* Header con días de la semana */}
                <div className="grid grid-cols-7 bg-muted border-b-4 border-secondary/20 min-w-[700px]">
                    {diasSemana.map((day, i) => {
                        const d = getDomingo(semana);
                        const fecha = new Date(d);
                        fecha.setDate(d.getDate() + i);
                        return (
                        <div key={day} className="p-4 text-center font-semibold border-r border-secondary/20">
                            <div>{day}</div>
                            <div>{fecha.getDate()}</div>
                        </div>
                        );
                    })}
                </div>
                <div id="asignaciones_semana" className="grid grid-cols-7 bg-muted min-w-[700px]">
                    {cargarTabla(asignacion ? asignacion : [], semana)}
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
