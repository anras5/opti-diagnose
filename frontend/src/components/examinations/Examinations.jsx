import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {Heading, HStack, IconButton, SimpleGrid, Table, Text, VStack} from "@chakra-ui/react";
import {useAuth} from "../../context/AuthContext.jsx";
import {PaginationNextTrigger, PaginationPageText, PaginationPrevTrigger, PaginationRoot} from "../ui/pagination.jsx";
import {LuCalendar, LuCalendarPlus, LuTrash2, LuUser} from "react-icons/lu";
import {Button} from "../ui/button.jsx";
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

const Examinations = () => {

    // auth, id from the url, navigate
    const {logout} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();

    // state
    const [examinations, setExaminations] = useState([]);
    const [patient, setPatient] = useState({});

    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        fetch(`http://localhost:8088/api/patients/${id}/examinations/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Failed to fetch examinations data!");
        }).then(data => {
            setExaminations(data);
        }).catch(error => {
            logout();
            console.log(error.message);
        });

        fetch(`http://localhost:8088/api/patients/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Failed to fetch patient data!");
        }).then(data => {
            setPatient(data);
        }).catch(error => {
            logout();
            console.log(error.message);
        });
    }, []);

    const deleteExamination = (id) => {
        fetch(`http://localhost:8088/api/examinations/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
        }).then(response => {
            if (response.ok) {
                setExaminations(examinations.filter(examination => examination.id !== id));
            } else {
                throw new Error("Failed to delete examination!");
            }
        }).catch(error => {
            logout();
            console.log(error.message);
        });
    }

    return (
        <VStack
            py={10}
            mx={"auto"}
            w={{base: "90%", md: "70%"}}
        >
            <Heading size={{base: '2xl', md: '4xl'}} mb={3}>{patient.firstname} {patient.lastname}</Heading>
            <Heading>Examinations</Heading>

            <SimpleGrid columns={3} width={"100%"}>
                <Button
                    me={"auto"}
                    colorPalette={"blue"}
                    variant={"outline"}
                    onClick={() => {
                        navigate("/patients");
                    }}
                >
                    <LuUser/> Patients
                </Button>

                <PaginationRoot
                    m={"auto"}
                    count={examinations.length}
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

                <Button
                    ms={"auto"}
                    colorPalette={"teal"}
                    variant={"outline"}
                    onClick={() => {
                        navigate(`/patients/${id}/examinations/new`);
                    }}
                >
                    <LuCalendarPlus/> New Examination
                </Button>

            </SimpleGrid>


            <Table.Root
                colorPalette={"teal"}
                variant={"outline"}
                borderRadius={8}
                showColumnBorder
            >
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Date</Table.ColumnHeader>
                        <Table.ColumnHeader>Diagnosis</Table.ColumnHeader>
                        <Table.ColumnHeader>Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {examinations.slice((page - 1) * pageSize, page * pageSize).map(examination => (
                        <Table.Row key={examination.id}>
                            <Table.Cell>{examination.date}</Table.Cell>
                            <Table.Cell>{examination.diagnosis}</Table.Cell>
                            <Table.Cell>
                                <HStack>

                                    {/*view examination*/}
                                    <IconButton
                                        colorPalette={"blue"} size={"xs"} variant={'outline'}
                                        onClick={() => {
                                            navigate(`/patients/${id}/examinations/${examination.id}`);
                                        }}
                                    >
                                        <LuCalendar/>
                                    </IconButton>

                                    {/*delete examination*/}
                                    <DialogRoot role={"alertdialog"}>
                                        <DialogTrigger asChild>
                                            <IconButton colorPalette={"red"} size={"xs"} variant={"outline"}>
                                                <LuTrash2/>
                                            </IconButton>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete examination?</DialogTitle>
                                            </DialogHeader>
                                            <DialogBody>
                                                <Text>
                                                    Are you sure you want to
                                                    delete examination from {examination.date}?
                                                </Text>
                                            </DialogBody>
                                            <DialogFooter>
                                                <DialogActionTrigger asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogActionTrigger>
                                                <DialogActionTrigger asChild>
                                                    <Button colorPalette={"red"} onClick={() => {
                                                        deleteExamination(examination.id);
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

export default Examinations;