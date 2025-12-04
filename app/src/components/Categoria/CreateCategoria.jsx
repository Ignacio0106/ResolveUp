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
// Services
import SlaService from "@/services/SlaService";
import EtiquetaService from "@/services/EtiquetaService";
import EspecialidadService from "@/services/EspecialidadService";
import CategoriasService from "@/services/CategoriasService";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";
import { useTranslation } from "react-i18next";


export default function CreateCategoria({ onSuccess }) {

    const { t } = useTranslation();

// Validation Yup
const schema = yup.object().shape({
  nombre: yup.string().required(t("category.list.validation.categoryName")),
  idSLA: yup.number().typeError(t("category.list.validation.selectSla")).required(t("category.list.validation.selectSla")),
  etiquetas: yup.array().min(1, t("category.list.validation.selectLabel")),
  especialidades: yup.array().min(1, t("category.list.validation.selectSpecialty")),
});

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

  // States
  const [slas, setSlas] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // States for creating new SLA
  const [showNewSla, setShowNewSla] = useState(false);
  const [newSla, setNewSla] = useState({
    tiempoRespuesta: "",
    tiempoResolucion: ""
  });
  const [showNewEtiqueta, setShowNewEtiqueta] = useState(false);
  const [newEtiqueta, setNewEtiqueta] = useState("");
  const [showNewEspecialidad, setShowNewEspecialidad] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState("");

  // Fetch initial data
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
        console.error("Error loading data:", error);
        toast.error(t("category.errorTitle"));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const createNewSLA = async () => {
    const responseTime = Number(newSla.tiempoRespuesta);
    const resolutionTime = Number(newSla.tiempoResolucion);

    // Validations
    if (!responseTime || responseTime <= 0) {
      return toast.error(t("category.list.validation.responseTime"));
    }

    if (!resolutionTime || resolutionTime <= 0) {
      return toast.error(t("category.list.validation.resolutionTime"));
    }

    if (resolutionTime <= responseTime) {
      return toast.error(t("category.list.validation.resolutionGreaterThanResponse"));
    }

    try {
      await SlaService.create({
        tiempoRespuesta: responseTime,
        tiempoResolucion: resolutionTime,
      });

      toast.success(t("category.list.toast.successCreateSLA"));

      // Reload list
      const res = await SlaService.getAll();
      setSlas(res.data?.data || []);

      // Reset
      setNewSla({ tiempoRespuesta: "", tiempoResolucion: "" });
      setShowNewSla(false);

    } catch (err) {
      console.error(err);
      toast.error(t("category.toast.errorCreate"));
    }
  };

  // Create Label
  const createNewLabel = async () => {
    if (!newEtiqueta.trim()) {
      return toast.error(t("category.list.validation.enterTagName"));
    }

    try {
      // Create in DB
      await EtiquetaService.create({
        nombre: newEtiqueta.trim(),
      });

      toast.success(t("category.list.toast.successCreateEti"));

      // Reload labels list
      const res = await EtiquetaService.getAll();
      setEtiquetas(res.data?.data || []);

      // Reset
      setNewEtiqueta("");
      setShowNewEtiqueta(false);

    } catch (err) {
      console.error(err);
      toast.error(t("category.list.toast.errorCreate"));
    }
  };

  // Create Specialty
  const createNewSpecialty = async () => {
    if (!newEspecialidad.trim()) return toast.error(t("category.list.validation.enterSpecialtyName"));
    try {
      await EspecialidadService.create({ nombre: newEspecialidad.trim() });
      toast.success(t("category.list.toast.successCreateEs"));
      const res = await EspecialidadService.getAll();
      setEspecialidades(res.data?.data || []);
      setNewEspecialidad("");
      setShowNewEspecialidad(false);
    } catch (err) {
      console.error(err);
      toast.error(t("category.list.toast.errorCreate"));
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

      toast.success(t("category.list.toast.successCreate"));
      navigate("/categoria/table");
      reset({
        nombre: "",
        idSLA: null,
        etiquetas: [],
        especialidades: [],
      });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(t("category.toast.errorCreate"));
    }
  };

  if (loading) return <p className="text-center mt-6">{t("category.loadingData")}</p>;

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">{t("category.createTitle")}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name */}
        <div>
          <Label>{t("category.fields.name.label")}</Label>
          <Input {...register("nombre")} placeholder={t("category.fields.name.placeholder")} />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        {/* SLA */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>SLA</Label>

            {/* Button + to show form */}
            <Button type="button" variant="outline" size="icon"
              onClick={() => setShowNewSla(!showNewSla)}
            >
              +
            </Button>
          </div>

          {/* Hidden form for new SLA */}
          {showNewSla && (
            <div className="grid grid-cols-2 gap-2 mb-4 p-3 border rounded-lg bg-muted/30">
              <Input
                placeholder="Response Time (min)"
                type="number"
                value={newSla.tiempoRespuesta}
                onChange={(e) => setNewSla({ ...newSla, tiempoRespuesta: e.target.value })}
              />

              <Input
                placeholder="Resolution Time (min)"
                type="number"
                value={newSla.tiempoResolucion}
                onChange={(e) => setNewSla({ ...newSla, tiempoResolucion: e.target.value })}
              />

              <Button className="col-span-2" type="button" onClick={createNewSLA}>
                {t("category.buttons.saveSla")}
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
                  <SelectValue placeholder={t("category.categorySla.placeholder")} />
                </SelectTrigger>

                <SelectContent>
                  {slas.map(sla => (
                    <SelectItem key={sla.id} value={sla.id.toString()}>
                      {`${t("category.categorySla.label")}: ${sla.tiempoRespuesta} ${t("category.categorySla.minutes")} / ${t("category.categorySla.resolutionTime")}: ${sla.tiempoResolucion} ${t("category.categorySla.minutes")}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.idSLA && <p className="text-sm text-red-500">{errors.idSLA.message}</p>}
        </div>

         {/* Labels */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label></Label>
            <Button type="button" variant="outline" size="icon" onClick={() => setShowNewEtiqueta(!showNewEtiqueta)}>+</Button>
          </div>

          {showNewEtiqueta && (
            <div className="flex gap-2 mb-3 p-3 border rounded bg-muted/30">
              <Input
                placeholder="Label name"
                value={newEtiqueta}
                onChange={(e) => setNewEtiqueta(e.target.value)}
              />
              <Button type="button" onClick={createNewLabel}>{t("category.buttons.saveLabel")}</Button>
            </div>
          )}

          <Controller
            name="etiquetas"
            control={control}
            render={({ field }) => (
              <CustomMultiSelect
                field={field}
                data={etiquetas}
                label={t("category.placeholderEti")}
                getOptionLabel={item => item.nombre}
                getOptionValue={item => item.id}
                error={errors.etiquetas?.message}
                placeholder={t("category.placeholderEti")}
              />
            )}
          />
        </div>

        {/* Specialties */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label></Label>
            <Button type="button" variant="outline" size="icon" onClick={() => setShowNewEspecialidad(!showNewEspecialidad)}>+</Button>
          </div>

          {showNewEspecialidad && (
            <div className="flex gap-2 mb-3 p-3 border rounded bg-muted/30">
              <Input
                placeholder="Specialty name"
                value={newEspecialidad}
                onChange={(e) => setNewEspecialidad(e.target.value)}
              />
              <Button type="button" onClick={createNewSpecialty}>{t("category.buttons.saveSpecialty")}</Button>
            </div>
          )}

          <Controller
            name="especialidades"
            control={control}
            render={({ field }) => (
              <CustomMultiSelect
                field={field}
                data={especialidades}
                label={t("category.placeholderEs")}
                getOptionLabel={item => item.nombre}
                getOptionValue={item => item.id}
                error={errors.especialidades?.message}
                placeholder={t("category.placeholderEs")}
              />
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-2">
          {t("category.buttons.saveCategory")}
        </Button>

      </form>
    </Card>
  );
}
