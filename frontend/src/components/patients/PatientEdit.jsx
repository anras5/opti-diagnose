import {useNavigate, useParams} from "react-router";
import {useAuth} from "../../context/AuthContext.jsx";
import {useFormik} from "formik";
import {Box, Button, Heading, HStack, Input, SimpleGrid, VStack} from "@chakra-ui/react";
import {Field} from "../ui/field.jsx";
import {LuUserCheck} from "react-icons/lu";
import {useEffect} from "react";

const PatientEdit = () => {

    // auth, id from the url, navigate
    const {logout} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            birthdate: "",
            national_id: "",
            email: "",
            phone: ""
        },
        onSubmit: (values) => {
            fetch(`http://localhost:8080/api/patients/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify(values)
            }).then(response => {
                if (response.ok) {
                    navigate("/patients");
                } else {
                    throw new Error("Failed to create patient!");
                }
            }).catch(error => {
                logout();
                console.log(error.message);
            })
        }
    })

    useEffect(() => {
        fetch(`http://localhost:8080/api/patients/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access")}`,
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Failed to fetch patient data!");
        }).then(data => {
            formik.setValues(data);
        }).catch(error => {
            logout();
            console.log(error.message);
        })
    }, []);


    return (
        <VStack
            py={10}
            mx={"auto"}
            w={{base: "90%", md: "70%"}}
        >
            <Heading size={"3xl"} mb={5}>New Patient</Heading>

            <SimpleGrid as={"form"} columns={2} width={"100%"} gap={{base: "24px", md: "40px"}}
                        onSubmit={formik.handleSubmit}>
                <Field label={"First Name"} errorText={formik.errors.firstname}
                       invalid={formik.touched.firstname && formik.errors.firstname}>
                    <Input placeholder={"Patient's first name"}
                           {...formik.getFieldProps("firstname")}/>
                </Field>
                <Field label={"Last Name"} errorText={formik.errors.lastname}
                       invalid={formik.touched.lastname && formik.errors.lastname}>
                    <Input placeholder={"Patient's last name"}
                           {...formik.getFieldProps("lastname")}/>
                </Field>
                <Field label={"Birth Date"} errorText={formik.errors.birthdate}
                       invalid={formik.touched.birthdate && formik.errors.birthdate}>
                    <Input type={"date"}
                           {...formik.getFieldProps("birthdate")}/>
                </Field>
                <Field label={"National ID"} errorText={formik.errors.national_id}
                       invalid={formik.touched.national_id && formik.errors.national_id}>
                    <Input placeholder={"Patient's national ID"}
                           {...formik.getFieldProps("national_id")}/>
                </Field>
                <Field label={"Email"} errorText={formik.errors.email}
                       invalid={formik.touched.email && formik.errors.email}>
                    <Input placeholder={"Patient's email"}
                           {...formik.getFieldProps("email")}/>
                </Field>
                <Field label={"Phone"} errorText={formik.errors.phone}
                       invalid={formik.touched.phone && formik.errors.phone}>
                    <Input placeholder={"Patient's phone number"}
                           {...formik.getFieldProps("phone")}/>
                </Field>
                <Box></Box>
                <HStack ms={"auto"} gap={4}>
                    <Button onClick={() => navigate("/patients")} variant={'outline'}>Back</Button>
                    <Button colorPalette={"teal"} type={"submit"}> <LuUserCheck/> Update</Button>
                </HStack>
            </SimpleGrid>
        </VStack>
    );
}

export default PatientEdit;