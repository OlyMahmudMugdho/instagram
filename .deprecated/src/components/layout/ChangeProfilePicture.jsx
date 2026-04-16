
const ChangeProfilePicture = ({ isOpen, close }) => {

    if (!isOpen) {
        return
    }

    const changePic = () => {
        fetch("https://instagram-cx9j.onrender.com/token", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {

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
    }

    return (
        <div className="fixed inset-0 flex justify-center z-50 items-center " onClick={close}>
            <div className="absolute inset-0  bg-gray-500 opacity-50">

            </div>
            <div className="flex flex-col justify-center items-center bg-white z-50 border rounded-lg lg:w-4/12" >
                <p className="border border-solid w-full py-6 px-14 flex justify-center items-center text-xl">
                    Change Profile Picture
                </p>
                <p className="border-t hover:bg-zinc-100 w-full  py-5  text-center text-md cursor-pointer text-blue-500 font-medium">
                    Upload Photo
                </p>
                <p className="border-t hover:bg-zinc-100 w-full  py-5  text-center text-md cursor-pointer text-red-500 font-medium">
                    Remove Photo
                </p>
                <p onClick={close} className="border-t hover:bg-zinc-100 w-full  py-5  text-center text-md cursor-pointer font-medium">
                    Cancel
                </p>
            </div>
        </div>
    )
}

export default ChangeProfilePicture