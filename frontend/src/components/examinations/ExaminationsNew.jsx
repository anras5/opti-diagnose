import {useNavigate, useParams} from "react-router";
import {
    Center,
    createListCollection,
    Group,
    Heading,
    Image,
    Input,
    SimpleGrid,
    Tabs,
    Textarea,
    VStack
} from "@chakra-ui/react";
import {Field} from "../ui/field.jsx";
import {StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot} from "../ui/steps.jsx";
import {Button} from "../ui/button.jsx";
import {FileUploadList, FileUploadRoot, FileUploadTrigger} from "../ui/file-button.jsx";
import {LuUpload} from "react-icons/lu";
import {useRef, useState} from "react";
import {toaster} from "../ui/toaster.jsx";
import {SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText} from "../ui/select.jsx";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";

const ExaminationNew = () => {

    const navigate = useNavigate();
    const {id} = useParams();
    const availableDiagnoses = createListCollection({
        items: [
            {label: "CNV", value: "CNV"},
            {label: "DME", value: "DME"},
            {label: "DRUSEN", value: "DRUSEN"},
            {label: "VMT", value: "VMT"},
            {label: "NORMAL", value: "NORMAL"},
        ]
    });

    // ref
    const examinationCreated = useRef(false);

    // state
    const [step, setStep] = useState(0);
    // first step
    const [date, setDate] = useState("");
    const [file, setFile] = useState(null);
    const [examinationId, setExaminationId] = useState(null); // we get examination id from the backend after creating it (createExamination function)
    // second step
    const [scans, setScans] = useState([]);
    const [results, setResults] = useState({}); // {scan_id: [result1, result2, ...]}
    // third step
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");

    const createExamination = async () => {
        try {
            // create examination
            const response = await fetch(`http://localhost:8080/api/patients/${id}/examinations/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify({
                    date: date,
                })
            });
            if (!response.ok) throw new Error("Failed to create examination!");
            const data = await response.json();
            setExaminationId(data.id);

            // upload file
            const formData = new FormData();
            formData.append("photo", file);
            const uploadResponse = await fetch(`http://localhost:8080/api/examinations/${data.id}/scans/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
                body: formData
            });
            if (!uploadResponse.ok) throw new Error("Failed to upload file!");
            const dataUpload = await uploadResponse.json();
            setScans(prevScans => [...prevScans, dataUpload]);
        } catch (error) {
            toaster.create({
                description: error.message,
                type: "error"
            });
        }
        examinationCreated.current = true;
    };

    const updateExamination = async () => {

        try {
            const response = await fetch(`http://localhost:8080/api/examinations/${examinationId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify({
                    diagnosis: diagnosis,
                    notes: notes,
                })
            });
            if (!response.ok) throw new Error("Failed to update examination!");
            toaster.create({
                description: "Examination created successfully!",
                type: "success"
            });
            navigate(`/patients/${id}/examinations`);
        } catch (error) {
            toaster.create({
                description: error.message,
                type: "error"
            });
        }
    }

    const validateStepChange = (details) => {

        let success = true;

        // STEP 1
        if (details.step === 1) {
            if (!date || !file) {
                success = false;
                toaster.create({
                    description: "Fill out all fields!",
                    type: "error"
                });
            } else {
                if (!examinationCreated.current)
                    createExamination();
            }
        }

        // STEP 3
        if (details.step === 3) {
            if (!diagnosis) {
                success = false;
                toaster.create({
                    description: "Provide your diagnosis!",
                    type: "error"
                });
            } else {
                updateExamination();
            }
        }


        if (success)
            setStep(details.step);
    }

    const getResults = async () => {
        for (const scan of scans) {
            const response = await fetch(`http://localhost:8080/api/scans/${scan.id}/network-diagnosis/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
            });
            if (!response.ok) throw new Error("Failed to get results!");
            const data = await response.json();
            setResults(prevResults => ({
                ...prevResults,
                [scan.id]: [...(prevResults[scan.id] || []), ...data]
            }));
        }
    }


    return (
        <VStack
            py={10}
            mx={"auto"}
            w={{base: "90%", md: "70%"}}
        >

            <Heading size={"3xl"} mb={5}>New Examination</Heading>

            <StepsRoot
                step={step}
                count={3}
                colorPalette={"teal"}
                onStepChange={validateStepChange}
            >

                <SimpleGrid columns={2}>
                    <Button variant="outline" size="sm" mr={"auto"} colorPalette={"gray"}
                            onClick={() => navigate(`/patients/${id}/examinations`)}>
                        Back to examinations
                    </Button>

                    <Group ml={"auto"}>
                        <StepsPrevTrigger asChild>
                            <Button variant="outline" size="sm">
                                Prev
                            </Button>
                        </StepsPrevTrigger>
                        <StepsNextTrigger asChild>
                            {step < 2 ? (
                                <Button variant="outline" size="sm">
                                    Next
                                </Button>
                            ) : (
                                <Button size="sm">
                                    Finish
                                </Button>
                            )}
                        </StepsNextTrigger>
                    </Group>
                </SimpleGrid>

                <StepsList>
                    <StepsItem index={0} title="Date & File" description={"Upload files"}/>
                    <StepsItem index={1} title="Results" description={"View results from AI"}/>
                    <StepsItem index={2} title="Confirm Diagnosis" description={"Decide on the final diagnosis"}/>
                </StepsList>

                <StepsContent index={0} borderWidth={2} borderRadius={8} mt={2}>
                    <SimpleGrid
                        as={"form"}
                        columns={2}
                        width={"100%"}
                        p={5}
                        mt={2}
                        gap={{base: "24px", md: "40px"}}
                    >
                        <Field label={"Date"} required>
                            <Input
                                type={"date"}
                                value={date}
                                onChange={(event) => {
                                    setDate(event.target.value);
                                }}
                            />
                        </Field>

                        <Field label={"File"} required>
                            <FileUploadRoot
                                accept={["image/png", "image/jpg", "image/jpeg"]}
                                onFileChange={(details) => {
                                    setFile(details.acceptedFiles[0]);
                                }}
                                colorPalette={"teal"}
                            >
                                <FileUploadTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <LuUpload/> Upload file
                                    </Button>
                                </FileUploadTrigger>
                                <FileUploadList showSize={true} clearable={true}/>
                            </FileUploadRoot>
                        </Field>
                    </SimpleGrid>
                </StepsContent>
                <StepsContent index={1} borderWidth={2} borderRadius={8} mt={2} py={5}>
                    {Object.keys(results).length === 0 &&
                        <Center>
                            <Button onClick={getResults}>Get AI Results</Button>
                        </Center>
                    }
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
                                        <Tabs.Root defaultValue={"VGG16"} variant={"subtle"}>
                                            <Tabs.List>
                                                {network_names.map(network_name => (
                                                    <Tabs.Trigger key={network_name}>{network_name}</Tabs.Trigger>
                                                ))}
                                                <Tabs.Indicator/>
                                            </Tabs.List>
                                            {network_names.map(network_name => {
                                                const data = results[scan.id].filter(result => result.network_name === network_name).map(result => (
                                                    {name: result.diagnosis, confidence: result.confidence}
                                                ));
                                                return (
                                                    <Tabs.Content key={network_name}>
                                                        <BarChart
                                                            width={500}
                                                            height={300}
                                                            data={data}
                                                            margin={{
                                                                top: 5, right: 30, bottom: 5,
                                                            }}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                                            <XAxis dataKey={"name"}/>
                                                            <YAxis/>
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
                </StepsContent>
                <StepsContent index={2} borderWidth={2} borderRadius={8} mt={2}>
                    <SimpleGrid
                        columns={2}
                        width={"100%"}
                        p={5}
                        mt={2}
                        gap={{base: "24px", md: "40px"}}
                    >
                        <Field label={"Your diagnosis"} required>
                            <SelectRoot collection={availableDiagnoses} onValueChange={(details) => {
                                setDiagnosis(details.value[0])
                            }}>
                                <SelectTrigger>
                                    <SelectValueText placeholder={"Choose diagnosis"}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDiagnoses.items.map(diagnosis => (
                                        <SelectItem key={diagnosis.value}
                                                    item={diagnosis}>{diagnosis.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectRoot>
                        </Field>
                        <Field label={"Your notes"}>
                            <Textarea onBlur={(e) => setNotes(e.target.value)}/>
                        </Field>
                    </SimpleGrid>
                </StepsContent>
            </StepsRoot>
        </VStack>
    );
}

export default ExaminationNew;