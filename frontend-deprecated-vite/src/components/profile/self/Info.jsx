import { useEffect, useState } from 'react';
import avatar from '../../../assets/avatar.png';
import { Link } from 'react-router-dom';

const Info = (props) => {


    const userInfo = props.userInfo;
    console.log(userInfo)

    


    const editProfile = () => { return 0 }


    return (
        <div className=" flex flex-col  justify-center items-center w-full lg:py-10 px-1 text-left py-4">
            <div className='flex flex-row w-full px-2 justify-between items-center lg:gap-10'>
                <div className="flex justify-center items-center w-1/3 lg:mr-10 ">
                    {(userInfo.profilePicture) ? <img src={userInfo.profilePicture} alt="profile picture" className='rounded-full md:w-36 lg:w-44' /> :
                        <img src={avatar} alt="profile picture" className='rounded-full md:w-36 lg:w-44' />}
                </div>
                <div className="flex flex-col justify-center items-center w-2/3 lg:gap-4 lg:ml-">
                    <div className='flex flex-col w-full lg:pl-0 '>
                        <div className="flex flex-col lg:flex-row justify-start items-center lg:items-end w-full lg:gap-10 gap-5 px-1">
                            <h1 className='text-3xl font-bold mt-5'>{userInfo.username}</h1>
                            <Link to={'/profile/edit'} replace={true} className='bg-blue-400 text-white font-bold px-4 py-2 rounded-md'>Edit Profile</Link>
                        </div>
                        <div className='hidden lg:flex flex-col items-start w-full pt-8 gap-4 px-1 '>
                            <div className="flex flex-row justify-start items-center w-full lg:gap-10 gap-20 text-zinc-800 font-medium">
                                <h1 className='text-xl'><span className='font-bold text-2xl'>{userInfo.followers}</span> <span>Followers</span></h1>
                                <h1 className='text-xl'><span className='font-bold text-2xl'>{userInfo.following}</span> <span>Following</span></h1>
                            </div>
                            <div className="flex flex-row justify-start items-center w-full lg:gap-10">
                                <p className='text-left text-2xl'>{userInfo.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='flex flex-col items-start w-full pt-8 gap-4 px-5 lg:hidden'>
                <div className="flex flex-row justify-start items-center w-full lg:gap-10 gap-20 text-zinc-800 font-medium">
                    <h1 className='text-xl'><span className='font-bold text-2xl'>{userInfo.followers}</span> <span>Followers</span></h1>
                    <h1 className='text-xl'><span className='font-bold text-2xl'>{userInfo.following}</span> <span>Following</span></h1>
                </div>
                <div className="flex flex-row justify-start items-center w-full lg:gap-10">
                    <p className='text-left text-2xl font-medium text-zinc-800'>{userInfo.name}</p>
                </div>
            </div>
        </div>
    )
}

export default Info 