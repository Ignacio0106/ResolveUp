import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// icons
import { Plus, Save, ArrowLeft, Contact } from "lucide-react";

// servicios
import TicketService from "@/services/TicketService";
import PrioridadService from "@/services/PrioridadService";
import CategoriasService from "@/services/CategoriasService";
import UsuarioService from "@/services/UsuarioService";
import EstadoService from "@/services/EstadoService";
import EtiquetaService from "@/services/EtiquetaService";

// componentes reutilizables
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";
import { CustomInputField } from "../ui/custom/custom-input-field";
import { useUser } from "@/hooks/useUser";
import ImageService from "@/services/ImageService";



export function UpdateTicket() {
    const { user } = useUser();
    const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [ticket, setTicket] = useState(null);

  const [dataEstado, setDataEstado] = useState([]);

  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState("");
  
  /*** Esquema de validación Yup ***/
  const ticketSchema = yup.object({
    estado: yup.number().typeError("Seleccione un estado").required("El estado es requerido"),
    comentario: yup.string().required("El comentario es requerido"),
  });

    /*** React Hook Form ***/
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      defaultValues: {
        FechaCambio: "",
        usuario: "",
        estadoAnterior: "",
        estadoNuevo: "",
        comentario: "",
        imagen: "",
      },
      resolver: yupResolver(ticketSchema),
    });

      /*** Manejo de imagen ***/
  const handleChangeImage = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    }
  };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const estadoRes = await EstadoService.getAll();
                const ticketRes = await TicketService.getTicket(id);
                console.log("Respuesta del ticket:", ticketRes);
                // Si la petición es exitosa, se guardan los datos

                console.log("Data estado:", estadoRes.data.data || []);
                setDataEstado(estadoRes.data.data || []);

                
                if (ticketRes.data) {
                    const ticketData = ticketRes.data.data;
                    console.log("Datos del ticket:", ticketData);
                    reset({
                        titulo: ticketData.titulo,
                        descripcion: ticketData.descripcion,
                        fechaCreacion: ticketData.fechaCreacion,
                        estado: ticketData.estadoId,
                        usuario: ticketData.usuarioId,
                        etiquetas: ticketData.etiquetaId,
                    });
                    setTicket(ticketData);
                    switch (ticketData.estadoId) {
                        case "1":
                            setDataEstado(estadoRes.data.data.filter((estado) => estado.nombre.includes('Pendiente')));
                            break;
                        case "2":
                            setDataEstado(estadoRes.data.data.filter((estado) => estado.nombre.includes('Asignado') ||estado.nombre.includes('Resuelto')));
                            break;
                        case "3":
                            setDataEstado(estadoRes.data.data.filter((estado) => estado.nombre.includes('En Proceso') || estado.nombre.includes('Resuelto')));
                            break;
                        case "4":
                            setDataEstado(estadoRes.data.data.filter((estado) => estado.nombre.includes('Resuelto') || estado.nombre.includes('Cerrado') ));
                            break;
                        case "5":
                            setDataEstado(estadoRes.data.data.filter((estado) => estado.nombre.includes('Cerrado')));
                            break;
                        default:
                            setDataEstado(estadoRes.data.data);
                            break;
                    }
                }
                } catch (err) {
                    if (err.name !== "AbortError") setError(err.message);
                }
        };

        fetchData();
    }, [id, reset]);

    const onSubmit = async (dataForm) => {
    try {
      if (ticketSchema.isValid()) {
  
        const rutaImagen = file.name; 

      const datos = {
        idTicket: Number(id),
        idEstadoNuevo: Number(dataForm.estado),
        comentario: dataForm.comentario,
        idUsuario: user.id,
      };

          const response = await TicketService.updateTicket(datos);
          if (response.data?.success) {
            console.log("Respuesta de actualización:", response.data);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("ticket_id", response.data.data.id);
            formData.append("historial_id", response.data.data.idHistorialEstado);
            await ImageService.createImage(formData);
      toast.success("Ticket actualizado correctamente", {
        duration: 4000,
        position: "top-center",
      });
      navigate("/ticket/table");
    } else {
      setError(response.data?.message || "Error al actualizar el ticket");
    }
  }

    } catch (err) {
      console.error(err);
      setError("Error al actualizar el ticket");
    }
  };

    if (error) return <p className="text-red-600">{error}</p>;

    return (
    <Card className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Actualizar Ticket</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Título */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="titulo">Título</Label>
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => <Input readOnly {...field} id="titulo" placeholder="Ingrese el título" />}
          />
          {errors.titulo && <p className="text-sm text-red-500">{errors.titulo.message}</p>}
        </div>

        {/* Descripción */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="descripcion">Descripción</Label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => <Input readOnly {...field} id="descripcion" placeholder="Ingrese la descripción" />}
          />
          {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion.message}</p>}
        </div>   

        {/* Estado */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Estado</Label>

          <Controller
            name="estado"
            control={control}
            render={({ field }) =>
              <CustomSelect
                field={field}
                data={dataEstado}
                label="Estado"
                getOptionLabel={(estado) => `${estado.nombre}`}
                getOptionValue={(estado) => estado.id}
                error={errors?.estado?.message}
              />
            }
          />

        </div>
        <div >
          <Label className="block mb-1 text-sm font-medium" htmlFor="comentario">Comentario</Label>
          <Controller
            name="comentario"
            control={control}
            render={({ field }) => <Input {...field} id="comentario" placeholder="Ingrese el comentario" />}
          />
          {errors.comentario && <p className="text-sm text-red-500">{errors.comentario.message}</p>}
        </div> 
                <div className="mb-6">
          <Label htmlFor="image" className="block mb-1 text-sm font-medium">
            Imagen
          </Label>

          <div
            className="relative w-56 h-56 border-2 border-dashed border-muted/50 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
            onClick={() => document.getElementById("image").click()}
          >
            {!fileURL && (
              <div className="text-center px-4">
                <p className="text-sm text-muted-foreground">Haz clic o arrastra una imagen</p>
                <p className="text-xs text-muted-foreground">(jpg, png, máximo 5MB)</p>
              </div>
            )}
            {fileURL && (
              <img
                src={fileURL}
                alt="preview"
                className="w-full h-full object-contain rounded-lg shadow-sm"
              />
            )}
          </div>

          <input
            type="file"
            id="image"
            className="hidden"
            accept="image/*"
            onChange={handleChangeImage}
          />
        </div>
        <div className="flex justify-between gap-4 mt-6">
          <Button
            type="button"
            variant="default" // sólido
            className="flex items-center gap-2 bg-accent text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </Button>
          {/* Botón Guardar */}
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4" />
            Guardar
          </Button>
        </div>
      </form>
    </Card>
  );
}
