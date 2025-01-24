import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from "./components/ui/provider"
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./components/home/Home.jsx";
import Login from "./components/login/Login.jsx";
import Patients from "./components/patients/Patients.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Examinations from "./components/examinations/Examinations.jsx";
import PatientNew from "./components/patients/PatientNew.jsx";
import PatientEdit from "./components/patients/PatientEdit.jsx";
import ExaminationNew from "./components/examinations/ExaminationNew.jsx";
import Examination from "./components/examinations/Examination.jsx";

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
                        <Route path={"patients/new"} element={
                            <ProtectedRoute>
                                <PatientNew/>
                            </ProtectedRoute>
                        }/>
                        <Route path={"patients/:id/edit"} element={
                            <ProtectedRoute>
                                <PatientEdit/>
                            </ProtectedRoute>
                        }/>
                        <Route path={"patients/:id/examinations"} element={
                            <ProtectedRoute>
                                <Examinations/>
                            </ProtectedRoute>
                        }/>
                        <Route path={"patients/:patient_id/examinations/:id"} element={
                            <ProtectedRoute>
                                <Examination/>
                            </ProtectedRoute>
                        }/>
                        <Route path={"patients/:id/examinations/new"} element={
                            <ProtectedRoute>
                                <ExaminationNew/>
                            </ProtectedRoute>
                        }/>
                    </Route>
                </Routes>
            </Provider>
        </BrowserRouter>
    </StrictMode>,
)