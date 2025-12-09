import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import UsuarioService from "@/services/UsuarioService";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function Login() {
    const { saveUser } = useUser();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

const schema = yup.object({
    correo: yup.string().email(t("login.emailInvalid")).required(t("login.emailRequired")),
    contraseña: yup.string().required(t("login.passwordRequired")),
});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            data.fecha = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Costa_Rica'}));
            const response = await UsuarioService.loginUser(data);
            const verU = await UsuarioService.getUsers(data);
            console.log(verU);
            if (response.data != null
                && response.data != 'undefined'
                && response.data.message != 'Usuario no valido'
            ) {
                //Guardar token
                saveUser(response.data.data);
                toast.success(t("login.loginSuccess"));
                navigate("/");
            } else {
                toast.error(t("login.invalidCredentials"));
            }
        } catch (error) {
            toast.error(t("login.loginError"));
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg border border-white/10 bg-white/10 backdrop-blur-lg text-black">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">{t("login.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="correo" className="text-black">
                                {t("login.email")}
                            </Label>
                            <Input
                                id="correo"
                                type="email"
                                placeholder={t("login.emailPlaceholder")}
                                {...register("correo")}
                                className="text-gray-900 placeholder:text-gray-400 border border-gray-300 "
                            />
                            {errors.correo && (
                                <p className="text-red-400 text-sm mt-1">{errors.correo.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="contraseña" className="text-black">
                                {t("login.password")}
                            </Label>
                            <div className="flex gap-2">
                            <Input
                                id="contraseña"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("contraseña")}
                                className="bg-white text-black placeholder:text-gray-400 border border-gray-300 "
                            />
                            {errors.contraseña && (
                                <p className="text-red-400 text-sm mt-1">{errors.contraseña.message}</p>
                            )}
                                             <button
                                               type="button"
                                               onClick={togglePasswordVisibility}
                                               className="text-black/60 hover:text-black transition-colors"
                                             >
                                               {showPassword ? (
                                                 <EyeOff className="h-4 w-4" />
                                               ) : (
                                                 <Eye className="h-4 w-4" />
                                               )}
                                             </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full hover:bg-primary/80 text-white font-semibold mt-2"
                        >
                            {isSubmitting ? t("login.submitting") : t("login.submit")}
                        </Button>

                        <p className="text-sm text-center mt-4 text-gray-300">
                            {t("login.noAccount")}{" "}
                            <a href="/usuario/create" className="text-accent underline hover:text-accent/80">
                                {t("login.register")}
                            </a>
                        </p>
                    </form>

                </CardContent>
            </Card>
        </div>
    );
}
