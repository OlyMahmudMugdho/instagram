import { useEffect, useState } from "react";
import Loading from "../layout/Loading";
import Post from "../feed/Post";
import avatar from "../../assets/avatar.png";

const MyPosts = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const [needsRender, setNeedsRender] = useState(0);

    const renderAgain = (event) => {
        event.preventDefault();
        setNeedsRender(needsRender + 1);
    }


    useEffect(() => {
        setLoading(true);
        fetch("https://instagram-cx9j.onrender.com/token", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setToken(data.accessToken);
                fetch('https://instagram-cx9j.onrender.com/posts/myposts', {
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then(data => {
                        setMyPosts(data.data);
                        setLoading(false);
                        setLoaded(true);
                        console.log(myPosts[0])
                    })
            })
    }, [loaded, needsRender])

    return (
        <div>
            {loading ? <Loading /> :
                <div className="px-5">
                    {myPosts.map((item, i) =>
                        <Post
                            key={i}
                            item={item}
                            avatar={avatar}
                            token={token}
                            i={i}
                            buttonClass={"text-2xl"}
                            renderAgain={renderAgain}
                            menuIsOpen={menuIsOpen} 
                            setMenuIsOpen={setMenuIsOpen}
                            />
                    )}
                </div>
            }
        </div>
    )
}

export default MyPosts