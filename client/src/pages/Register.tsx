import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/hooks/auth";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(60, { message: "Name must be at most 60 characters long" }),
    email: z.string().email({
      message: "Invalid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    confirmPassword: z.string(),
    country: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    birthday: z.string().optional(),
    preferences: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [steps, setSteps] = useState(1);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setLoading(true);
    try {
      await register(
        values.name,
        values.email,
        values.password,
        values.birthday,
        values.state,
        values.country,
        values.postalCode,
        values.city,
        values.address,
        values.phoneNumber
      );
      toast({
        title: "Account created",
        description: "You have successfully created an account",
      });
      form.reset();
      navigate("/");
    } catch (error: any) {
      if (error.response.data) {
        console.log(error.response.data)
        return toast({
          title: "An error occurred",
          // description: error.response.data,
          variant: "destructive",
        });
      }
      toast({
        title: "An error occurred",
        description: "An error occurred while trying to create an account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stepsValidation = async () => {
    const stepFields: any = {
      1: ["name", "email", "password", "confirmPassword"],
      2: [
        "phoneNumber",
        "birthday",
        "country",
        "city",
        "address",
        "state",
        "postalCode",
      ],
    };

    const fieldsToValidate = stepFields[steps] || [];
    const result = await form.trigger(fieldsToValidate);

    if (result) {
      setSteps(steps + 1);
    } else {
      toast({
        title: "Fill in the required fields",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="flex w-full h-screen items-center justify-center ">
        <img src="https://images.unsplash.com/photo-1520597191538-5c333fd1c980?q=80&w=1898&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="object-cover absolute z-[-10]" />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[500px] space-y-2 max-h-[900px] shadow bg-white border rounded-xl p-10"
        >
          <div className="mb-6 w-full space-y-2">
            <h1 className="text-center font-semibold text-3xl  text-black">
              Sign Up for an account{" "}
            </h1>
            <p className="text-center text-gray-500 text-sm">
              {steps === 1
                ? "Let's start with your name, email and password"
                : "Now we need some more information"}
            </p>
            <Progress value={steps === 1 ? 0 : loading ? 100 : 100} />
          </div>

          {steps === 1 && (
            <>
              <FormField
                disabled={loading}
                control={form.control}
                name="name"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="email"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="password"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={loading}
                control={form.control}
                name="confirmPassword"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {steps === 2 && (
            <>
              <div className="flex w-full gap-5">
                <span className="w-full">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </span>
                <span className="w-full">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="birthday"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Birthday</FormLabel>
                        <FormControl>
                          <Input type="date" placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </span>
              </div>
              <div className="flex w-full gap-5">
                <span className="w-full">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="country"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </span>
                <span className="w-full">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="city"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </span>
              </div>
              <FormField
                disabled={loading}
                control={form.control}
                name="address"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full gap-5">
                <span className="w-full">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="state"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </span>
                <span className="w-full">
                  <FormField
                    disabled={loading}
                    control={form.control}
                    name="postalCode"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </span>
              </div>
            </>
          )}

          {steps === 1 && (
            <div>
              <Button
                onClick={() => {
                  stepsValidation();
                }}
              >
                Next
              </Button>
            </div>
          )}
          {steps === 2 && (
            <div className="flex justify-between w-full gap-5 ">
              <Button
                variant={"secondary"}
                disabled={loading}
                onClick={() => {
                  setSteps(1);
                }}
              >
                Back
              </Button>
              <Button disabled={loading} className="w-full" type="submit">
                {loading ? (
                  <div className="dotFlashing"></div>
                ) : (
                  <p>Register</p>
                )}
              </Button>
            </div>
          )}
          <p className="text-center mt-6 text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to={"/login"} className="text-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default Register;
