import {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const refreshToken = localStorage.getItem("refresh");
        if (refreshToken) {
            fetch("http://localhost:8080/api/token/refresh/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `{"refresh": "${refreshToken}"}`
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Invalid refresh token!");
                    }
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem("access", data.access);
                    setIsLoggedIn(true);
                })
                .catch(() => {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    setIsLoggedIn(false);
                });
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem("access", accessToken);
        localStorage.setItem("refresh", refreshToken);
        setIsLoggedIn(true);
        navigate("/patients");
    };

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);