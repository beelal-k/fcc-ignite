// import Back from '@/components/BackBtn/Back'
import Forum from '@/components/forum/Forum'
import { ForumType } from '@/types'
import axios from 'axios'
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { BiArrowBack, BiPlus } from 'react-icons/bi'

const Forums = () => {

    const [forums, setForums] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function getForums() {
        await axios.get(`${import.meta.env.VITE_BASE_URI}/forum`)
            .then((res) => {
                console.log(res.data);
                setForums(res.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getForums();
    }, []);

    return (
        <>
            <div className='flex flex-row xl:px-32 lg:px-32 md:px-32 px-5 items-center mt-24 justify-between '>
                <div className='flex flex-row items-center gap-7'>
                    <h1 className='md:text-3xl text-xl font-semibold'>All Forum Topics</h1>
                </div>
                <Link to={'/create-forum'} className='flex flex-row justify-center rounded-full hover:bg-primary/20 items-center transition-all cursor-pointer p-1' title='Create a new forum'>
                    <BiPlus size={30} className='self-center' />
                </Link>
            </div>
            {
                isLoading ?
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex flex-row justify-between items-center px-32 mt-12">
                            <div className='flex flex-row gap-2 items-center'>
                                <Skeleton className="h-[50px] bg-primary/20 dark:bg-primary/20 w-[50px] rounded-xl" />
                                <Skeleton className="h-[50px] bg-primary/20 dark:bg-primary/20 w-[400px] rounded-xl" />
                            </div>
                            <div className='flex flex-row gap-2 items-center'>
                                <Skeleton className="h-[50px] bg-primary/20 dark:bg-primary/20 w-[50px]" />
                                <Skeleton className="h-[50px] bg-primary/20 dark:bg-primary/20 w-[50px]" />
                            </div>
                        </div>
                    ))

                    :
                    <div className='mt-4 mb-10 md:px-32 px-5'>
                        {
                            forums?.map((forum: ForumType) =>
                                <Forum forum={forum} />
                            )
                        }

                    </div>

            }
        </>
    )
}

export default Forums 