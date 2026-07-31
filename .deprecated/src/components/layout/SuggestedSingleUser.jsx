import { useState } from "react";

const SuggestedSingleUser = (props) => {
    const accessToken = props.accessToken;
    const nameOfTheUser = props.nameOfTheUser;
    const userID = props.userID;
    const [followed, setFollowed] = useState(false);

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
            .then(() => console.log(data))
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
            .then(data => (data.success) ? setFollowed(true) : setFollowed(false))
            .then(() => console.log(data))
    }

    return (
        <div className="flex justify-center items-center">
            <a href="/home">
                {{ nameOfTheUser }}
            </a>
            {(!followed) ? <button onClick={follow} className="bg-blue-500 text-white font-bold">Follow</button> : <button onClick={unfollow} className="bg-gray-300 text-gray-700">Unfollow</button>}
        </div>
    )
}

export default SuggestedSingleUser