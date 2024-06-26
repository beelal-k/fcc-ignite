import {  ItemType, } from '@/types';
import axios from 'axios';
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import useAuthStore from '@/store/authStore';

const formSchema = z.object({
    message: z.string().min(10),
});



const Complaint = ({ item }: { item: ItemType }) => {
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (!user) {
            toast({
                title: "Please login to leave a query",
                description: "You need to login to leave a query",
                variant: "destructive"
            })
            return;
        }

        try {
            setIsSubmitting(true);
            const { message } = values;
            const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/complaint`, {
                message,
                itemId: item._id,
                businessId: item.businessId,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (!res) {
                throw new Error("An error occurred");
            }
            console.log(res.data);
            toast({
                title: "Submitted query!",
                description: "Successfully submitted a query"
            })
            window.location.reload();

        } catch (error: any) {
            console.log(error);
            toast({
                title: "Error occurred",
                description: "An error occurred while submitting query",
                variant: "destructive"
            })
            return;
        }
        finally {
            setIsSubmitting(false);
            form.reset();
        }
    }

    return (
        <>
            <div>
                <h3 className='font-semibold text-primary'>Got a complaint or query?</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-4">
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={user ? false : true}
                                            placeholder={user ? "Leave a message..." : "Please login to submit a query"}
                                            className="resize-none border border-primary w-full p-2 rounded-lg focus:outline-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={user ? false : true} className='bg-transparent w-full border border-primary hover:text-white hover:bg-primary text-primary mr-auto'>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </Form>

            </div>
        </>
    )
}

export default Complaint