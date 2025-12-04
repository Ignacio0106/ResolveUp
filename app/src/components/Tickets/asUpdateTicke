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



export function UpdateTicket() {
    const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [ticket, setTicket] = useState(null);

  const [dataPrioridad, setDataPrioridad] = useState([]);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [dataEtiqueta, setDataEtiqueta] = useState([]);
  const [dataEstado, setDataEstado] = useState([]);
  const [dataCategoria, setDataCategoria] = useState([]);
  const [error, setError] = useState("");
  
  /*** Esquema de validación Yup ***/
  const ticketSchema = yup.object({
        titulo: yup.string().required("El título es requerido").min(2, "El título debe tener al menos 2 caracteres"),
    descripcion: yup.string().required("La descripcion es requerida").min(10, "La descripción debe tener al menos 10 caracteres"),
    fechaCreacion: yup.string().required("La fecha de creación es requerida"),
    prioridad: yup.number().typeError("Seleccione una prioridad").required("La prioridad es requerida"),
    usuario: yup.number().typeError("Seleccione un usuario").required("El usuario es requerido"),
    etiquetas: yup.number().typeError("Seleccione una etiqueta").required("Las etiquetas son requeridas"),
    categoria: yup.number().typeError("Seleccione una categoría").required("La categoría es requerida"),
    estado: yup.number().typeError("Seleccione un estado").required("El estado es requerido"),
  });

    /*** React Hook Form ***/
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      defaultValues: {
        titulo: "",
        descripcion: "",
        fechaCreacion: "",
        prioridad: "",
        estado: "",
        usuario: "",
        etiquetas: "",
        categoria: "",
      },
      resolver: yupResolver(ticketSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prioridadRes = await PrioridadService.getAll();
                const etiquetaRes = await EtiquetaService.getAll();
                const usuarioRes = await UsuarioService.getByTicket(id);
                const estadoRes = await EstadoService.getAll();
                const categoriaRes = await CategoriasService.getCategoriaByEtiqueta(1);
                const ticketRes = await TicketService.getTicket(id);
                console.log("Respuesta del ticket:", ticketRes);
                // Si la petición es exitosa, se guardan los datos
                setDataPrioridad(prioridadRes.data.data || []);
                setDataEtiqueta(etiquetaRes.data.data || []);
                setDataUsuario(usuarioRes.data.data || []);
                setDataEstado(estadoRes.data.data || []);
                setDataCategoria(categoriaRes.data.data || []);

                if (ticketRes.data) {
                    const ticketData = ticketRes.data.data;
                    console.log("Datos del ticket:", ticketData);
                    reset({
                        titulo: ticketData.titulo,
                        descripcion: ticketData.descripcion,
                        fechaCreacion: ticketData.fechaCreacion,
                        prioridad: ticketData.prioridadId,
                        estado: ticketData.estadoId,
                        usuario: ticketData.usuarioId,
                        etiquetas: ticketData.etiquetaId,
                        categoria: ticketData.categoriaId,
                    });
                    setTicket(ticketData);
                    }
                }catch (err) {
                    if (err.name !== "AbortError") setError(err.message);
                }
        };

        fetchData();
    }, [id, reset]);

    const onSubmit = async (dataForm) => {
    try {
      if (ticketSchema.isValid()) {
        //Verificar datos del formulario
        console.log(dataForm)
        //Crear pelicula en el API
        const response = await TicketService.updateTicket(id, dataForm);
        if (response.data) {
          //Notificación de creación
          toast.success(`Ticket actualizado #${response.data.id} - ${response.data.titulo}`, {
            duration: 4000,
            position: "top-center",
          });
          //Redireccionar al listado del mantenimiento
          navigate("/ticket/table");
        } else if (response.error) {
          setError(response.error);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error al crear película");
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
            render={({ field }) => <Input {...field} id="titulo" placeholder="Ingrese el título" />}
          />
          {errors.titulo && <p className="text-sm text-red-500">{errors.titulo.message}</p>}
        </div>

        {/* Descripción */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="descripcion">Descripción</Label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => <Input {...field} id="descripcion" placeholder="Ingrese la descripción" />}
          />
          {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion.message}</p>}
        </div>   

        {/* Prioridad */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Prioridad</Label>

          <Controller
            name="prioridad"
            control={control}
            render={({ field }) =>
              <CustomSelect
                field={field}
                data={dataPrioridad}
                label="Prioridad"
                getOptionLabel={(prioridad) => `${prioridad.nombre} ${prioridad.peso}`}
                getOptionValue={(prioridad) => prioridad.id}
                error={errors?.prioridad?.message}
              />
            }
          />

        </div>
        {/* Usuario */}
{/* Usuario */}
<div>
  <div className="flex items-center justify-between">
    <Label className="block mb-1 text-sm font-medium">Usuario</Label>
  </div>

  <div className="space-y-4 mt-3">
    <div className="mb-4 p-4 border rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
      <Contact className="w-6 h-6 text-muted-foreground" />

      <div className="flex-1 w-full md:w-1/3">
        <Controller
            name="usuario"
            control={control}
            render ={({ field }) =>
            <CustomInputField
            {...field}
          label="Usuario"
          placeholder="Nombre usuario"
          value={dataUsuario?.nombre ?? ""}
        />
    }
        />
      </div>
      <div className="flex-1 w-full md:w-1/3">
                <Controller
            name="usuario"
            control={control}
            render ={({ field }) =>
            <CustomInputField
            {...field}
          label="Rol"
          placeholder="Nombre rol"
          value={dataUsuario?.rol?.nombre ?? ""}
        />}
        />
      </div>
    </div>
  </div>
</div>
        {/* Etiquetas */}
        <div>
        <div>
          <Label className="block mb-1 text-sm font-medium">Etiqueta</Label>
          <Controller
            name="etiquetas"
            control={control}
            render={({ field }) =>
              <CustomSelect
                field={field}
                data={dataEtiqueta}
                label="Etiqueta"
                getOptionLabel={(etiqueta) => `${etiqueta.nombre}`}
                getOptionValue={(etiqueta) => etiqueta.id}
                error={errors?.etiquetas?.message}
                onChange={async (value) => {
                  console.log("EtiquetaSeleccionada",value)
                  field.onChange(value);
                  const categoriaRespuesta = await CategoriasService.getCategoriaByEtiqueta(value);
                  console.log("SirveCategoriaPorEtiqueta",categoriaRespuesta)
                  setDataCategoria(categoriaRespuesta.data.data || []);
                  }}
              />
            }
          />
        </div>
        <div className="mt-2">
                    <Label className="block mb-1 text-sm font-medium">Categoria</Label>
          <Controller
  name="categoria"
  control={control}
  render={({ field }) =>
    <CustomSelect
      field={field}
      data={dataCategoria}
      label="Categoria"
      getOptionLabel={(c) => `${c.nombre}`}
      getOptionValue={(c) => c.id}
      error={errors?.categoria?.message}
    />
  }
/>
        </div>
        </div>
        {/* Fecha de creación */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="fechaCreacion">FechaCreacion</Label>
          <Controller
            name="fechaCreacion"
            control={control}
            render={({ field }) => <Input {...field} id="fechaCreacion" placeholder="Ingrese la fecha de creación" />}
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
