import {useAuth} from "../../context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {Box, Heading, Image, Separator, SimpleGrid, Tabs, Text, VStack} from "@chakra-ui/react";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {Button} from "../ui/button.jsx";

const Examination = () => {

    // auth, id from the url, navigate
    const {logout} = useAuth();
    const {patient_id, id} = useParams();
    const navigate = useNavigate();

    // state
    const [patient, setPatient] = useState({});
    const [examination, setExamination] = useState({});
    const [scans, setScans] = useState([]);
    const [results, setResults] = useState({});

    useEffect(() => {
        fetch(`http://localhost:8088/api/patients/${patient_id}`, {
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

        fetch(`http://localhost:8088/api/examinations/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Failed to fetch examination data!");
        }).then(data => {
            setExamination(data);
            fetch(`http://localhost:8088/api/examinations/${id}/scans/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Failed to fetch scans data!");
            }).then(scansData => {
                setScans(scansData);
                for (const scan of scansData) {
                    fetch(`http://localhost:8088/api/scans/${scan.id}/network-diagnosis/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("access")}`,
                        },
                    }).then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error("Failed to fetch network diagnosis data!");
                    }).then(data => {
                        setResults(prevNetworkDiagnoses => {
                            return {...prevNetworkDiagnoses, [scan.id]: data};
                        });
                    })
                }
            })
        }).catch(error => {
            logout();
            console.log(error.message);
        });
    }, [])


    return (
        <VStack
            py={10}
            mx={"auto"}
            w={{base: "90%", md: "70%"}}
        >
            <Heading size={{base: '2xl', md: '4xl'}} mb={3}>{patient.firstname} {patient.lastname}</Heading>
            <SimpleGrid columns={3} width={"100%"}>
                <Button
                    mr={"auto"}
                    ml={20}
                    variant={"outline"}
                    colorPalette={"blue"}
                    onClick={() => navigate(`/patients/${patient_id}/examinations`)}
                >Back</Button>
                <Box textAlign={"center"}>
                    <Heading>Examination - {examination.date}</Heading>
                    <Heading>{examination.diagnosis}</Heading>
                </Box>
                <></>
            </SimpleGrid>

            <Separator my={5}/>
            <Text my={2}>{examination.notes}</Text>
            <Separator my={5}/>
            <SimpleGrid
                columns={2}
                width={"100%"}
                p={5}
                mt={2}
                gap={{base: "24px", md: "40px"}}
            >
                {scans.map(scan => {
                    let network_names = results[scan.id] ? [...new Set(results[scan.id].map(result => result.network_name))] : [];
                    return (
                        <>
                            <Image src={scan.photo} alt={scan.id} key={scan.id} m={"auto"}/>
                            {results && results[scan.id] &&
                                <Tabs.Root variant={"subtle"} colorPalette={"teal"}>
                                    <Tabs.List>
                                        {network_names.map(network_name => (
                                            <Tabs.Trigger
                                                key={network_name}
                                                value={network_name}
                                            >
                                                {network_name}
                                            </Tabs.Trigger>
                                        ))}
                                        <Tabs.Indicator/>
                                    </Tabs.List>
                                    {network_names.map(network_name => {
                                        const data = results[scan.id].filter(result => result.network_name === network_name).map(result => (
                                            {name: result.diagnosis, confidence: result.confidence * 100}
                                        ));
                                        return (
                                            <Tabs.Content key={network_name} value={network_name} mt={3}>
                                                <Heading ml={14}>Confidence of {network_name}</Heading>
                                                <BarChart
                                                    width={500}
                                                    height={350}
                                                    data={data}
                                                    margin={{
                                                        top: 5, bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                                    <XAxis dataKey={"name"}/>
                                                    <YAxis tickFormatter={(tick) => `${tick}%`}/>
                                                    <Bar dataKey="confidence" fill="#14b8a6"/>
                                                </BarChart>
                                            </Tabs.Content>
                                        )
                                    })}
                                </Tabs.Root>
                            }
                        </>
                    )
                })}
            </SimpleGrid>
        </VStack>
    )
}

export default Examination;