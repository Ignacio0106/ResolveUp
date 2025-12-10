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
import { data } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function CreateUsuario() {
  const [error, setError] = useState("");          // Errores de carga
  const [backendError, setBackendError] = useState(""); // Errores del backend
  const {t}= useTranslation();
  const userSchema = yup.object({
    nombre: yup.string().required(t("usuario.fields.nombre.validation.required")),
    correo: yup.string().email(t("usuario.fields.correo.validation.email")).required(t("usuario.fields.correo.validation.required")),
    password: yup.string().required(t("usuario.fields.password.validation.required")).min(8, t("usuario.fields.correo.tamaño")),
    idRol: yup.number().required(t("usuario.fields.idRol.validation.required")).default(3),
  });

  const { control, watch, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { nombre: "", correo: "", password: "", idRol: 3,},
    resolver: yupResolver(userSchema),
  });

  const selectedRole = Number(watch("idRol"));


  const onSubmit = async (dataForm) => {
    console.log("Entro: ", dataForm);
    setBackendError(""); // limpiar error previo
    try {
      const usuarioN = {
        nombre: dataForm.nombre,
        correo: dataForm.correo,
        password: dataForm.password,
        idRol: dataForm.idRol,
      };

      const response = await UsuarioService.createUser(usuarioN);

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
      setBackendError(t("usuario.errorCreate") + ": " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t("createUsuario.title")}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {backendError && <p className="text-red-600 mb-4">{backendError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <Label>{t("usuario.fields.nombre.label")}</Label>
          <Controller name="nombre" control={control} render={({ field }) => (
            <Input {...field} placeholder={t("usuario.fields.nombre.placeholder")} />
          )} />
          {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
        </div>

        <div>
          <Label>{t("usuario.fields.correo.label")}</Label>
          <Controller name="correo" control={control} render={({ field }) => (
            <Input {...field} placeholder={t("usuario.fields.correo.placeholder")} />
          )} />
          {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}
        </div>

        <div>
          <Label>{t("usuario.fields.password.label")}</Label>
          <Controller name="password" control={control} render={({ field }) => (
            <Input {...field} type="password" placeholder={t("usuario.fields.password.placeholder")} />
          )} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <Label>{t("usuario.fields.idRol.label")}</Label>
            <Input value={t("usuario.fields.idRol.defaultValue")} readOnly />

        </div>
          <Controller name="idRol" control={control} render={({ field }) => (
            <Input {...field} value={3} type="hidden" />
          )} />
        <Button type="submit" className="w-full">{t("usuario.buttons.save")}</Button>
      </form>
    </Card>
  );
}
