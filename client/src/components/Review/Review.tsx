import useAuthStore from '@/store/authStore'
import { ReviewType } from '@/types'
import { BiUser } from 'react-icons/bi';

const Review = ({ review }: { review: ReviewType }) => {

    const { user } = useAuthStore();


    return (
        <>
            <div className='flex flex-row  rounded justify-between  py-1 w-full bg-primary bg-opacity-10'>
                <div className='mt-2 pb-2 flex flex-row items-start gap-3'>
                    <div className="rounded-full p-2 w-fit bg-gray-300">
                        <BiUser size={25} className="text-gray-700 " />
                    </div>
                    <div>
                        <p className='text-sm font-medium'>{user?.name}</p>
                        <p>{review.review}</p>
                    </div>
                    {/* <p>Rating: {review.rating}</p> */}
                </div>

            </div>
        </>
    )
}

export default Review