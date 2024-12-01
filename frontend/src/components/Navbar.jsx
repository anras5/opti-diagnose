import {LuAlignJustify, LuX} from "react-icons/lu";
import {Box, Collapsible, Flex, IconButton, Link, Link as ChakraLink, Stack, Text,} from '@chakra-ui/react';
import {ColorModeButton, useColorModeValue} from "./ui/color-mode.jsx";
import {useState} from "react";
import {Link as ReactRouterLink, useNavigate} from 'react-router';
import {Button} from "./ui/button.jsx";
import {useAuth} from "../context/AuthContext.jsx";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const {isLoggedIn, logout} = useAuth();
    const navigate = useNavigate();

    return (
        <Box>
            <Collapsible.Root>
                <Flex
                    bg={useColorModeValue('gray.100', 'gray.900')}
                    py={{base: 2}}
                    px={{base: 4}}
                    align={'center'}
                >
                    <Flex
                        flex={{base: 1, md: 'auto'}}
                        ml={{base: -2}}
                        display={{base: 'flex', md: 'none'}}>
                        <Collapsible.Trigger
                            as={IconButton}
                            onClick={() => {
                                setIsOpen(!isOpen)
                            }}
                            aria-label={'Toggle Navigation'}
                            size={'lg'}
                            variant={'ghost'}
                            bg={'transparent'}
                            _hover={{
                                bgColor: 'transparent',
                            }}
                        >
                            {isOpen ? <LuX w={3} h={3}/> : <LuAlignJustify w={5} h={5}/>}
                        </Collapsible.Trigger>
                    </Flex>
                    <Flex flex={{base: 1}} justify={{base: 'center', md: 'start'}}>
                        <IconButton variant={'link'} mb={2}>
                            <div>
                                <img src="/vite.svg" alt=""/>
                            </div>
                        </IconButton>
                        <Flex display={{base: 'none', md: 'flex'}} ml={10}>
                            <DesktopNav/>
                        </Flex>
                    </Flex>
                    <Stack
                        flex={{base: 1, md: 0}}
                        justify={'flex-end'}
                        direction={'row'}
                        gap={{base: 2, lg: 3, xl: 6}}
                    >
                        <ColorModeButton
                            _hover={{
                                bgColor: 'transparent',
                            }}
                        />
                        {isLoggedIn === null ?
                            <></> :
                            isLoggedIn ?
                                <Button
                                    colorPalette={'red'}
                                    onClick={logout}
                                    variant={'outline'}
                                >
                                    Log out
                                </Button> :
                                <Button
                                    colorPalette={'teal'}
                                    onClick={() => navigate("/login")}
                                >
                                    Log in
                                </Button>
                        }

                    </Stack>
                </Flex>
                <Collapsible.Content>
                    <MobileNav/>
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
}

const DesktopNav = () => {
    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <ChakraLink
                        as={ReactRouterLink}
                        to={navItem.href}
                        p={3}
                        fontSize={'md'}
                        fontWeight={700}
                        _hover={{
                            textDecoration: 'none',
                        }}
                    >
                        {navItem.label}
                    </ChakraLink>
                </Box>
            ))}
        </Stack>
    );
};

const MobileNav = () => {
    return (
        <Stack
            p={4}
            display={{md: 'none'}}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({label, href}) => {
    return (
        <Stack spacing={4}>
            <Flex
                py={2}
                as={Link}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.100', 'gray.200')}
                >
                    {label}
                </Text>
            </Flex>
        </Stack>
    );
};

const NAV_ITEMS = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Patients',
        href: '/patients',
    }
];