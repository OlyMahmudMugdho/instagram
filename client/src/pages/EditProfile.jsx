import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import Loading from '../components/layout/Loading';
import { Link, useNavigate } from 'react-router-dom';

const EditProfile = () => {

    const userID = JSON.parse(localStorage.getItem('userID')).userID;
    const navigate = useNavigate();

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);
    const [token, setToken] = useState(null);


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
                console.log(data.accessToken)
                return fetch(`https://instagram-cx9j.onrender.com/users/${userID}`, {
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
            })
            .then(res => res.json())
            .then(data => { setName(data.message.foundUser.name); setEmail(data.message.foundUser.email); (data.success) ? setFinished(true) : setFinished(null) })
            .then(() => setLoading(false))
    }, [])

    const editProfile = (event) => {
        event.preventDefault();
        console.log(name);
        console.log(token)

        setLoading(true)

        fetch("https://instagram-cx9j.onrender.com/users/profile/edit", {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name,
                email: email
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .then(() => setLoading(false))
            .then(() => finished ? navigate('/profile') : navigate('/profile/edit'))

    }


    /*
        setToken(data.accessToken))
        return fetch(`https://instagram-cx9j.onrender.com/users/${userID}`, {
            headers: {
                'authorization': `Bearer ${data.accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setName(data.message.foundUser))
            .then(() => console.log(name))
            .then(() => setFinished(true))
    */

    return (
        <div className="relative flex justify-center items-center mt-10 w-full">
            <div className="absolute left-0">
                <Menu />
            </div>
            <div className=" lg:ml-28  w-full flex flex-col justify-center items-center ">
                <h1 className='text-3xl text-blue-400 font-bold border-2 border-dashed border-blue-400 px-10 py-2 mb-8  mt-10 lg:w-3/12 text-center'>
                    Edit Profile
                </h1>
                <div className='flex flex-col w-10/12 lg:w-1/4  justify-center '>
                    {(loading) ? <Loading /> :
                        <form onSubmit={editProfile} className='flex flex-col py-4 gap-3  w-full'>
                            <label htmlFor="name" className='text-lg font-medium'>Name </label>
                            <input
                                value={name}
                                type="text"
                                name="name"
                                id="profileName"
                                className='border border-solid border-black w-full h-10 px-6 py-6 '
                                onChange={e => setName(e.target.value)}
                            />

                            <label htmlFor="email" className='text-lg font-medium'>E-mail</label>
                            <input
                                value={email}
                                type="email"
                                name="email"
                                id="profileEmail"
                                className='border border-solid border-black w-full h-10 px-6 py-6 '
                                onChange={e => setEmail(e.target.value)}
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

export default EditProfile