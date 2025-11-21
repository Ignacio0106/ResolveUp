import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";

import EspecialidadService from "@/services/EspecialidadService";
import TecnicoService from "@/services/TecnicoService";
import { useParams, useNavigate } from "react-router-dom";


  const tecnicoSchema = yup.object({
    nombreUsuario: yup.string().required("El nombre es requerido"),
    correoUsuario: yup.string().email("Correo inválido").required("El correo es requerido"),
    password: yup.string(), 
    especialidades: yup.array().min(1, "Seleccione al menos una especialidad"),
    disponibilidad: yup.string().required("La disponibilidad es requerida"),

  });

export function UpdateTecnico() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState("");
  const [showNewEspecialidad, setShowNewEspecialidad] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState("");


  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(tecnicoSchema),
    defaultValues: { nombreUsuario: "", correoUsuario: "", password: "", especialidades: [], disponibilidad: "1" },
  });



useEffect(() => {
    const fetchData = async () => {
      try {

        // Traer SLAs, etiquetas y especialidades
        const [espRes] = await Promise.all([
          EspecialidadService.getAll(),
        ]);

        const especialidadesData = espRes.data?.data || [];
        setEspecialidades(especialidadesData);

        // Traer detalle de la categoría
        const catRes = await TecnicoService.getDetalleTecnico(id);
        const cat = catRes.data?.data || {};

        

        
        reset({
          nombreUsuario: cat.nombreUsuario,
          correoUsuario: cat.correoUsuario,
          password: cat.contraseña,
          disponibilidad: String(cat.disponibilidad),
          especialidades: cat.especialidades?.map(g => g.idEspecialidad) || [],
          
        });

      } catch (err) {
        console.error(err);
        toast.error("Error cargando datos de la categoría");
        setError("Error cargando datos de la categoría");
      } 
    };

    fetchData();
  }, [id, reset]);


  // Crear nueva especialidad al vuelo
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
      toast.error("Error al crear la especialidad");
    }
  };

  
  const onSubmit = async (dataForm) => {
  try {


const payload = {
  id: Number(id),
  nombre: dataForm.nombreUsuario,
  correo: dataForm.correoUsuario,
  especialidades: dataForm.especialidades.map(e => ({
    idEspecialidad: Number(e)
  })),
  disponibilidad: Number(dataForm.disponibilidad),
  cargaTrabajo: 0,
};

if (dataForm.password) payload.password = dataForm.password;


    console.log("📦 PAYLOAD ENVIADO AL BACKEND:", payload);

    const response = await TecnicoService.update(payload);

    console.log("📥 RESPUESTA DEL BACKEND:", response.data);

    if (response.data.success) {
      toast.success("Técnico actualizado correctamente");
      navigate("/tecnico/table");
    } else {
      toast.error(response.data.message);
    }
  } catch (err) {
    console.error("❌ ERROR UPDATE:", err.response?.data || err.message);
    toast.error("Error al actualizar técnico: " + (err.response?.data?.message || err.message));
  }
};


  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Actualizar Técnico</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Nombre completo</Label>
          <Controller name="nombreUsuario" control={control} render={({ field }) => (
            <Input {...field} placeholder="Ingrese nombre completo" />
          )} />
          {errors.nombreUsuario && <p className="text-red-500">{errors.nombreUsuario.message}</p>}
        </div>

        <div>
          <Label>Correo</Label>
          <Controller name="correoUsuario" control={control} render={({ field }) => (
            <Input {...field} placeholder="usuario@mail.com" />
          )} />
          {errors.correoUsuario && <p className="text-red-500">{errors.correoUsuario.message}</p>}
        </div>

        <div>
          <Label>Contraseña</Label>
          <Controller name="password" control={control} render={({ field }) => (
            <Input {...field} type="password" placeholder="******" />
          )} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

{/* Disponibilidad */}
<div>
  <Label>Disponibilidad</Label>
  <Controller
    name="disponibilidad"
    control={control}
    render={({ field }) => (
      <select
        {...field}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="1">Disponible</option>
        <option value="0">No disponible</option>
      </select>
    )}
  />
  {errors.disponibilidad && (
    <p className="text-red-500 text-sm">
      {errors.disponibilidad.message}
    </p>
  )}
</div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Controller name="especialidades" control={control} render={({ field }) => (
              <CustomMultiSelect
                field={field}
                value={field.value}
                onChange={field.onChange}
                data={especialidades}
                getOptionLabel={item => item.nombre}
                getOptionValue={item => item.id}
                placeholder="Seleccione las especialidades"
              />
            )} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowNewEspecialidad(!showNewEspecialidad)}
              className="ml-2"
            >
              +
            </Button>
          </div>

          {showNewEspecialidad && (
            <div className="flex gap-2 mb-3 p-3 border rounded bg-muted/30">
              <Input
                placeholder="Nueva especialidad"
                value={newEspecialidad}
                onChange={(e) => setNewEspecialidad(e.target.value)}
              />
              <Button type="button" onClick={crearNuevaEspecialidad}>
                Guardar
              </Button>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">Actualizar Técnico</Button>
      </form>
    </Card>
  );
}
