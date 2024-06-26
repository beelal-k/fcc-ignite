import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { login } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {

  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setLoading(true);
      const data = await login(values.email, values.password);
      if (!data.user) {
        throw new Error("An error occurred");
      }
      setUser(data.user);
      localStorage.setItem("token", data.token);
      toast({
        title: "Login successful",
        description: "You have successfully logged in",
      });
      navigate("/");
    } catch (error: any) {
      if (error) {
        return toast({
          title: "An error occurred",
          // description: error.response.data,
          variant: "destructive",
        });
      }
      toast({
        title: "An error occurred",
        description: "An error occurred while trying to login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col w-full h-screen items-center justify-center border-black ">
        <img src="https://images.unsplash.com/photo-1520597191538-5c333fd1c980?q=80&w=1898&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="object-cover absolute z-[-10]" />
        <div className="p-10 rounded-lg bg-white shadow-sm border">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[400px] space-y-2 max-h-[900px]"
          >
            <div className="mb-6 w-full space-y-2">
              <h1 className="text-center font-semibold text-3xl text-black ">
                Login to your account{" "}
              </h1>
              <p className="text-center text-gray-500 text-sm">
                Enter your details below to continue
              </p>
            </div>
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
            <Button disabled={loading} className="w-full" type="submit">
              {loading ? <div className="dotFlashing"></div> : <p>Login</p>}
            </Button>
          </form>
          <span className="flex mt-3 justify-between w-full">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to={"/register"} className="text-primary">
                Register
              </Link>
            </p>
          </span>
        </div>
      </div>
    </Form>
  );
};

export default Login;
