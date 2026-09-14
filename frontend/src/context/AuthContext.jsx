import { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    const login = async (email, password) => {

        const response = await authService.login({
            email,
            password,
        });

        localStorage.setItem("token", response.token);

        const userData = {
            userId: response.userId,
            name: response.name,
            email: response.email,
            role: response.role,
        };

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setToken(response.token);
        setUser(userData);

        return response;
    };

    const register = async (name, email, password) => {

        const response = await authService.register({
            name,
            email,
            password,
        });

        return response;
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};