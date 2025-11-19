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
import { useNavigate } from "react-router-dom";
import EspecialidadService from "@/services/EspecialidadService";
import TecnicoService from "@/services/TecnicoService";

export function CreateTecnico() {
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState("");
const navigate = useNavigate();
  const [showNewEspecialidad, setShowNewEspecialidad] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState("");

  const tecnicoSchema = yup.object({
    nombre: yup.string().required("El nombre es requerido"),
    correo: yup.string().email("Correo inválido").required("El correo es requerido"),
    password: yup.string().required("La contraseña es requerida"),
    especialidades: yup.array().min(1, "Seleccione al menos una especialidad"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nombre: "",
      correo: "",
      password: "",
      especialidades: [],
    },
    resolver: yupResolver(tecnicoSchema),
  });

  // Cargar especialidades
  useEffect(() => {
    EspecialidadService.getAll()
      .then(res => setEspecialidades(res.data?.data || []))
      .catch(err => setError("Error al cargar especialidades: " + err));
  }, []);

  const crearNuevaEspecialidad = async () => {
    if (!newEspecialidad.trim())
      return toast.error("Ingrese un nombre de especialidad");

    try {
      await EspecialidadService.create({ nombre: newEspecialidad.trim() });
      toast.success("Especialidad creada correctamente");

      const res = await EspecialidadService.getAll();
      setEspecialidades(res.data?.data || []);

      setNewEspecialidad("");
      setShowNewEspecialidad(false);
    } catch (err) {
      toast.error("Error al crear la especialidad" + err);
    }
  };

  const onSubmit = async (dataForm) => {
    console.log("📌 Datos recibidos del formulario:", dataForm);
    console.log("📌 Especialidades seleccionadas:", dataForm.especialidades);

    const payload = {
  nombre: dataForm.nombre,
  correo: dataForm.correo,
  password: dataForm.password,
  especialidades: dataForm.especialidades.map(id => ({
    idEspecialidad: id,
  })),
  disponibilidad: 1,
  cargaTrabajo: 0,
};

    console.log("📌 Payload FINAL que se enviará al backend:", payload);

    try {
      const response = await TecnicoService.createTecncio(payload);

      console.log("📌 Respuesta del backend:", response.data);

      if (response.data.success) {
        toast.success("Técnico creado correctamente");
        
        reset();
        navigate("/tecnico/table");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Error al crear técnico");
      console.error("❌ Error del submit:", err);
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Crear Técnico</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Nombre */}
        <div>
          <Label>Nombre completo</Label>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Ingrese nombre completo" />
            )}
          />
          {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
        </div>

        {/* Correo */}
        <div>
          <Label>Correo</Label>
          <Controller
            name="correo"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="usuario@mail.com" />
            )}
          />
          {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <Label>Contraseña</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input {...field} type="password" placeholder="******" />
            )}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        {/* Especialidades */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Controller
              name="especialidades"
              control={control}
              render={({ field }) => {
                console.log("📌 field.value (especialidades):", field.value);
                return (
                  <CustomMultiSelect
                    field={field}
                    data={especialidades}
                    label="Especialidades"
                    getOptionLabel={(item) => item.nombre}
                    getOptionValue={(item) => item.id}
                    error={errors.especialidades?.message}
                    placeholder="Seleccione las especialidades del técnico"
                  />
                );
              }}
            />

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

          {errors.especialidades && (
            <p className="text-sm text-red-500">{errors.especialidades.message}</p>
          )}

          {/* Crear nueva especialidad */}
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

        <Button type="submit" className="w-full">Guardar Técnico</Button>
      </form>
    </Card>
  );
}
