import {Button, Heading, HStack, Input, VStack} from "@chakra-ui/react";
import {Field} from "../ui/field.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useColorModeValue} from "../ui/color-mode.jsx";
import {useNavigate} from "react-router";
import {PasswordInput} from "../ui/password-input.jsx";

const Login = () => {

    const formik = useFormik({
        initialValues: {email: "", password: ""},
        validationSchema: Yup.object({
            email: Yup.string().required("Email required!").email("Email should be valid!"),
            password: Yup.string().required("Password required!")
                .min(6, "Password too short!").max(28, "Password too long!"),
        }),
        onSubmit: (values, actions) => {
            console.log(values);
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
                bgColor={useColorModeValue("gray.50", "gray.900")}
                onSubmit={formik.handleSubmit}
            >
                <Heading
                    fontSize={{base: '3xl', sm: '4xl'}}
                    py={3}
                >
                    Log in
                </Heading>

                <Field label={"Email"} errorText={formik.errors.email}
                       invalid={formik.touched.email && formik.errors.email}>
                    <Input placeholder="Enter your email" {...formik.getFieldProps("email")} />
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