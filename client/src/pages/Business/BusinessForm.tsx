import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
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
import axios from "axios";

const formSchema = z.object({
    name: z.string().min(3)
});

type FormValues = z.infer<typeof formSchema>;

const BusinessForm = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useAuthStore();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_BASE_URI}/business`, {
                name: values.name
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            ).then((res) => {
                console.log(res.data);
            })
            toast({
                title: "Registered as a travel agent!",
                description: "You have successfully registered as a travel agent",
            });
            window.location.replace('/panel');
        } catch (error: any) {
            if (error.response.data) {
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
        <>
            {
                user?.businessId == null ?
                    < Form {...form}>
                        <div className="flex flex-col w-full h-screen items-center mt-40  ">
                            <div className="p-10 rounded-lg bg-white shadow-sm ">
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="w-[700px] space-y-5 max-h-[900px]"
                                >
                                    <div className="mb-6 w-full space-y-2">
                                        <h1 className="text-center font-semibold text-4xl text-black ">
                                            AIRBNB YOUR HOME
                                        </h1>
                                        <p className="text-center text-gray-500 text-lg">
                                            Give your home a name and start earning money
                                        </p>
                                    </div>
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
                                    <Button disabled={loading || user?.isVerified === false} className="w-full" type="submit">
                                        {loading ? <div className="dotFlashing"></div> : <p>
                                            {user?.isVerified === false ? "Please verify your email" : "Register"}
                                            </p>}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </Form >
                    :
                    <div className="flex flex-col gap-5 items-center justify-center p-40">
                        <h1 className="text-3xl font-semibold">You are already a registered travel agent</h1>
                        <div className="flex flex-row gap-5">
                            <Link to={'/panel'}>
                                <Button className="bg-transparent text-black border border-black hover:bg-black hover:text-white">Go to panel</Button>
                            </Link>
                            <Link to={'/'}>
                                <Button>Go home</Button>
                            </Link>
                        </div>
                    </ div>
            }
        </>
    );
};

export default BusinessForm;
