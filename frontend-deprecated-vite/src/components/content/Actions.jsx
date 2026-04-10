import React, { useEffect, useState } from 'react'
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';


const Actions = (props) => {

    const navigate = useNavigate();

    const userID = props.userID;
    const postId = props.postId

    const token = props.token;
    const likeNum = props.likeNum;
    const commentsNum = props.commentsNum;
    const [likeCount, setLikeCount] = useState(likeNum);
    const [commentsCount, setCommentsCount] = useState(commentsNum);
    const [liked, setLiked] = useState(false);
    const [icon, setIcon] = useState(faHeart);
    const [iconClass, setIconClass] = useState("text-3xl text-zinc-500");

    const checkLiked = (userID, postId, accessToken) => {

        fetch(`https://instagram-cx9j.onrender.com/token`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {

                fetch(`https://instagram-cx9j.onrender.com/isliked/${userID}/${postId}`, {
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then(data => setLiked(data.liked))
                    .then(() => liked ? setIconClass("text-3xl text-red-500") : setIconClass("text-3xl text-zinc-500"))
                    .then(() => liked ? setIcon(solidHeart) : setIcon(faHeart))
            })

    }


    const like = (userID, postID) => {
        fetch(`https://instagram-cx9j.onrender.com/token`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {

                fetch(`https://instagram-cx9j.onrender.com/like/${userID}/${postID}`, {
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then(() => setLiked(true))
                    .then(() => setLikeCount(likeCount + 1))
            })
    }

    const unlike = (userID, postID) => {

        fetch(`https://instagram-cx9j.onrender.com/unlike/${userID}/${postID}`, {
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(() => setLiked(false))
            .then(() => setLikeCount(likeCount - 1))

    }

    const refresh = () => {
        checkLiked(userID, postId, token)
        checkLiked(userID, postId, token)

        if (liked) {
            checkLiked();
            setLiked(true);
            setIconClass("text-3xl text-red-500")
        }
        if (!liked) {
            checkLiked();
            setLiked(false);
            setIconClass("text-3xl text-zinc-500")
        }
    }

    const postInfo = (event) => {
        event.preventDefault();
        navigate(`/posts/${userID}/${postId}`);
    }


    useEffect(() => {
        checkLiked(userID, postId, token);
    }, [liked, likeCount])

    return (
        <div className="flex justify-between w-full px-20 py-1" >
            <div className='flex gap-1 items-center justify-center font-bold'>
                <button onClick={() => (!liked) ? like(userID, postId) && refresh() : unlike(userID, postId) && refresh()} className="text-3xl text-zinc-500"><span className=' text-white'><FontAwesomeIcon icon={(liked) ? icon : icon} className={iconClass} /></span></button>
                <p>{likeCount}</p>
            </div>
            <div className='flex gap-1 items-center justify-center font-bold'>
                <Link to={`/posts/${userID}/${postId}`} className="text-3xl text-zinc-500 inline-block  aria-hidden:true" > <FontAwesomeIcon icon={faComment} /> </Link>
                <p>{commentsCount}</p>
            </div>
        </div>
    )
}

export default Actions