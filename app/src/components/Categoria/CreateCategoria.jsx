import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

// UI (shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
// Servicios
import SlaService from "@/services/SlaService";
import EtiquetaService from "@/services/EtiquetaService";
import EspecialidadService from "@/services/EspecialidadService";
import CategoriasService from "@/services/CategoriasService";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";

// Validación Yup
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  idSLA: yup.number().typeError("Debe seleccionar un SLA").required("Debe seleccionar un SLA"),
  etiquetas: yup.array().min(1, "Seleccione al menos una etiqueta"),
  especialidades: yup.array().min(1, "Seleccione al menos una especialidad"),
});

export default function CreateCategoria({ onSuccess }) {

  // RHF
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      idSLA: null,
      etiquetas: [],
      especialidades: [],
    },
  });

  // Estados
  const [slas, setSlas] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  // Estados para crear nuevo SLA
  const [showNewSla, setShowNewSla] = useState(false);
  const [newSla, setNewSla] = useState({
    tiempoRespuesta: "",
    tiempoResolucion: ""
  });
  const [showNewEtiqueta, setShowNewEtiqueta] = useState(false);
  const [newEtiqueta, setNewEtiqueta] = useState("");

  const [showNewEspecialidad, setShowNewEspecialidad] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState("");


  // Cargar datos iniciales
  useEffect(() => {
    async function fetchData() {
      try {
        const [slaRes, etiRes, espRes] = await Promise.all([
          SlaService.getAll(),
          EtiquetaService.getAll(),
          EspecialidadService.getAll(),
        ]);

        setSlas(slaRes.data?.data || []);
        setEtiquetas(etiRes.data?.data || []);
        setEspecialidades(espRes.data?.data || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error cargando datos iniciales");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 👉 Crear Nuevo SLA
  const crearNuevoSLA = async () => {
    if (!newSla.tiempoRespuesta || !newSla.tiempoResolucion) {
      return toast.error("Complete ambos campos del SLA");
    }

    try {
      await SlaService.create({
        tiempoRespuesta: Number(newSla.tiempoRespuesta),
        tiempoResolucion: Number(newSla.tiempoResolucion),
      });

      toast.success("SLA creado correctamente");

      // Recargar lista de SLAs
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

   // CREAR ETIQUETA
  const crearNuevaEtiqueta = async () => {
  if (!newEtiqueta.trim()) {
    return toast.error("Ingrese un nombre de etiqueta");
  }

  try {
    // Crear en BD
    await EtiquetaService.create({
      nombre: newEtiqueta.trim(),
    });

    toast.success("Etiqueta creada correctamente");

    // Recargar lista de etiquetas para que aparezca sin recargar página
    const res = await EtiquetaService.getAll();
    setEtiquetas(res.data?.data || []);

    // Reset
    setNewEtiqueta("");
    setShowNewEtiqueta(false);

  } catch (err) {
    console.error(err);
    toast.error("Error al crear la etiqueta");
  }
};


  // CREAR ESPECIALIDAD
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


  const onSubmit = async (data) => {
    try {
      const payload = {
        nombre: data.nombre,
        idSLA: Number(data.idSLA),
        etiquetas: data.etiquetas.map(e => Number(e)),
        especialidades: data.especialidades.map(e => Number(e)),
      };

      await CategoriasService.create(payload);

      toast.success("Categoría creada correctamente");
      navigate("/categoria/table");
      reset({
        nombre: "",
        idSLA: null,
        etiquetas: [],
        especialidades: [],
      });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Error al crear categoría:", error);
      toast.error("Error al crear la categoría");
    }
  };

  if (loading) return <p className="text-center mt-6">Cargando datos...</p>;

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Crear Nueva Categoría</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Nombre */}
        <div>
          <Label>Nombre</Label>
          <Input {...register("nombre")} placeholder="Ingrese el nombre de la categoría" />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        {/* SLA */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>SLA</Label>

            {/* Botón + para mostrar formulario */}
            <Button type="button" variant="outline" size="icon"
              onClick={() => setShowNewSla(!showNewSla)}
            >
              +
            </Button>
          </div>

          {/* Formulario oculto de nuevo SLA */}
          {showNewSla && (
            <div className="grid grid-cols-2 gap-2 mb-4 p-3 border rounded-lg bg-muted/30">
              <Input
                placeholder="Tiempo Respuesta (min)"
                type="number"
                value={newSla.tiempoRespuesta}
                onChange={(e) => setNewSla({ ...newSla, tiempoRespuesta: e.target.value })}
              />

              <Input
                placeholder="Tiempo Resolución (min)"
                type="number"
                value={newSla.tiempoResolucion}
                onChange={(e) => setNewSla({ ...newSla, tiempoResolucion: e.target.value })}
              />

              <Button className="col-span-2" type="button" onClick={crearNuevoSLA}>
                Guardar SLA
              </Button>
            </div>
          )}

          <Controller
            name="idSLA"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={value => field.onChange(Number(value))}
                value={field.value?.toString() || ""}
              >
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
            <Label></Label>
            <Button type="button" variant="outline" size="icon" onClick={() => setShowNewEtiqueta(!showNewEtiqueta)}>+</Button>
          </div>

          {showNewEtiqueta && (
            <div className="flex gap-2 mb-3 p-3 border rounded bg-muted/30">
              <Input
                placeholder="Nombre de etiqueta"
                value={newEtiqueta}
                onChange={(e) => setNewEtiqueta(e.target.value)}
              />
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
                label="Etiquetas"
                getOptionLabel={item => item.nombre}
                getOptionValue={item => item.id}
                error={errors.etiquetas?.message}
                placeholder="Seleccione una o más etiquetas"
              />
            )}
          />
        </div>

        {/* Especialidades */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label></Label>
            <Button type="button" variant="outline" size="icon" onClick={() => setShowNewEspecialidad(!showNewEspecialidad)}>+</Button>
          </div>

          {showNewEspecialidad && (
            <div className="flex gap-2 mb-3 p-3 border rounded bg-muted/30">
              <Input
                placeholder="Nombre de especialidad"
                value={newEspecialidad}
                onChange={(e) => setNewEspecialidad(e.target.value)}
              />
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
                label="Especialidades"
                getOptionLabel={item => item.nombre}
                getOptionValue={item => item.id}
                error={errors.especialidades?.message}
                placeholder="Seleccione una o más especialidades"
              />
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-2">
          Crear Categoría
        </Button>

      </form>
    </Card>
  );
}