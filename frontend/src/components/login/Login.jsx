import {Button, Heading, HStack, Input, VStack} from "@chakra-ui/react";
import {Field} from "../ui/field.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useColorModeValue} from "../ui/color-mode.jsx";
import {useNavigate} from "react-router";
import {PasswordInput} from "../ui/password-input.jsx";
import {toaster} from "../ui/toaster.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

const Login = () => {
    const {login} = useAuth();
    const formik = useFormik({
        initialValues: {username: "", password: ""},
        validationSchema: Yup.object({
            username: Yup.string().required("Username required!"),
            password: Yup.string().required("Password required!")
        }),
        onSubmit: (values, actions) => {
            fetch("http://localhost:8080/api/token/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(values)
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                toaster.create({
                    description: "Invalid credentials!",
                    type: "error"
                });
                throw new Error("Invalid credentials!");
            }).then(data => {
                login(data.access, data.refresh);
                actions.resetForm();
            }).catch(error => {
                console.log(error.message);
            })

            actions.resetForm();
        }
    });

    const navigate = useNavigate();

    return (
        <>
            <VStack
                as={"form"}
                p={8}
                mx={"auto"}
                mt={20}
                borderRadius={8}
                w={{base: "90%", md: "500px"}}
                bgColor={useColorModeValue("gray.50", "gray.950")}
                onSubmit={formik.handleSubmit}
            >
                <Heading
                    fontSize={{base: '3xl', sm: '4xl'}}
                    py={3}
                >
                    Log in
                </Heading>

                <Field label={"Username"} errorText={formik.errors.username}
                       invalid={formik.touched.username && formik.errors.username}>
                    <Input placeholder="Enter your username" {...formik.getFieldProps("username")} />
                </Field>
                <Field label={"Password"} errorText={formik.errors.password}
                       invalid={formik.touched.password && formik.errors.password}>
                    <PasswordInput placeholder="Enter your password" {...formik.getFieldProps("password")} />
                </Field>

                <HStack pt={"1rem"}>
                    <Button colorPalette={"teal"} type={"submit"}>Log In</Button>
                    <Button onClick={() => navigate("/")} variant={'outline'}>Back</Button>
                </HStack>
            </VStack>
        </>
    )
}

export default Login;