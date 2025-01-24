import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Box, Collapsible, Heading, HStack, IconButton, Input, SimpleGrid, Table, Text, VStack} from "@chakra-ui/react";
import {PaginationNextTrigger, PaginationPageText, PaginationPrevTrigger, PaginationRoot} from "../ui/pagination.jsx";
import {LuFileEdit, LuSearch, LuTrash2, LuUser, LuUserPlus} from "react-icons/lu";
import {useNavigate} from "react-router";
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog.jsx";
import {Button} from "../ui/button.jsx";

const Patients = () => {

    // auth, navigate
    const {logout} = useAuth();
    const navigate = useNavigate();

    // state
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);

    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        fetch("http://localhost:8088/api/patients/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Failed to fetch patients data!");
        }).then(data => {
            setPatients(data);
            setFilteredPatients(data);
        }).catch(error => {
            logout();
            console.log(error.message);
        });
    }, []);

    const deletePatient = (id) => {
        fetch(`http://localhost:8088/api/patients/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
        }).then(response => {
            if (response.ok) {
                setPatients(patients.filter(patient => patient.id !== id));
                setFilteredPatients(filteredPatients.filter(patient => patient.id !== id));
            } else {
                throw new Error("Failed to delete patient!");
            }
        }).catch(error => {
            logout();
            console.log(error.message);
        })
    }

    const filterPatients = (searchTerm) => {
        if (searchTerm === "") {
            setFilteredPatients(patients);
            return;
        }
        const newFilteredPatients = patients.filter(patient =>
            patient.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(newFilteredPatients);
    }

    return (
        <VStack
            py={10}
            mx={"auto"}
            w={{base: "90%", md: "70%"}}
        >
            <Heading size={{base: '2xl', md: '6xl'}} mb={5}>Patients</Heading>

            <Collapsible.Root width={"100%"}>
                <SimpleGrid columns={3} width={"100%"}>
                    <Box></Box>
                    <PaginationRoot
                        m={"auto"}
                        count={filteredPatients.length}
                        pageSize={pageSize}
                        page={page}
                        onPageChange={(details) => {
                            setPage(details.page);
                        }}
                    >
                        <HStack gap={4}>
                            <PaginationPrevTrigger/>
                            <PaginationPageText/>
                            <PaginationNextTrigger/>
                        </HStack>
                    </PaginationRoot>
                    <Box textAlign={"end"}>
                        <Collapsible.Trigger>
                            <Button me={1} variant={"outline"}>
                                <LuSearch/>
                            </Button>
                        </Collapsible.Trigger>
                        <Button
                            colorPalette={"teal"}
                            variant={"outline"}
                            onClick={() => {
                                navigate("/patients/new");
                            }}
                        >
                            <LuUserPlus/> New Patient
                        </Button>
                    </Box>
                </SimpleGrid>

                <Collapsible.Content width={"100%"} my={2}>
                    <Input
                        colorPalette={"teal"}
                        placeholder="Search for patient"
                        onChange={(e) => filterPatients(e.target.value)}
                    />
                </Collapsible.Content>

            </Collapsible.Root>

            <Table.Root
                colorPalette={"teal"}
                variant={"outline"}
                borderRadius={8}
                showColumnBorder
            >
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>First Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Last Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Email</Table.ColumnHeader>
                        <Table.ColumnHeader>Birth Date</Table.ColumnHeader>
                        <Table.ColumnHeader>Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {filteredPatients.slice((page - 1) * pageSize, page * pageSize).map(patient => (
                        <Table.Row key={patient.id}>
                            <Table.Cell>{patient.firstname}</Table.Cell>
                            <Table.Cell>{patient.lastname}</Table.Cell>
                            <Table.Cell>{patient.email}</Table.Cell>
                            <Table.Cell>{patient.birthdate}</Table.Cell>
                            <Table.Cell maxW={"100px"}>
                                <HStack>
                                    {/* navigate to examinations */}
                                    <IconButton
                                        colorPalette={"blue"} size={"xs"} variant={'outline'}
                                        onClick={() => {
                                            navigate(`/patients/${patient.id}/examinations`);
                                        }}
                                    >
                                        <LuUser/>
                                    </IconButton>

                                    {/* edit patient */}
                                    <IconButton colorPalette={"orange"} size={"xs"} variant={'outline'}
                                                onClick={() => {
                                                    navigate(`/patients/${patient.id}/edit`);
                                                }}
                                    >
                                        <LuFileEdit/>
                                    </IconButton>

                                    {/* delete patient */}
                                    <DialogRoot role={"alertdialog"}>
                                        <DialogTrigger asChild>
                                            <IconButton colorPalette={"red"} size={"xs"} variant={"outline"}>
                                                <LuTrash2/>
                                            </IconButton>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete patient?</DialogTitle>
                                            </DialogHeader>
                                            <DialogBody>
                                                <Text>
                                                    Are you sure you want to
                                                    delete {patient.firstname} {patient.lastname}?
                                                </Text>
                                            </DialogBody>
                                            <DialogFooter>
                                                <DialogActionTrigger asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogActionTrigger>
                                                <DialogActionTrigger asChild>
                                                    <Button colorPalette={"red"} onClick={() => {
                                                        deletePatient(patient.id);
                                                    }}>Delete</Button>
                                                </DialogActionTrigger>
                                            </DialogFooter>
                                            <DialogCloseTrigger/>
                                        </DialogContent>
                                    </DialogRoot>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </VStack>
    )
}

export default Patients;