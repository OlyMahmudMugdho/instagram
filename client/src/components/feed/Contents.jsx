import { useEffect, useState } from "react"
import Loading from "../layout/Loading";
import fetchAccessToken from "../../utils/fetchToken";
import { initialState } from "../forms/LoginSlice";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avatar from '../../assets/avatar.png';
import like from '../../utils/likePost';
import Post from "./Post";

const Contents = () => {

    const [loaded, setLoaded] = useState(false);
    const [initialStage, setInitialStage] = useState(true);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState([]);
    const [token, setToken] = useState(" ");
    const [liked, setLiked] = useState([]);
    const [likesLoaded, setLikesLoaded] = useState(false);
    const [fetching, setFetching] = useState(false);


    const fetchToken = async () => {
        const data = await fetch("https://instagram-cx9j.onrender.com/token", {
            credentials: "include"
        })

        const res = await data.json();
        const accessToken = res.accessToken;

        if (await accessToken) {
            setToken(await accessToken);
        }

    }

    const fetchInitial = async () => {
        const initialData = await fetch("https://instagram-cx9j.onrender.com/posts/1", {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            credentials: "include"
        });

        const response = await initialData.json();
        const fetchedData = await response.data;
        setLoaded(true)
        if (await fetchedData) {
            setStatus([...await fetchedData]);
            setInitialStage(false);
            setLoaded(true)
        }
    }


    const infiniteFetch = async () => {

        if ((window.innerHeight + document.documentElement.scrollTop + 1) >= document.documentElement.scrollHeight) {
            let draft = status;
            let prevPage = page;
            setPage(prevPage + 1)
            console.log(page + 1)
            setLoaded(false)
            console.log("fetching ", page + 1)
            const fetched = await fetch(`https://instagram-cx9j.onrender.com/posts/${page}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            })

            const res = await fetched.json();
            const data = await res.data;

            if (await res.data) {
                console.log(await data, "from 72")
                let newStatus = [];

                await data.map(item => newStatus.push(item))
                draft = [...draft, ...newStatus]
                console.log(draft)
                setLoaded(true)
                return
            }

        }

        setLoaded(true)
    }



    const fetchStatus = async () => {

        const req = await fetch(`https://instagram-cx9j.onrender.com/posts/${page}`, {
            headers: {
                "authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
        const res = await req.json();
        console.log(await res.data)
        if (await res.data) {
            setStatus([...status, ...res.data])
            setLoaded(true)
        }

    }

    const fetchAdditional = async () => {
        try {
            if (
                window.innerHeight + document.documentElement.scrollTop + 1 >=
                document.documentElement.scrollHeight
            ) {
                setLoaded(true);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchToken();
    }, [ ])

    useEffect(() => {
        fetchStatus();
    }, [token,page])

    useEffect(() => {
        window.addEventListener("scroll", fetchAdditional);
        return () => window.removeEventListener("scroll", fetchAdditional);
    }, []);
    /*  
     useEffect(() => {
         
         const fetchAdditional = () => {
             setPage(prev => prev + 1)
     
             fetch(`https://instagram-cx9j.onrender.com/posts/${page}`, {
                 headers: {
                     "authorization": `Bearer ${token}`,
                     "Content-Type": "application/json"
                 },
                 credentials: 'include'
             })
                 .then(res => res.json())
                 .then(data => console.log(data.data))
                 .then(fetchAdditional)
                 .then(() => setFetching(false))
         }
         fetchAdditional()
     }, []) */

    return (
        <div className="flex flex-col justify-center items-center w-full py-8">
            {(!loaded ? <Loading /> :
                <div>
                    {status.map((item, i) => (item) ?
                        <Post key={i} item={item} avatar={avatar} token={token} i={i} buttonClass={"text-2xl hidden"}  />
                        : null
                    )}
                </div>
            )}


        </div>
    )
}


export default Contents