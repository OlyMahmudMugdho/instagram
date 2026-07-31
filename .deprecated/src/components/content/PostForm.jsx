import { useEffect, useState } from "react";
import { json } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import fetchAccessToken from "../../utils/fetchToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify"

const PostForm = () => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [posted, setPosted] = useState(false);




    const send = async (event) => {
        event.preventDefault()

        const formData = new FormData();
        formData.append('content', text);

        const AccessToken = await fetchAccessToken('https://instagram-cx9j.onrender.com/token')
        console.log(await AccessToken.accessToken);
        const accessToken = await AccessToken.accessToken;

        [...files].forEach((file) => {
            formData.append('image', file)
        })

        fetch('https://instagram-cx9j.onrender.com/posts', {
            method: 'POST',
            headers: {
                authorization: `Bearer ${accessToken}`
            },
            credentials: "include",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.success) {
                    setPosted(true);
                }
            })

        setText("")
        setFiles([])


        if(posted) {
            toast.success('status uploaded', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }


    }

    const showTost = async () => {
            toast.success('status uploaded', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        
    }



    return (
        <form onSubmit={send} className="flex flex-col justify-center items-center border border-solid rounded border-zinc-600 mt-10 w-full">
            <ToastContainer />
            <textarea className="p-5 text-lg bg-zinc-100 w-full" name="" id="" value={text} onChange={e => setText(e.target.value)} ></textarea>
            <input type="file" multiple name="file" id="file" hidden onChange={e => setFiles(e.target.files)} />
            <label className="bg-teal-500 w-full text-center h-8 flex  items-center text-white text-xl color-white px-2 " htmlFor="file" > <FontAwesomeIcon icon={faImage} /> <span className={"mr-2"}> </span> choose image {(files.length >= 1) ? <span className={"ml-8  md:ml-40"}> {files.length} selected</span> : null} </label>

            <button className="bg-blue-300 text-white text-2xl w-full h-10" onClick={showTost} >Post</button>
        </form>
    )
}

export default PostForm