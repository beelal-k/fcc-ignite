import { ItemType } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import useAuthStore from '@/store/authStore';
import { FaStar } from 'react-icons/fa';

const formSchema = z.object({
    review: z.string().min(8),
});

const ReviewInput = ({ getReview, item }: { getReview: any, item: ItemType }) => {
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const { toast } = useToast();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            review: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (!user) {
            toast({
                title: "Please login to review",
                description: "You need to login to leave a review",
                variant: "destructive"
            })
            return;
        }

        try {
            setIsSubmitting(true);
            const { review } = values;
            const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/item/review`, {
                review,
                rating: rating,
                itemId: item._id
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
                title: "Added review",
                description: "Successfully added a review"
            })
            getReview();
            window.location.reload();

        } catch (error: any) {
            console.log(error);
            toast({
                title: "Error occurred",
                description: "An error occurred while submitting review",
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
                        <div className="flex flex-row gap-1 items-center">
                            {Array.from({ length: 5 }).map((_, index: any) => {
                                const adjustedIndex = index + 1;
                                return (
                                    <FaStar
                                        className={`${adjustedIndex <= rating
                                            ? "text-primary"
                                            : "text-gray-400"
                                            } text-sm`}
                                        key={adjustedIndex}
                                        onClick={() => {
                                            console.log("Clicked", adjustedIndex);
                                            setRating(adjustedIndex);
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <FormField
                            control={form.control}
                            name="review"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={user ? false : true}
                                            placeholder={user ? "Leave a review..." : "Please login to review"}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={user ? false : true} className='bg-transparent border border-black hover:text-white hover:bg-black text-black mr-auto'>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </Form>

            </div>
        </>
    )
}

export default ReviewInput