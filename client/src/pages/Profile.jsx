import { useEffect, useState } from "react";
import Menu from "./Menu";
import Info from "../components/profile/self/Info";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Loading from "../components/layout/Loading";
import { faL } from "@fortawesome/free-solid-svg-icons";
import MyPosts from "../components/content/MyPosts";
import ChangeProfilePicture from "../components/layout/ChangeProfilePicture";

const Profile = () => {

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [tokenGot, setTokenGot] = useState(false);

    const [isOpen,setIsOpen] = useState(false);

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    let accessToken;

    const loginState = JSON.parse(localStorage.getItem('userID'));
    const userID = loginState.userID


    console.log(userID)
    const fetchAccessToken = async () => {
        const req = await fetch("https://instagram-cx9j.onrender.com/token", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        const res = await req.json();

        const data = await res;
        if (await data) {
            setToken(await data.accessToken)
            console.log(await data.accessToken)
            setTokenGot(true)
        }
    }

    const fetchUserInfo = async () => {
        const tokenReq = await fetch("https://instagram-cx9j.onrender.com/token", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const tokenRes = await tokenReq.json();
        setToken(() => tokenRes.accessToken)
        const req = await fetch(`https://instagram-cx9j.onrender.com/users/${loginState.userID}`, {
            headers: {
                'authorization': `Bearer ${() => token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        const res = await req.json();

        const data = await res;

        console.log(await data)


        if (await data.message) {
            console.log(await data)
            setUserInfo(await data.message.foundUser);
            (userInfo) ? setLoading(() => false) : null
        }
    }



    useEffect(() => {
        fetch("https://instagram-cx9j.onrender.com/token", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setToken(data.accessToken);

                console.log(data.accessToken);

                return fetch(`https://instagram-cx9j.onrender.com/users/${loginState.userID}`, {
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
            })
            .then(res => res.json())
            .then(data => {
                // Set user info and log it
                setUserInfo(data.message.foundUser);
                console.log(data.message.foundUser);

                // Now, you can update loading state
                setLoading(false);
            })
            .catch(error => {
                // Handle any errors here
                console.error(error);
                setLoading(false);
            });
    }, [loginState.userID]); // You don't need 'token' as a dependency








    return (

        /*   className="md:w-2/5 md:ml-1 mx-6 flex flex-col justify-center items-center text-justify  " */
        <div className="relative lg:w-full lg:flex lg:justify-center ">
            <div className="lg:absolute lg:left-18 lg:top-5 lg:pl-40 ">
                {(loading) ? <Loading className="lg:left-1/2" /> : <Info userInfo={userInfo} token={token} />}
                <button onClick={open} className="bg-blue-500 px-4 py-2 text-white font-bold">
                    Change
                </button>
                <ChangeProfilePicture isOpen={isOpen} close={close} />
                <div className="flex flex-col justify-center items-center py-2 w-full">
                    <h1 className="text-3xl text-blue-500 font-bold font-bold border-b-2 mb-5 border-blue-400 border-dashed ">
                        My Posts
                    </h1>
                    <div className="pb-8  lg:w-7/12 ">
                        <MyPosts />
                    </div>
                    <hr />
                </div>

            </div>
            <Menu />
        </div>

    )
}

export default Profile