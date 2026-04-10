import Actions from "../content/Actions";
import Slider from "./Slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Post = (props) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuClass, setMenuClass] = useState("hidden flex flex-col text-center absolute top-5 bg-white  border-gray-200  rounded-lg");



    const navigate = useNavigate();

    const item = props.item;
    const avatar = props.avatar;
    const token = props.token;
    const i = props.i;
    const buttonClass = props.buttonClass;
    const renderAgain = props.renderAgain;


    const toggleMenu = (event) => {
        event.preventDefault();
        if (menuOpen) {
            setMenuClass("hidden flex flex-col text-center absolute top-5 bg-white rounded-lg");
            setMenuOpen(false);
            return
        }

        setMenuClass("flex flex-col text-center absolute top-5 bg-white rounded-lg");
        setMenuOpen(true)

    }

    const handleMenuClick = (e) => {
        if (e.menuOpen) {
            e.stopPropagation();
            return
        }
    }

    const hideMenu = (event) => {
        event.preventDefault();
        if (menuOpen) {
            setMenuClass("hidden flex flex-col text-center absolute top-5 bg-white border border-gray-200 rounded-lg");
            setMenuOpen(false);
            return
        }
    }


    const deletePost = (event) => {
        event.preventDefault();
        fetch('https://instagram-cx9j.onrender.com/token', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.accessToken);

                fetch(`https://instagram-cx9j.onrender.com/posts/${item.userID}/${item.postId}`, {
                    method: 'DELETE',
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if (data.success) {
                            renderAgain(event);
                        }
                    })
            })
    }

/*     useEffect(() => {
        window.addEventListener("click", function(event) {
            event.preventDefault();
            if(menuOpen) {
                hideMenu()
            }
        })
    },[menuOpen]) */

    const navigateToPostInfo = (event) => {
        event.preventDefault();
        navigate(`/posts/${item.userID}/${item.postId}`)
    }

    function extractYear(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        return year;
    }

    function extractMonth(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        return month;
    }

    function extractDay(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        return day;
    }

    return (
        <div className="w-full h-auto flex flex-col items-center border border-gray-200  mb-5">
            <div className="w-full flex items-end justify-end  px-2 relative">
                <button onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faEllipsis} className={buttonClass} />
                </button>
                <div onClick={toggleMenu} className={menuClass}>
                    <Link to={`/post/edit/${item.userID}/${item.postId}`} className="py-1 px-8 text-gray-100 font-bold bg-blue-300 border rounded-md ">Edit</Link>
                    <button onClick={deletePost} className="py-1 px-8  text-white font-bold bg-red-400 border rounded-md">Delete</button>
                </div>
            </div>
            <div className="flex gap-2 flex-row justify-start items-center w-full">
                <div>
                    {(item.profilePic) ? <img src={item.profilePic} /> : <img src={avatar} className="w-5 md:w-8 h-1/4 rounded-full mx-2" />}
                </div>
                <p className="text-left text-sm text-zinc-700 w-full flex items-center py-3 px-2">{item.author}   |   {extractDay(item.date)}-{extractMonth(item.date)}-{extractYear(item.date)}  </p>
            </div>
            <h1 onClick={navigateToPostInfo} className="text-left w-full flex items-center py-3 px-2">{item.content}</h1>

            <Slider images={item.imageUrl} />

            {/* <img src={item.imageUrl} alt="" className="w-full h-96 object-cover " style={{ height: "500px" }} /> */}

            <Actions userID={item.userID} postId={item.postId} token={token} likeNum={(item.likes) ? item.likes : 0} key={i} commentsNum={item.comments} />

        </div>
    )
}

export default Post