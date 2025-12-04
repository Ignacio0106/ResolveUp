import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";


export default function UserProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);

    // 🔹 Decodifica el token y guarda datos del usuario
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Token inválido:", error);
                clearUser();
            }
        }
    }, [token]);

    // 🔹 Guardar token y persistir sesión
    const saveUser = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    // 🔹 Cerrar sesión
    const clearUser = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    // 🔹 Decodificar token manualmente
    const decodeToken = () => {
        try {
            return token ? jwtDecode(token) : null;
        } catch {
            return null;
        }
    };

    // 🔹 Verificar roles: recibe un arreglo de roles requeridos
    const authorize = (requiredRoles = []) => {
        const decoded = decodeToken();
        if (!decoded || !decoded.rol) return false;
        console.log("Rol",decoded.rol);
        return requiredRoles.includes(decoded.rol.nombre);
    };

    const isAuthenticated = !!token;

    return (
        <UserContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                saveUser,
                clearUser,
                decodeToken,
                authorize,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};