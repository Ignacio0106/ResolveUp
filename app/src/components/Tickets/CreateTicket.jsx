import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// icons
import { Plus, Save, ArrowLeft, Contact } from "lucide-react";

// servicios
import TicketService from "@/services/TicketService";
import PrioridadService from "@/services/PrioridadService";
import CategoriasService from "@/services/CategoriasService";
import UsuarioService from "@/services/UsuarioService";

// componentes reutilizables
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";
import { CustomInputField } from "../ui/custom/custom-input-field";
import EstadoService from "@/services/EstadoService";
import EtiquetaService from "@/services/EtiquetaService";



export function CreateTicket() {
  const navigate = useNavigate();

  const [dataPrioridad, setDataPrioridad] = useState([]);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [dataEtiqueta, setDataEtiqueta] = useState([]);
  const [dataEstado, setDataEstado] = useState([]);
  const [dataCategoria, setDataCategoria] = useState([]);
  const [error, setError] = useState("");

  localStorage.setItem('currentUserId', 4);

  const storedUser = localStorage.getItem('currentUserId');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;


  /*** Esquema de validación Yup ***/
  const ticketSchema = yup.object({
        titulo: yup.string().required("El título es requerido").min(2, "El título debe tener al menos 2 caracteres").max(100, "El título no debe exceder los 100 caracteres"),
    descripcion: yup.string().required("La descripcion es requerida").min(10, "La descripción debe tener al menos 10 caracteres"),
    fechaCreacion: yup.string().required("La fecha de creación es requerida").matches(
      /^\d{4}-\d{2}-\d{2} 00:00:00$/,
      "Formato de fecha inválido"
    ),
    prioridadId: yup.number().typeError("Seleccione una prioridad").required("La prioridad es requerida").positive("La prioridad debe ser válida"),
    idUsuario: yup.number().typeError("Seleccione un usuario").required("El usuario es requerido"),
    etiquetas: yup.number().typeError("Seleccione una etiqueta").required("Las etiquetas son requeridas").positive("La etiqueta debe ser válida"),
    idCategoria: yup.number().typeError("Seleccione una categoría").required("La categoría es requerida").positive("La categoria debe ser válida"),
    estadoId: yup.number().typeError("Seleccione un estado").required("El estado es requerido").positive("El estado debe ser válida"),
  });

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      titulo: "",
      descripcion: "",
      fechaCreacion: `${new Date().toISOString().slice(0, 10) + " 00:00:00"}`,
      prioridadId: "",
      estadoId: "1",
      idUsuario: `${currentUser}`,
      idCategoria: "",
    },
    resolver: yupResolver(ticketSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prioridadRes = await PrioridadService.getAll();
        const etiquetaRes = await EtiquetaService.getAll();
        const usuarioRes = await UsuarioService.getUserById(currentUser);
        const estadoRes = await EstadoService.getAll();
        const categoriaRes = await CategoriasService.getCategoriaByEtiqueta(1);
        // Si la petición es exitosa, se guardan los datos
        setDataPrioridad(prioridadRes.data.data || []);
        setDataEtiqueta(etiquetaRes.data.data || []);
        setDataUsuario(usuarioRes.data.data || []);
        setDataEstado(estadoRes.data.data || []);
        setDataCategoria(categoriaRes.data.data || []);
        console.log("SirvePrioridad",prioridadRes)
        console.log("SirveEtiqueta",etiquetaRes)
        console.log("SirveUsuario",usuarioRes)
        console.log("SirveEstado",estadoRes)
        console.log("SirveCategoria", categoriaRes)
        
      } catch (err) {
        // Si el error no es por cancelación, se registra
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchData()
  }, []);


  useEffect(() => {

  if (dataCategoria && dataCategoria.length > 0) {

    const primerId = dataCategoria[0].id;
    
    setValue("idCategoria", primerId);
  }
}, [dataCategoria, setValue]); // Se ejecuta cada vez que dataCategoria cambia

  /*** Submit ***/
  const onSubmit = async (dataForm) => {
    try {
      if (ticketSchema.isValid()) {
        //Verificar datos del formulario
        console.log("Que tiene form", dataForm)
        //Crear pelicula en el API
        const response = await TicketService.createTicket(dataForm);
        if (response.data) {
          //Notificación de creación
          console.log("Que tiene response",response.data)
          toast.success(`Ticket creado #${response.data.data.id} - ${response.data.data.titulo}`, {
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
      <h2 className="text-2xl font-bold mb-6">Crear Ticket</h2>

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
            name="prioridadId"
            control={control}
            render={({ field }) =>
              <CustomSelect
                field={field}
                data={dataPrioridad}
                label="Prioridad"
                getOptionLabel={(prioridad) => `${prioridad.nombre} ${prioridad.peso}`}
                getOptionValue={(prioridad) => prioridad.id}
                error={errors?.prioridadId?.message}
              />
            }
          />

        </div>
        {/* Usuario */}
<div>
  <div className="flex items-center justify-between">
    <Label className="block mb-1 text-sm font-medium">Usuario</Label>
  </div>

  <div className="space-y-4 mt-3">
    <div className="mb-4 p-4 border rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
      <Contact className="w-6 h-6 text-muted-foreground" />

      <div className="flex-1 w-full md:w-1/3">
        <CustomInputField
          label="Usuario"
          placeholder="Nombre usuario"
          value={dataUsuario?.nombre ?? ""}
          readOnly
        />
      </div>
      <div className="flex-1 w-full md:w-1/3">
        <CustomInputField
          label="Correo"
          placeholder="Nombre correo"
          value={dataUsuario?.correo ?? ""}
          readOnly
        />
      </div>
    </div>
  </div>
   <Controller
  name="idUsuario"
  control={control}
  render={({ field }) => (
    <input type="hidden" {...field} value={dataUsuario?.id ?? ""} />
  )}
/> 

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
                  setDataCategoria(categoriaRespuesta.data.data || []);
                  }}
              />
            }
          />
        </div>
        <div className="mt-2">
                    <Label className="block mb-1 text-sm font-medium">Categoria</Label>
          <Controller
  name="idCategoria"
  control={control}
  render={({ field }) =>
    <CustomSelect
      field={field}
      data={dataCategoria}
      label="Categoria"
      getOptionLabel={(c) => `${c.nombre}`}
      getOptionValue={(c) => c.id}
      error={errors?.idCategoria?.message}
    />
  }
/>
        </div>
        </div>
        {/* Fecha de creación */}
        <div className="flex-1 w-full md:w-1/3">
        <CustomInputField
          label="Fecha de creación"
          placeholder="Fecha de creación"
          value={new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}
          readOnly
        />
      </div>
<Controller
  name="fechaCreacion"
  control={control}
  render={({ field }) => (
    <input
      type="hidden"
      {...field}
      value={new Date().toISOString().slice(0, 10) + " 00:00:00"}
    />
  )}
/> 

        {/* Estado */}
    <div className="flex-1 w-full md:w-1/3">
        <CustomInputField
          label="Estado"
          placeholder="Nombre estado"
          value={dataEstado[1]?.nombre ?? ""}
          readOnly
        />
      </div>
<Controller
  name="estadoId"
  control={control}
  render={({ field }) => (
    <input
      type="hidden"
      {...field}
      value={dataEstado[1]?.id ?? ""}
    />
  )}
/>
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
