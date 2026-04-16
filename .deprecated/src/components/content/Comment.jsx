import { useEffect, useState } from "react";
import avatar from "../../assets/avatar.png";



const Comment = (props) => {
    const commentor = props.commentor;
    const date = props.date;
    const comment = props.comment;
    const [profilePic, setProfilePic] = useState(null);
    const [commentorName,setCommentorName] = useState(null);


    useEffect(() => {
        fetch('https://instagram-cx9j.onrender.com/token', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                fetch(`https://instagram-cx9j.onrender.com/users/${commentor}`, {
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
                            console.log(data.message.foundUser);
                            setProfilePic(data.message.foundUser.profilePic);
                            setCommentorName(data.message.foundUser.name);
                        }
                    })
            })
    }, [commentor,profilePic])

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
        <div className="w-full flex flex-col border border-solid mb-3">
            <div className="flex gap-2 flex-row justify-start items-center w-full">
                <div>
                    {(profilePic) ? <img src={profilePic} /> : <img src={avatar} className="w-4 lg:w-8 h-1/4 rounded-full mx-2" />}
                </div>
                <p className="text-left text-sm text-zinc-700 w-full flex items-center py-3 px-2">{commentorName}   |   {extractDay(date)}-{extractMonth(date)}-{extractYear(date)}  </p>
            </div>
            <h1 className="px-2">{comment}</h1>
        </div>
    )
}

export default Comment