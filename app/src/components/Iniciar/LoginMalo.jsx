import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUser } from "../hooks/useUser";
import UserService from "@/services/UserService";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  LaptopMinimalCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";


const schema = yup.object({
  email: yup
    .string()
    .email("Por favor ingresa un correo válido")
    .required("El correo electrónico es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

export default function LoginMalo() {
  const { saveUser } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ 
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await UserService.loginUser(data);
      
      if (response?.data && 
          response.data !== 'undefined' && 
          response.data.message !== 'Usuario no valido') {
        
        // Guardar usuario
        saveUser(response.data.data);
        
        // Toast de éxito con animación
        toast.success("¡Bienvenido de vuelta!", {
          icon: "🎉",
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        // Pequeño delay para mejor UX
        setTimeout(() => {
          navigate("/");
        }, 1000);
        
      } else {
        toast.error("Credenciales incorrectas", {
          icon: "🚫",
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error("Error de login:", error);
      toast.error("Error del servidor. Inténtalo más tarde", {
        icon: "⚠️",
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <LaptopMinimalCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Iniciar Sesión
          </CardTitle>
          <p className="text-white/70 text-sm mt-2">
            Ingresa a tu cuenta de ResolveUp
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo electrónico
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  {...register("email")}
                  className={`
                    bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/50 
                    focus:bg-white/15 transition-all duration-200 pr-10
                    ${errors.email 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                      : watchedEmail && !errors.email 
                        ? 'border-green-400 focus:border-green-400 focus:ring-green-400/20'
                        : 'border-white/30 focus:border-blue-400 focus:ring-blue-400/20'
                    }
                  `}
                />
                {/* Indicador de validación */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {watchedEmail && (
                    errors.email ? (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    )
                  )}
                </div>
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`
                    bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/50 
                    focus:bg-white/15 transition-all duration-200 pr-20
                    ${errors.password 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                      : watchedPassword && !errors.password 
                        ? 'border-green-400 focus:border-green-400 focus:ring-green-400/20'
                        : 'border-white/30 focus:border-blue-400 focus:ring-blue-400/20'
                    }
                  `}
                />
                {/* Botones de contraseña */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {watchedPassword && (
                    errors.password ? (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    )
                  )}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Enlace "Olvidé mi contraseña" */}
            <div className="flex justify-end">
              <Link 
                to="/user/forgot-password" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Separator className="bg-white/20" />
          
          {/* Enlaces adicionales */}
          <div className="flex flex-col items-center space-y-3 w-full">
            <p className="text-sm text-white/70">
              ¿No tienes una cuenta?
            </p>
            <Link 
              to="/user/create"
              className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 border border-white/20"
            >
              <UserPlus className="h-4 w-4" />
              Crear cuenta nueva
            </Link>
          </div>

          {/* Información adicional */}
          <div className="text-center">
            <p className="text-xs text-white/50">
              Al iniciar sesión, aceptas nuestros{" "}
              <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline">
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link to="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">
                Política de Privacidad
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>

      {/* Información de versión */}
      <div className="absolute bottom-4 right-4 text-white/30 text-xs">
        ResolveUp v2.0
      </div>
    </div>
  );
}