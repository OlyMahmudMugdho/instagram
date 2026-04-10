import { useEffect, useState } from "react";
import avatar from '../../../assets/avatar.png';
import Loading from "../Loading";
import SmallLoader from "../SmallLoader";

const Single = (props) => {
    const name = props.name;
    const username = props.username;
    const accessToken = props.accessToken;
    const userID = props.userID;
    const [followed, setFollowed] = useState(false);
    const blue = "bg-blue-400  rounded text-white font-bold py-1  w-24 lg:w-32 text-center ";
    const red = "bg-red-400 rounded text-white font-bold py-1  w-24 lg:w-32 text-center ";

    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchImg = () => {
        fetch(`https://instagram-cx9j.onrender.com/users/${userID}`, {
            headers: {
                'authorization': `Bearer ${accessToken}`,
                "Content-Type": "applications/json"
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => (data.message) ? setProfilePic(data.message.foundUser.profilePicture) : setProfilePic(null))
            .then(() => setLoading(false))
    }
    useEffect(() => {

        for (let index = 0; index < 5; index++) {
            fetchImg();
        }
    }, [profilePic])


    const follow = (event) => {
        event.preventDefault();
        const data = fetch(`https://instagram-cx9j.onrender.com/follow/${userID}`, {
            headers: {
                "authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => (data.success) ? setFollowed(true) : setFollowed(false))
            .then(() => console.log(followed))
    }

    const unfollow = (event) => {
        event.preventDefault();
        const data = fetch(`https://instagram-cx9j.onrender.com/unfollow/${userID}`, {
            headers: {
                "authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => (data.success) ? setFollowed(false) : setFollowed(true))
            .then(() => console.log(followed))
    }

    return (
        <div className="w-11/12">
            <div className=" hidden lg:flex lg:flex-row lg:items-center lg:justify-center lg:w-full lg:mb-4 lg:border lg:border-gray-200 lg:py-6 lg:px-4 lg:gap-4">
                <div className="text-left text-lg text-gray-700  flex justify-start items-center pl-2 ">
                    {fetchImg()}
                    {(loading === false && profilePic !== null) ? <img src={profilePic} alt="img" className="w-5 lg:w-20   rounded-full" /> : (loading) ? <SmallLoader /> : <img src={avatar} className="w-5 lg:w-20  rounded-full" />}
                </div>
                <div className="mr-5 w-3/4  flex flex-col justify-start items-center gap-4 text-center">
                    <p className="mr-2 text-xl">
                        {name} <br/>
                        <span className="mr-2 text-sm"> @{username}</span>
                    </p>
                    <button className={(followed) ? red : blue} onClick={(followed) ? unfollow : follow}>
                        {(followed) ? <>Unfollow</> : <>Follow</>}
                    </button>
                </div>
            </div>




            <div className=" lg:hidden ml-1 flex flex-row items-center justify-start w-full mt-8 border border-gray-200 py-4">
                <div className="text-left text-lg text-gray-700 mr-14 flex justify-start items-center pl-2 ">
                    {(loading) ? <SmallLoader /> : ((!loading) && profilePic) ? <img src={profilePic} className="w-16 rounded-full" /> : <img src={avatar} className="w-16 rounded-full " />}
                </div>
                <div className="mr-5 w-1/4 text-left flex flex-col flex-wrap justify-start items-start gap-1">
                    <a href="/home" className="mr-2"> {name}</a>
                    <button className={(followed) ? red : blue} onClick={(followed) ? unfollow : follow}>
                        {(followed) ? <>Unfollow</> : <>Follow</>}
                    </button>
                </div>
            </div>














        </div>
    )
}

export default Single