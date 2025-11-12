import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { CustomSelect } from "../ui/custom/custom-select";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";

import RoleService from "@/services/RoleService";
import UsuarioService from "@/services/UsuarioService";
import EspecialidadService from "@/services/EspecialidadService";

export function CreateUsuario() {
  const [roles, setRoles] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState("");          // Errores de carga
  const [backendError, setBackendError] = useState(""); // Errores del backend

  const userSchema = yup.object({
    nombre: yup.string().required("El nombre es requerido"),
    correo: yup.string().email("Correo inválido").required("El correo es requerido"),
    password: yup.string().required("La contraseña es requerida"),
    idRol: yup.number().typeError("Seleccione un rol").required("Seleccione un rol"),
    especialidades: yup.array().when("idRol", {
      is: 2,
      then: (schema) => schema.min(1, "Seleccione al menos una especialidad"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const { control, watch, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { nombre: "", correo: "", password: "", idRol: "", especialidades: [] },
    resolver: yupResolver(userSchema),
  });

  const selectedRole = Number(watch("idRol"));

  // Cargar roles
  useEffect(() => {
    RoleService.getRoles()
      .then(res => setRoles(res.data?.data || []))
      .catch(err => setError("Error al cargar roles: " + err));
  }, []);

  // Cargar especialidades solo si rol = Técnico
  useEffect(() => {
    if (selectedRole !== 2) return;

    EspecialidadService.getAll()
      .then(res => setEspecialidades(res.data?.data || []))
      .catch(err => setError("Error al cargar especialidades: " + err));
  }, [selectedRole]);

  const onSubmit = async (dataForm) => {
    setBackendError(""); // limpiar error previo
    try {
      const payload = {
        nombre: dataForm.nombre,
        correo: dataForm.correo,
        password: dataForm.password,
        idRol: Number(dataForm.idRol),
        especialidades: dataForm.idRol === 2 ? dataForm.especialidades : [],
      };

      const response = await UsuarioService.createUser(payload);

      if (response.data?.success === false) {
        // Solo mostramos mensaje en pantalla
        setBackendError(response.data.message);
        return;
      }

      // Si fue exitoso, limpiar el formulario
      reset();
      setBackendError(""); 

    } catch (err) {
      console.error(err);
      setBackendError("Error al crear usuario: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Crear Usuario</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {backendError && <p className="text-red-600 mb-4">{backendError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <Label>Nombre completo</Label>
          <Controller name="nombre" control={control} render={({ field }) => (
            <Input {...field} placeholder="Ingrese nombre completo" />
          )} />
          {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
        </div>

        <div>
          <Label>Correo</Label>
          <Controller name="correo" control={control} render={({ field }) => (
            <Input {...field} placeholder="usuario@mail.com" />
          )} />
          {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}
        </div>

        <div>
          <Label>Contraseña</Label>
          <Controller name="password" control={control} render={({ field }) => (
            <Input {...field} type="password" placeholder="******" />
          )} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <Label>Rol</Label>
          <Controller name="idRol" control={control} render={({ field }) => (
            <CustomSelect
              field={field}
              data={roles}
              label="Seleccione un rol"
              getOptionLabel={r => r.nombre}
              getOptionValue={r => r.id}
              error={errors.idRol?.message}
            />
          )} />
        </div>

        {selectedRole === 2 && (
          <div>
            <Controller name="especialidades" control={control} render={({ field }) => (
              <CustomMultiSelect
                field={field}
                data={especialidades}
                label="Especialidades"
                getOptionLabel={item => item.nombre}
                getOptionValue={item => item.id}
                error={errors.especialidades?.message}
                placeholder="Seleccione las especialidades del técnico"
              />
            )} />
            {errors.especialidades && <p className="text-sm text-red-500">{errors.especialidades.message}</p>}
          </div>
        )}

        <Button type="submit" className="w-full">Guardar</Button>
      </form>
    </Card>
  );
}
