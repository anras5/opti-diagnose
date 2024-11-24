import Navbar from "./components/navbar/Navbar.jsx";
import Home from "./components/home/Home.jsx";
import {useColorModeValue} from "./components/ui/color-mode.jsx";
import {Box} from "@chakra-ui/react";


const App = () => {
    return (
        <Box
            bgColor={useColorModeValue('gray.100', 'gray.800')}
            minH={'100vh'}
        >
            <Navbar/>
            <Home/>
        </Box>
    )
}

export default App;
