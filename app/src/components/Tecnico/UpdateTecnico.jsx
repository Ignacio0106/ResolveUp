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
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { useUser } from "@/hooks/useUser";

// Esquema de validación con Yup


export function UpdateTecnico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUser();

  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState("");
  const [showNewEspecialidad, setShowNewEspecialidad] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState("");

    const tecnicoSchema = yup.object({
    nombreUsuario: yup.string().required(t("technician.fields.fullName.validation.required")),
    correoUsuario: yup.string().email(t("technician.fields.email.validation.email")).required(t("technician.fields.email.validation.required")),
    password: yup.string().required(t("technician.fields.password.validation.required")),
    especialidades: yup.array().min(1, t("technician.fields.specialties.validation.required")),
    disponibilidad: yup.string().required(t("technician.fields.availability.validation.required")),
  });
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(tecnicoSchema),
    defaultValues: { nombreUsuario: "", correoUsuario: "", password: "", especialidades: [], disponibilidad: "1" },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [espRes] = await Promise.all([
          EspecialidadService.getAll(),
        ]);

        const especialidadesData = espRes.data?.data || [];
        setEspecialidades(especialidadesData);

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
        toast.error(t("technician.error"));
        setError(t("technician.error"));
      }
    };

    fetchData();
  }, [id, reset]);

  const crearNuevaEspecialidad = async () => {
    if (!newEspecialidad.trim()) return toast.error(t("technician.fields.specialties.validation.required"));

    try {
      await EspecialidadService.create({ nombre: newEspecialidad.trim() });
      toast.success(t("technician.fields.specialties.newPlaceholder"));

      const res = await EspecialidadService.getAll();
      setEspecialidades(res.data?.data || []);

      setNewEspecialidad("");
      setShowNewEspecialidad(false);
    } catch (err) {
      console.error(err);
      toast.error(t("technician.fields.specialties.errorCreate"));
    }
  };

  const onSubmit = async (dataForm) => {
    const payload = {
      usuarioLogueadoId: user?.id,
      idTicket: Number(id),
      nombre: dataForm.nombreUsuario,
      correo: dataForm.correoUsuario,
      especialidades: dataForm.especialidades.map(e => ({
        idEspecialidad: Number(e)
      })),
      disponibilidad: Number(dataForm.disponibilidad),
      cargaTrabajo: 0,
    };

    if (dataForm.password) payload.password = dataForm.password;

    try {
      console.log("Payload para actualización:", payload);
      const response = await TecnicoService.update(payload);

      if (response.data.success) {
        toast.success(t("technician.toast.successUpdate"));
        navigate("/tecnico/table");
      } else {
        toast.error(response.data.message || t("technician.toast.errorUpdate"));
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(t("technician.toast.errorUpdateGeneric") + " " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t("technician.updateTitle")}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>{t("technician.fields.fullName.label")}</Label>
          <Controller name="nombreUsuario" control={control} render={({ field }) => (
            <Input {...field} placeholder={t("technician.fields.fullName.placeholder")} />
          )} />
          {errors.nombreUsuario && <p className="text-red-500">{errors.nombreUsuario.message}</p>}
        </div>

        <div>
          <Label>{t("technician.fields.email.label")}</Label>
          <Controller name="correoUsuario" control={control} render={({ field }) => (
            <Input {...field} placeholder={t("technician.fields.email.placeholder")} />
          )} />
          {errors.correoUsuario && <p className="text-red-500">{errors.correoUsuario.message}</p>}
        </div>

        <div>
          <Label>{t("technician.fields.password.label")}</Label>
          <Controller name="password" control={control} render={({ field }) => (
            <Input {...field} type="password" placeholder={t("technician.fields.password.placeholder")} />
          )} />
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
                  value={field.value}
                  onChange={field.onChange}
                  data={especialidades}
                  getOptionLabel={(item) => item.nombre}
                  getOptionValue={(item) => item.id}
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

        <Button type="submit" className="w-full">{t("technician.buttons.updateTechnician")}</Button>
      </form>
    </Card>
  );
}
