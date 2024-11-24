import {Heading, Stack, Text} from "@chakra-ui/react";
import {useColorModeValue} from "../ui/color-mode.jsx";
import {Button} from "../ui/button.jsx";

const Home = () => {

    return (
        <Stack
            textAlign={'center'}
            align={'center'}
            py={{base: 10, md: 20}}
            mx={{base: 10, md: 0}}
        >
            <Heading
                fontWeight={600}
                fontSize={{base: '3xl', sm: '4xl', md: '6xl'}}
                lineHeight={'110%'}
                color={useColorModeValue('teal.600', 'white')}
                py={3}
            >
                Opti Diagnose
            </Heading>
            <Text color={'gray.500'} maxW={'3xl'} fontSize={{base: 'sm', sm: 'lg'}} py={3}>
                Transform eye care with <b>Opti Diagnose</b>, an innovative AI-powered solution designed to
                revolutionize
                disease detection in ophthalmology. Harnessing advanced analysis of OCT scans, our application empowers
                clinicians with accurate, efficient, and reliable insights. Choose<br/> <b>Opti Diagnose</b> for a
                smarter approach
                to eye health diagnostics, where precision meets simplicity in every decision.
            </Text>
            <Stack spacing={6} direction={'row'}>
                <Button
                    px={6}
                    colorPalette={"teal"}
                    // onClick={() => navigate("/signup")}
                >
                    Log in
                </Button>
                <Button px={6} variant={'outline'} colorPalette={"teal"}>
                    Learn more
                </Button>
            </Stack>
        </Stack>
    )


}

export default Home;