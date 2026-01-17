"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .min(10, "Phone number must be at least 10 characters")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  agreeTerms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isRegistering } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-primary">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Join our clothing shop community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              name: "",
              email: "",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
              agreeTerms: false,
            }}
            validationSchema={SignUpSchema}
            onSubmit={(values) => {
              register({
                fullName: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber,
                password: values.password,
              });
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-sm text-destructive mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-destructive mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Field
                    as={Input}
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-sm text-destructive mt-1"
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <Icon
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                    className="absolute right-3 top-9 cursor-pointer text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-destructive mt-1"
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                  />
                  <Icon
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                    className="absolute right-3 top-9 cursor-pointer text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-destructive mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={values.agreeTerms}
                    onCheckedChange={(checked) => setFieldValue("agreeTerms", checked)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms and Conditions
                    </Link>
                  </Label>
                </div>
                <ErrorMessage
                  name="agreeTerms"
                  component="div"
                  className="text-sm text-destructive mt-1"
                />
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? "Signing Up..." : "Sign Up"}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">Already have an account? </span>
            <Link href="/sign-in" className="text-sm text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
