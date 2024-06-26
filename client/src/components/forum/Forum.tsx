import { ForumType } from '@/types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import React from 'react'
import { BiMessageSquare, BiMessage, BiLike } from 'react-icons/bi'
import { capitalizeFirstLetter } from '@/lib/utils';

interface Props {
    forum: ForumType;
}

const Forum = ({ forum }: Props) => {

    return (
        <>
            <Link to={`/forums/details/${forum._id}`}>
                <div className='flex flex-row  items-center w-full p-4 py-5 border-t first:border-0 border-primary border-opacity-40'>
                    <div className='w-fit'>
                        <BiMessageSquare className='text-primary' size={30} />
                    </div>
                    <div className='w-full px-3'>
                        <p className='md:text-xl text-lg font-medium'>{capitalizeFirstLetter(forum.title)}</p>
                        <div className='flex flex-row'>
                            <p className='overflow-hidden w-1/2 md:text-lg  text-nowrap'>{forum.content}</p>
                            <span> ...</span>
                        </div>
                    </div>
                    <div className='w-fit flex flex-row gap-5 items-center'>
                        <div className='text-center'>
                            <BiMessage size={25} className='text-primary' />
                            <p>{forum.replyCount}</p>
                        </div>
                        <div className='text-center'>
                            <BiLike size={25} className='text-primary' />
                            <p>{forum.likes?.length}</p>
                        </div>
                    </div>
                </div>
            </Link>

        </>
    )
}

export default Forum