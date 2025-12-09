import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Plus, Trash2, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import MovieService from "@/services/TecnicoService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";


export default function TableTecnico() {
    const { user } = useUser();

    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const { t } = useTranslation();
    // Headers de la tabla
    const movieColumns = [
        { key: "nombre", label: t("technician.list.columns.name") },
        { key: "correo", label: t("technician.list.columns.email") },
        { key: "actions", label: t("technician.list.columns.actions") },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MovieService.getTecnicos();
                console.log("Objeto recibido:", response.data);
                setData(response.data);
                if (!response.data.success) {
                    setError(response.data.message);
                }
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoaded(true);
            }
        };
        fetchData();
    }, []);

    if (!loaded) return <LoadingGrid type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar técnicos" message={error} />;
    if (!data || data.data.length === 0)
        return <EmptyState message="No se encontraron técnicos." />;

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">{t("technician.list.title")}</h1>

                {/* SOLO ADMIN VE EL BOTÓN DE CREAR */}
                {user?.rol?.nombre === "Administrador" && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button asChild variant="outline" size="icon" className="text-primary">
                                    <Link to="/tecnico/create">
                                        <Plus className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t("technician.list.tooltip.create")}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-primary/50">
                        <TableRow>
                            {movieColumns.map((column) => (
                                <TableHead key={column.key} className="text-left font-semibold">
                                    {column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.nombre}</TableCell>
                                <TableCell>{row.correo}</TableCell>

                                <TableCell className="flex justify-start items-center gap-1">

                                    {/* SOLO ADMIN VE ACTUALIZAR */}
                                    {user?.rol?.nombre === "Administrador" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            navigate(`/tecnico/update/${row.id}`)
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4 text-primary" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{t("technician.list.tooltip.update")}</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}

                                    {/* SOLO ADMIN VE ELIMINAR */}
{/*                                     {user?.rol?.nombre === "Administrador" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{t("technician.list.tooltip.delete")}</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )} */}

                                    {/* TODOS PUEDEN VER DETALLE */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        navigate(`/tecnico/detail/${row.id}`)
                                                    }
                                                >
                                                    <Eye className="h-4 w-4 text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{t("technician.list.tooltip.detail")}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Button
                type="button"
                className="flex items-center gap-2 text-white hover:bg-primary/80 mt-6"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-4 h-4" />
                {t("technician.list.backButton")}
            </Button>
        </div>
    );
}
