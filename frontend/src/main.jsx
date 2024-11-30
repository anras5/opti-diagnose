import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from "./components/ui/provider"
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./components/home/Home.jsx";
import Login from "./components/login/Login.jsx";
import Patients from "./components/patients/Patients.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Provider>
                <Routes>
                    <Route path={"/"} element={<App/>}>
                        <Route index element={<Home/>}/>
                        <Route path={"login"} element={<Login/>}/>
                        <Route path={"patients"} element={
                            <ProtectedRoute>
                                <Patients/>
                            </ProtectedRoute>
                        }/>
                    </Route>
                </Routes>
            </Provider>
        </BrowserRouter>
    </StrictMode>,
)