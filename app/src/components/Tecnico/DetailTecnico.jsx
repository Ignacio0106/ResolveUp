import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MovieService from '../../services/TecnicoService';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Check, X, ArrowLeft, UserCheck, Mail, Briefcase } from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';
import {ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';


export function DetailTecnico() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tecnico, setTecnico] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

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
  <div className="flex flex-col gap-8">
    {/* Nombre del técnico */}
    <h1 className="text-4xl font-bold text-center flex items-center justify-center"><User className="h-8 w-8 text-primary" />{tecnico.nombreUsuario}</h1>

    {/* Card principal */}
    <Card className="shadow-lg border border-gray-200">
      <CardContent className="p-6 grid gap-6 md:grid-cols-2">

        {/* Columna izquierda: correo y disponibilidad */}
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">{t("technician.details.emailLabel")}</span>
            <span className="text-muted-foreground">{tecnico.correoUsuario}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">{t("technician.details.availabilityLabel")}</span>
            {tecnico.disponibilidad === "1" ? (
              <Check className="text-green-600" />
            ) : (
              <X className="text-red-600" />
            )}
          </div>
          <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium">{t("technician.details.workloadLabel")}</p>
                  <p className="font-semibold">{tecnico.cargaTrabajo}</p>
                </div>
          </div>
        </div>

        {/* Columna derecha: especialidades */}
        <div className="grid gap-6 lg:grid-cols-2">

          {tecnico.especialidades && tecnico.especialidades.length > 0 && (
            <div className="space-y-2">
              <span className="font-semibold mb-2 text-xl flex justify-between items-center">{t("technician.details.specialtiesLabel")}:<div className="text-xl font-bold text-secondary">
                  {tecnico.especialidades?.length || 0}
                </div></span>
              <div className="flex flex-wrap gap-2">
                {tecnico.especialidades.map((esp) => (
                  <Badge
                    key={esp.idEspecialidad}
                    variant="secondary"
                    className="flex text-sm items-center gap-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {esp.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

      </CardContent>
    </Card>

    {/* Botón Regresar */}
    <div className="flex justify-center ">
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:bg-primary/80 mt-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("technician.details.backButton")}
        </Button>
    </div>
  </div>
</div>

    );
}