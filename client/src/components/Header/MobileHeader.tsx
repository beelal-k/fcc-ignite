import {AiFillPlusCircle} from 'react-icons/ai'
import {BiHomeAlt, BiSpreadsheet} from 'react-icons/bi'
import {BsPerson, BsChatText} from 'react-icons/bs'
import { Link } from 'react-router-dom'
// import LoginPage from '../../pages/LoginPage'
import { useState, useContext } from 'react'
import useAuthStore from '@/store/authStore'

const MobileHeader = () => {
    
    const [open, setOpen] = useState(false);
    const {user}  = useAuthStore();
    // const {user, notify} = useContext(UserContext);

    return (
      <>
      {/* <LoginPage open={open} setOpen={setOpen} /> */}
      <div
        className='w-full h-16 flex items-center justify-center bg-white border-t border-gray-200'
      >
        <div className='flex w-full justify-between'>
        <Link to='/' className='flex flex-col items-center justify-center w-1/5'>
                <BiHomeAlt className='text-2xl text-gray-400'/>
                <span className='text-xs text-gray-600 mt-0.5'>Home</span>
            </Link>
            {
                user? (<Link to='/account/myads' className='flex flex-col items-center justify-center w-1/5'>
                    <BiSpreadsheet className='text-2xl text-gray-400'/>
                    <span className='text-xs text-gray-600 mt-0.5'>My Ads</span>
                    </Link>) : 
                (<button className="flex flex-col bg-white items-center justify-center w-1/5" onClick={() => setOpen(true)}>
                    <BiSpreadsheet className='text-2xl text-gray-400'/>
                    <span className='text-xs text-gray-600 mt-0.5'>My Ads</span>
                </button>)
            }
            {
                user? (<Link to='/account/ads/pick-a-category' className='flex flex-col items-center justify-center w-1/5'>
                    <AiFillPlusCircle className='text-3xl text-primary'/>
                    <span className='text-xs text-gray-600 mt-0.5'>Post</span>
                </Link>) : 
                (<button className="flex flex-col items-center bg-white justify-center w-1/5" onClick={() => setOpen(true)}>
                    <AiFillPlusCircle className='text-3xl text-primary'/>
                    <span className='text-xs text-gray-600 mt-0.5'>Post</span>
                </button>)
            }
            {
                user? (<Link to='/messenger' className='relative flex flex-col items-center justify-center w-1/5'>
                    <BsChatText className='text-2xl text-gray-400'/>
                    {user && 
                    <div className="bg-red-500 rounded-full w-3 h-3 absolute top-1 right-7"></div>
                    }
                    <span className='text-xs text-gray-600 mt-0.5'>Chat</span>
                </Link>) : 
                (<button className="relative flex flex-col bg-white items-center justify-center w-1/5" onClick={() => setOpen(true)}>
                    <BsChatText className='text-2xl text-gray-400'/>
                     <span className='text-xs text-gray-600 mt-0.5'>Chat</span>
                </button>)
            }
            {
                user? (<Link to='/account' className='flex flex-col items-center justify-center w-1/5'>
                    <BsPerson className='text-2xl text-gray-400'/>
                    <span className='text-xs text-gray-600 mt-0.5'>Account</span>
                </Link>) : 
                (<button className="flex flex-col items-center justify-center w-1/5 bg-white" onClick={() => setOpen(true)}>
                    <BsPerson className='text-2xl text-gray-400'/>
                    <span className='text-xs text-gray-600 mt-0.5'>Account</span>
                </button>)
            }
        </div>
      </div>
      </>
    )
  }
  
export default MobileHeader;