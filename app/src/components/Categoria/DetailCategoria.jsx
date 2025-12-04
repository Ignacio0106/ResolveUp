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
import { useTranslation } from 'react-i18next';

export function DetailCategoria() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categoria, setCategoria] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

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
    if (error) return <ErrorAlert title={t('category.errorTitle')} message={error} />;
    if (!categoria) return <EmptyState message={t('category.noCategoryFound')} />;

    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="flex text-4xl font-bold items-center justify-center">
            <p className="text-xl px-3 py-1">
              {categoria.idCategoria}
            </p>
            {categoria.nombreCategoria}</h1>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* IZQUIERDA: Datos generales */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary mb-4">{t('category.generalInfo')}</h2>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-muted-foreground">{t('category.maxResponseTime')}</span>
                    <span className="text-lg font-semibold">{categoria.tiempoMaxRespuesta} {t('category.minutes')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-muted-foreground">{t('category.maxResolutionTime')}</span>
                    <span className="text-lg font-semibold">{categoria.tiempoMaxResolucion} {t('category.minutes')}</span>
                  </div>
                </div>
              </div>

              {/* DERECHA: Especialidades y Etiquetas */}
              <div className="space-y-6">
                {categoria.especialidades && categoria.especialidades.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-3">{t('category.specialties')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categoria.especialidades.map((esp) => (
                        <Badge
                          key={esp.idEspecialidad}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
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
                    <h3 className="text-lg font-semibold text-primary mb-3">{t('category.labels')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categoria.etiquetas.map((et) => (
                        <Badge
                          key={et.idEtiqueta}
                          variant="outline"
                          className="flex items-center gap-1 px-3 py-1"
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
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 mt-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('category.backButton')}
        </Button>
      </div>
    );
}
