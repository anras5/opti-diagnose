import {useAuth} from "../context/AuthContext.jsx";
import {Navigate} from "react-router";

const ProtectedRoute = ({children}) => {
    const {isLoggedIn} = useAuth();

    if (isLoggedIn === null) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;