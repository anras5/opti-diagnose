import Navbar from "./components/Navbar.jsx";
import {useColorModeValue} from "./components/ui/color-mode.jsx";
import {Box} from "@chakra-ui/react";
import {Outlet} from "react-router";
import {Toaster} from "./components/ui/toaster.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";

const App = () => {
    return (
        <AuthProvider>
            <Box
                bgColor={useColorModeValue('gray.100', 'gray.900')}
                minH={'100vh'}
            >
                <Navbar/>
                <Outlet />
                <Toaster />
            </Box>
        </AuthProvider>
    )
}

export default App;