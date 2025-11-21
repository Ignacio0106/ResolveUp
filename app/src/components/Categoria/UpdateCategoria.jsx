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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, ArrowLeft } from "lucide-react";

// servicios
import CategoriasService from "@/services/CategoriasService";
import SlaService from "@/services/SlaService";
import EtiquetaService from "@/services/EtiquetaService";
import EspecialidadService from "@/services/EspecialidadService";

// componente reutilizable para multi select
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";

// Esquema Yup
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  idSLA: yup.number().typeError("Debe seleccionar un SLA").required("Debe seleccionar un SLA"),
  etiquetas: yup.array().min(1, "Seleccione al menos una etiqueta"),
  especialidades: yup.array().min(1, "Seleccione al menos una especialidad"),
});

export function UpdateCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [slas, setSlas] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showNewSla, setShowNewSla] = useState(false);
  const [newSla, setNewSla] = useState({ tiempoRespuesta: "", tiempoResolucion: "" });

  const [showNewEtiqueta, setShowNewEtiqueta] = useState(false);
  const [newEtiqueta, setNewEtiqueta] = useState("");

  const [showNewEspecialidad, setShowNewEspecialidad] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState("");

  const { control, handleSubmit, reset, register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      idSLA: null,
      etiquetas: [],
      especialidades: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Traer SLAs, etiquetas y especialidades
        const [slaRes, etiRes, espRes] = await Promise.all([
          SlaService.getAll(),
          EtiquetaService.getAll(),
          EspecialidadService.getAll(),
        ]);

        
        const slasData = slaRes.data?.data || [];
        const etiquetasData = etiRes.data?.data || [];
        const especialidadesData = espRes.data?.data || [];

        setSlas(slasData);
        setEtiquetas(etiquetasData);
        setEspecialidades(especialidadesData);

        // Traer detalle de la categoría
        const catRes = await CategoriasService.getDetalleCategoriaa(id);
        const cat = catRes.data?.data || {};

        // Buscar SLA correspondiente por tiempo
        const slaSeleccionado = slasData.find(
          s => Number(s.tiempoRespuesta) === Number(cat.tiempoMaxRespuesta) &&
               Number(s.tiempoResolucion) === Number(cat.tiempoMaxResolucion)
        );

        
        reset({
          nombre: cat.nombreCategoria || "",
          idSLA: slaSeleccionado ? Number(slaSeleccionado.id) : null,
          etiquetas: cat.etiquetas?.map(g => g.idEtiqueta) || [],
          especialidades: cat.especialidades?.map(g => g.idEspecialidad) || [],
        });

      } catch (err) {
        console.error(err);
        toast.error("Error cargando datos de la categoría");
        setError("Error cargando datos de la categoría");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);


  const crearNuevoSLA = async () => {
  const respuesta = Number(newSla.tiempoRespuesta);
  const resolucion = Number(newSla.tiempoResolucion);

  // Validaciones
  if (!respuesta || respuesta <= 0) {
    return toast.error("El tiempo de respuesta debe ser mayor a 0 minutos");
  }

  if (!resolucion || resolucion <= 0) {
    return toast.error("El tiempo de resolución debe ser mayor a 0 minutos");
  }

  if (resolucion <= respuesta) {
    return toast.error(
      "El tiempo de resolución debe ser mayor que el tiempo de respuesta"
    );
  }

  try {
    await SlaService.create({
      tiempoRespuesta: respuesta,
      tiempoResolucion: resolucion,
    });

    toast.success("SLA creado correctamente");

    // Recargar lista
    const res = await SlaService.getAll();
    setSlas(res.data?.data || []);

    // Reset
    setNewSla({ tiempoRespuesta: "", tiempoResolucion: "" });
    setShowNewSla(false);

  } catch (err) {
    console.error(err);
    toast.error("Error al crear el SLA");
  }
};

  // Crear Especialidad
  const crearNuevaEspecialidad = async () => {
    if (!newEspecialidad.trim()) return toast.error("Ingrese un nombre de especialidad");
    try {
      await EspecialidadService.create({ nombre: newEspecialidad.trim() });
      toast.success("Especialidad creada correctamente");
      const res = await EspecialidadService.getAll();
      setEspecialidades(res.data?.data || []);
      setNewEspecialidad("");
      setShowNewEspecialidad(false);
    } catch (err) {
      console.error(err);
      toast.error("Error al crear especialidad");
    }
  };

  const onSubmit = async (dataForm) => {
    try {
      const payload = {
        id: Number(id),
        nombre: dataForm.nombre?.trim() || "",
        idSLA: Number(dataForm.idSLA),
        etiquetas: Array.isArray(dataForm.etiquetas) 
          ? dataForm.etiquetas.map(e => Number(e.id ?? e)) 
          : [],
        especialidades: Array.isArray(dataForm.especialidades) 
          ? dataForm.especialidades.map(e => Number(e.id ?? e)) 
          : [],
      };

      console.log("Payload enviado:", payload);

      const res = await CategoriasService.updateCategoria(payload);
      console.log("Respuesta del backend:", res);

      toast.success("Categoría actualizada correctamente");
      navigate("/categoria/table");

    } catch (err) {
      console.error("Error al actualizar categoría:", err);
      if (err?.response?.status >= 400) {
        toast.error("Error al actualizar la categoría");
      }
    }
  };

  if (loading) return <p className="text-center mt-6">Cargando datos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Actualizar Categoría</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre */}
        <div>
          <Label>Nombre</Label>
          <Input {...register("nombre")} placeholder="Ingrese el nombre" />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        {/* SLA */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>SLA</Label>
            <Button type="button" variant="outline" size="icon" onClick={() => setShowNewSla(!showNewSla)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {showNewSla && (
            <div className="grid grid-cols-2 gap-2 mb-2 p-2 border rounded bg-muted/30">
              <Input placeholder="Tiempo Respuesta" type="number" value={newSla.tiempoRespuesta} onChange={e => setNewSla({...newSla, tiempoRespuesta: e.target.value})}/>
              <Input placeholder="Tiempo Resolución" type="number" value={newSla.tiempoResolucion} onChange={e => setNewSla({...newSla, tiempoResolucion: e.target.value})}/>
              <Button type="button" className="col-span-2" onClick={crearNuevoSLA}>Guardar SLA</Button>
            </div>
          )}
          <Controller
            name="idSLA"
            control={control}
            render={({ field }) => (
              <Select value={field.value?.toString() || ""} onValueChange={value => field.onChange(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un SLA" />
                </SelectTrigger>
                <SelectContent>
                  {slas.map(sla => (
                    <SelectItem key={sla.id} value={sla.id.toString()}>
                      {`Respuesta: ${sla.tiempoRespuesta} min / Resolución: ${sla.tiempoResolucion} min`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.idSLA && <p className="text-sm text-red-500">{errors.idSLA.message}</p>}
        </div>

        {/* Etiquetas */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Etiquetas</Label>
            <Button type="button" variant="outline" size="icon" onClick={() => setShowNewEtiqueta(!showNewEtiqueta)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {showNewEtiqueta && (
            <div className="flex gap-2 mb-2 p-2 border rounded bg-muted/30">
              <Input placeholder="Nombre etiqueta" value={newEtiqueta} onChange={e => setNewEtiqueta(e.target.value)}/>
              <Button type="button" onClick={crearNuevaEtiqueta}>Guardar</Button>
            </div>
          )}
          <Controller
            name="etiquetas"
            control={control}
            render={({ field }) => (
              <CustomMultiSelect
                field={field}
                data={etiquetas}
                getOptionLabel={item => item.nombre}
                getOptionValue={item => (item.id)}
                placeholder="Seleccione etiquetas"
                error={errors.etiquetas?.message}
              />
            )}
          />
        </div>

        {/* Especialidades */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Especialidades</Label>
            <Button type="button" variant="outline" size="icon" onClick={() => setShowNewEspecialidad(!showNewEspecialidad)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {showNewEspecialidad && (
            <div className="flex gap-2 mb-2 p-2 border rounded bg-muted/30">
              <Input placeholder="Nombre especialidad" value={newEspecialidad} onChange={e => setNewEspecialidad(e.target.value)}/>
              <Button type="button" onClick={crearNuevaEspecialidad}>Guardar</Button>
            </div>
          )}
          <Controller
            name="especialidades"
            control={control}
            render={({ field }) => (
              <CustomMultiSelect
                field={field}
                data={especialidades}
                getOptionLabel={item => item.nombre}
                getOptionValue={item => Number(item.id)}
                placeholder="Seleccione especialidades"
                error={errors.especialidades?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-between gap-4 mt-4">
          <Button type="button" variant="default" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4"/> Regresar
          </Button>
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4"/> Guardar
          </Button>
        </div>
      </form>
    </Card>
  );
}
