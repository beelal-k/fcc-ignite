import useAuthStore from '@/store/authStore'
import { ReviewType } from '@/types'
import { BiUser } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';

const Review = ({ review }: { review: ReviewType }) => {

    const { user } = useAuthStore();


    return (
        <>
            <div className='flex flex-row  rounded justify-between px-2 py-1 w-full bg-primary bg-opacity-10'>
                <div className='mt-2 pb-2 flex flex-row w-full items-start gap-3'>
                    <div className="rounded-full p-2 w-fit bg-red-200">
                        <BiUser size={25} className="text-red-500 " />
                    </div>
                    <div className='w-full'>
                        <p className='flex flex-row items-center justify-between w-full pr-3 gap-5 text-sm font-medium'>{user?.name}<span className='flex flex-row items-center gap-1 text-gray-500'><FaStar size={15} className='text-primary' />{review.rating}.0</span></p>
                        <p>{review.review}</p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Review