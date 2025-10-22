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
import { Edit, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import MovieService from "@/services/TecnicoService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";

// Headers de la tabla
const movieColumns = [
    { key: "nombre", label: "Nombre" },
    { key: "correo", label: "Correo" },
    { key: "actions", label: "Acciones" },
];

export default function TableMovies() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate(); // <-- Hook para navegación

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
                <h1 className="text-3xl font-bold tracking-tight">Listado de Técnicos</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="icon" className="text-primary">
                                <Link to="/movie/create">
                                    <Plus className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Crear técnico</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
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
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4 text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Actualizar</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Eliminar</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* Botón para ir al detalle usando React Router */}
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
                                                    <ArrowRight className="h-4 w-4 text-green-600" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Ver detalle</TooltipContent>
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
                className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-4 h-4" />
                Regresar
            </Button>
        </div>
    );
}
