import React, { useEffect, useState } from 'react';
import Loading from '../components/layout/Loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Menu from './Menu';

const EditPost = (props) => {

    const { userID } = useParams();
    const { postId } = useParams();

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const editPost = (event) => {
        event.preventDefault();
        fetch('https://instagram-cx9j.onrender.com/token', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setLoading(true);
                console.log(data);
                fetch(`https://instagram-cx9j.onrender.com/posts/${userID}/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        content: content
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        setLoading(false);
                        if(data.success) {
                            navigate('/profile')
                        }
                    })
            })

    }

    useEffect(() => {
        fetch('https://instagram-cx9j.onrender.com/token', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setLoading(true);
                console.log(data);
                fetch(`https://instagram-cx9j.onrender.com/posts/${userID}/${postId}`, {
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data.data.content);
                        setContent(data.data.content)
                        setLoading(false)
                    })
            })
    }, [])

    return (
        <div className="relative flex justify-center items-center mt-10 w-full h-full">
            <div className="absolute left-0">
            </div>
            <Menu />
            <div className=" lg:ml-28  w-full flex flex-col justify-center items-center ">
                <h1 className='text-3xl text-blue-400 font-bold border-2 border-dashed border-blue-400 px-10 py-2 mb-8  mt-10 lg:w-3/12 text-center'>
                    Edit Post
                </h1>
                <div className='flex flex-col w-10/12 lg:w-1/3  justify-center '>
                    {(loading) ? <Loading /> :
                        <form onSubmit={editPost} className='flex flex-col w-full'>
                            <label htmlFor="contentBox" className='text-lg font-medium'>Content </label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                type="text"
                                name="contentBox"
                                id="contentBox"
                                className='border border-black w-full h-40 px-2 py-1 '
                            />
                            <button type='submit' className='text-2xl text-white font-bold border border-solid border-zinc-100 rounded-lg w-full h-12 px-4 mt-4 mb-0 bg-blue-400 text-center '>Update</button>
                            <Link to={'/profile'} className='text-2xl text-white font-bold border border-solid border-zinc-100 rounded-lg w-full px-4 py-2 my-4 bg-red-400 text-center'>Cancel</Link>
                        </form>

                    }

                </div>
            </div>
        </div>
    )
}

export default EditPost