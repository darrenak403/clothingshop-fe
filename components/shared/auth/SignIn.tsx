"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const SignInSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email format"),
  password: Yup.string().required("Password is required").min(6, "Must be at least 6 characters"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-primary">Sign In</CardTitle>
          <CardDescription className="text-center">
            Welcome back to our clothing shop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={SignInSchema}
            onSubmit={(values) => {
              login(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
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
                  <div className="absolute bottom-[-8px] right-0">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? "Signing In..." : "Sign In"}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">Don&apos;t have an account? </span>
            <Link href="/sign-up" className="text-sm text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
