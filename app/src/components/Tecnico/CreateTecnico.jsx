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
import { useTranslation } from "react-i18next";

export function CreateTecnico() {
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showNewEspecialidad, setShowNewEspecialidad] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState("");
  const { t } = useTranslation();

  // Esquema de validación con Yup
  const tecnicoSchema = yup.object({
    nombre: yup.string().required(t("technician.fields.fullName.validation.required")),
    correo: yup.string().email(t("technician.fields.email.validation.email")).required(t("technician.fields.email.validation.required")),
    password: yup.string().required(t("technician.fields.password.validation.required")),
    especialidades: yup.array().min(1, t("technician.fields.specialties.validation.required")),
    disponibilidad: yup.string().required(t("technician.fields.availability.validation.required")),
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
      disponibilidad: "1", 
      especialidades: [],
    },
    resolver: yupResolver(tecnicoSchema),
  });

  // Cargar especialidades
  useEffect(() => {
    EspecialidadService.getAll()
      .then(res => setEspecialidades(res.data?.data || []))
      .catch(err => setError(t("technician.error") + ": " + err));
  }, []);

  const crearNuevaEspecialidad = async () => {
    if (!newEspecialidad.trim())
      return toast.error(t("technician.fields.specialties.validation.required"));

    try {
      await EspecialidadService.create({ nombre: newEspecialidad.trim() });
      toast.success(t("technician.fields.specialties.newPlaceholder"));

      const res = await EspecialidadService.getAll();
      setEspecialidades(res.data?.data || []);
      setNewEspecialidad("");
      setShowNewEspecialidad(false);
    } catch (err) {
      toast.error(t("technician.error") + ": " + err);
    }
  };

  const onSubmit = async (dataForm) => {
    const payload = {
      nombre: dataForm.nombre,
      correo: dataForm.correo,
      password: dataForm.password,
      especialidades: dataForm.especialidades.map(id => ({
        idEspecialidad: id,
      })),
      disponibilidad: Number(dataForm.disponibilidad),
      cargaTrabajo: 0,
    };

    try {
      const response = await TecnicoService.createTecncio(payload);

      if (response.data.success) {
        toast.success(t("technician.toast.successCreate"));
        
        reset();
        navigate("/tecnico/table");
      } else {
        toast.error(t("technician.toast.errorCreate"));
      }
    } catch (err) {
      toast.error(t("technician.toast.errorCreateGeneric") + " " + err);
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t("technician.createTitle")}</h2>

      {error && <p className="text-red-600 mb-4">{t("technician.error")}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Nombre */}
        <div>
          <Label>{t("technician.fields.fullName.label")}</Label>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t("technician.fields.fullName.placeholder")} />
            )}
          />
          {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
        </div>

        {/* Correo */}
        <div>
          <Label>{t("technician.fields.email.label")}</Label>
          <Controller
            name="correo"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t("technician.fields.email.placeholder")} />
            )}
          />
          {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <Label>{t("technician.fields.password.label")}</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input {...field} type="password" placeholder={t("technician.fields.password.placeholder")} />
            )}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        {/* Disponibilidad */}
        <div>
          <Label>{t("technician.fields.availability.label")}</Label>
          <Controller
            name="disponibilidad"
            control={control}
            render={({ field }) => (
              <select {...field} className="border rounded px-3 py-2 w-full">
                <option value="1">{t("technician.fields.availability.options.available")}</option>
                <option value="0">{t("technician.fields.availability.options.unavailable")}</option>
              </select>
            )}
          />
          {errors.disponibilidad && <p className="text-red-500 text-sm">{errors.disponibilidad.message}</p>}
        </div>

        {/* Especialidades */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Controller
              name="especialidades"
              control={control}
              render={({ field }) => (
                <CustomMultiSelect
                  field={field}
                  data={especialidades}
                  label={t("technician.fields.specialties.label")}
                  getOptionLabel={(item) => item.nombre}
                  getOptionValue={(item) => item.id}
                  error={errors.especialidades?.message}
                  placeholder={t("technician.fields.specialties.placeholder")}
                />
              )}
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

          {errors.especialidades && <p className="text-sm text-red-500">{errors.especialidades.message}</p>}

          {/* Crear nueva especialidad */}
          {showNewEspecialidad && (
            <div className="flex gap-2 mb-3 p-3 border rounded bg-muted/30">
              <Input
                placeholder={t("technician.fields.specialties.newPlaceholder")}
                value={newEspecialidad}
                onChange={(e) => setNewEspecialidad(e.target.value)}
              />
              <Button type="button" onClick={crearNuevaEspecialidad}>
                {t("technician.fields.specialties.addNew")}
              </Button>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">{t("technician.buttons.saveTechnician")}</Button>
      </form>
    </Card>
  );
}
