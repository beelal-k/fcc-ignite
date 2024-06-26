"use client"
import React, { useState } from 'react'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { Textarea } from '../ui/textarea';
import useAuthStore from '@/store/authStore';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
    title: z.string(),
    content: z.string().min(8),
});

const CreateForum = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuthStore();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (!user) {
                console.log("Please login first");
                return;
            }
            setIsSubmitting(true);
            const { title, content } = values;
            const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/forum`, {
                title,
                content,
                userId: user._id
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            if (!res) {
                throw new Error("An error occurred");
            }
            toast({
                title: "Created forum",
                description: "You have successfully created a forum"
            })

        } catch (error: any) {
            console.log(error);
            toast({
                title: "Error occurred",
                description: "An error occurred while creating the forum",
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
            <div className='w-1/2 mx-auto mt-24 mb-32'>
                <h1 className='text-2xl font-semibold mb-5'>Create Forum</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Forum Title" className='border border-black' disabled={user ? false : true} type='text' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none "
                                            id='message'
                                            disabled={user ? false : true}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='bg-primary hover:bg-hover w-full' disabled={user ? false : true}>
                            {isSubmitting ? "Submitting..." : user ? "Create forum" : "Please login to submit a forum"}
                        </Button>
                    </form>
                </Form>
            </div>

        </>
    )
}

export default CreateForum; 