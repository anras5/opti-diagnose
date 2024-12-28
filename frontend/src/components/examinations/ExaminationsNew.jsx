import {useNavigate, useParams} from "react-router";
import {Center, Group, Heading, Image, Input, SimpleGrid, Tabs, VStack} from "@chakra-ui/react";
import {Field} from "../ui/field.jsx";
import {StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot} from "../ui/steps.jsx";
import {Button} from "../ui/button.jsx";
import {FileUploadList, FileUploadRoot, FileUploadTrigger} from "../ui/file-button.jsx";
import {LuUpload} from "react-icons/lu";
import {useRef, useState} from "react";
import {toaster} from "../ui/toaster.jsx";
import {DataListItem, DataListRoot} from "../ui/data-list.jsx";

const ExaminationNew = () => {

    const navigate = useNavigate();
    const {id} = useParams();

    // ref
    const examinationCreated = useRef(false);

    // state
    const [step, setStep] = useState(0);
    // first step
    const [date, setDate] = useState("");
    const [file, setFile] = useState(null);
    // second step
    const [scans, setScans] = useState([]);
    const [results, setResults] = useState({}); // {scan_id: [result1, result2, ...]}

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
            // validate diagnosis
            console.log("validate diagnosis");
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
            setResults(prevResults => ({...prevResults, [scan.id]: [...(prevResults[scan.id] || []), data]}));
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
                <StepsList>
                    <StepsItem index={0} title="Date & File" description={"Upload files"}/>
                    <StepsItem index={1} title="Results" description={"View results from AI"}/>
                    <StepsItem index={2} title="Confirm Diagnosis" description={"Decide on the final diagnosis"}/>
                </StepsList>

                <StepsContent index={0}>
                    <SimpleGrid
                        as={"form"}
                        width={"100%"}
                        p={5}
                        mt={6}
                        columns={2}
                        gap={{base: "24px", md: "40px"}}
                        borderWidth={2}
                        borderRadius={8}
                    >
                        <Field label={"Date"}>
                            <Input
                                type={"date"}
                                value={date}
                                onChange={(event) => {
                                    setDate(event.target.value);
                                }}
                            />
                        </Field>

                        <Field label={"File"}>
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
                            <Button onClick={getResults}>Get Results</Button>
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
                                            {network_names.map(network_name => (
                                                <Tabs.Content key={network_name}>
                                                    <DataListRoot orientation={"horizontal"} size={"lg"}
                                                                  divideY={"1px"}>
                                                        {results[scan.id].filter(result => result.network_name === network_name).map(result => (
                                                            <DataListItem
                                                                key={result.id}
                                                                label={result.diagnosis}
                                                                value={result.confidence}
                                                            />
                                                        ))}
                                                    </DataListRoot>
                                                </Tabs.Content>
                                            ))}
                                        </Tabs.Root>
                                    }
                                </>
                            )


                        })}


                    </SimpleGrid>

                </StepsContent>
                <StepsContent index={2}>
                    Confirm diagnosis
                </StepsContent>

                <Group>
                    <StepsPrevTrigger asChild>
                        <Button variant="outline" size="sm">
                            Prev
                        </Button>
                    </StepsPrevTrigger>
                    <StepsNextTrigger asChild>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </StepsNextTrigger>
                </Group>
            </StepsRoot>

        </VStack>
    )
        ;
}

export default ExaminationNew;