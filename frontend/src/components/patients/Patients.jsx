import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Heading, VStack, Table} from "@chakra-ui/react";

const Patients = () => {

    const {logout} = useAuth();
    const [patients, setPatients] = useState([]);
    // download patients data from the server
    useEffect(() => {
        fetch("http://localhost:8080/api/patients/", {
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
        }).catch(error => {
            logout();
            console.log(error.message);
        });
    }, []);

    return (
        <VStack
            py={10}
            mx={"auto"}
            w={{base: "90%", md: "70%"}}
        >
            <Heading size={{base: '2xl', md: '6xl'}} mb={5}>Patients</Heading>
            <Table.Root
                colorPalette={"teal"}
                interactive
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
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {patients.map(patient => (
                        <Table.Row key={patient.id}>
                            <Table.Cell>{patient.firstname}</Table.Cell>
                            <Table.Cell>{patient.lastname}</Table.Cell>
                            <Table.Cell>{patient.email}</Table.Cell>
                            <Table.Cell>{patient.birthdate}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </VStack>
    )
}

export default Patients;