import {useNavigate, useParams} from "react-router";
import {Group, Heading, Input, SimpleGrid, VStack} from "@chakra-ui/react";
import {Field} from "../ui/field.jsx";
import {StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot} from "../ui/steps.jsx";
import {Button} from "../ui/button.jsx";
import {FileUploadList, FileUploadRoot, FileUploadTrigger} from "../ui/file-button.jsx";
import {LuUpload} from "react-icons/lu";
import {useState} from "react";

const ExaminationNew = () => {

    const navigate = useNavigate();
    const {id} = useParams();

    // state
    const [step, setStep] = useState(0);


    const validateStepChange = (details) => {

        const success = true;

        console.log(details);

        if (details.step === 1) {
            // validate date and file
            console.log("validate date and file");
        }
        if (details.step === 2) {
            // validate results
            console.log("validate results");
        }
        if (details.step === 3) {
            // validate diagnosis
            console.log("validate diagnosis");
        }


        if (success)
            setStep(details.step);
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
                            <Input type={"date"}/>
                        </Field>

                        <Field label={"File"}>
                            <FileUploadRoot accept={["image/png"]}>
                                <FileUploadTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <LuUpload/> Upload file
                                    </Button>
                                </FileUploadTrigger>
                                <FileUploadList/>
                            </FileUploadRoot>
                        </Field>
                    </SimpleGrid>

                </StepsContent>
                <StepsContent index={1}>
                    Results from AI
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
    );
}

export default ExaminationNew;