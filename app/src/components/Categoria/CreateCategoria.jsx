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

// Servicios
import SlaService from "@/services/SlaService";
import EtiquetaService from "@/services/EtiquetaService";
import EspecialidadService from "@/services/EspecialidadService";
import CategoriasService from "@/services/CategoriasService";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";

// Validación con Yup
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  idSLA: yup.number().typeError("Debe seleccionar un SLA").required("Debe seleccionar un SLA"),
  etiquetas: yup.array().min(1, "Seleccione al menos una etiqueta"),
  especialidades: yup.array().min(1, "Seleccione al menos una especialidad"),
});

export default function CreateCategoria({ onSuccess }) {
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      idSLA: null,
      etiquetas: [],
      especialidades: [],
    },
  });

  const [slas, setSlas] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // Limpiar formulario
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
          <Label>SLA</Label>
          <Controller
            name="idSLA"
            control={control}
            render={({ field }) => (
              <Select onValueChange={value => field.onChange(value)} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un SLA" />
                </SelectTrigger>
                <SelectContent>
                  {slas.map(sla => (
                    <SelectItem key={sla.id} value={sla.id}>
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
