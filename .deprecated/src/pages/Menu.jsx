import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import pixelLogoBlack from '../assets/pixlLogoBlack.png'


const Menu = () => {
    const navigate = useNavigate();

    const logOut = async () => {
        const data = await fetch("https://instagram-cx9j.onrender.com/logout", {
            credentials: 'include'
        })

        const loginState = JSON.parse(localStorage.getItem('loginState'));
        loginState.isLoggedIn = false;
        loginState.refreshToken = " "
        loginState.status = " "
        loginState.username = " "
        localStorage.setItem('loginState', JSON.stringify(loginState))
        navigate('/')
    }

    return (
        <div className="w-full text-center fixed lg:fixed bottom-0 flex flex-row justify-center items-center text-3xl py-2 gap-16 shadow-lg shadow-black border lg:flex-col lg:h-full lg:left-0 lg:items-start lg:px-4 lg:shadow-2xl lg:border  bg-white lg:w-48 lg:text-lg">
            <div className="lg:flex lg:flex-row gap-4 w-32 cursor-pointer hidden ">
                <img src={pixelLogoBlack} alt="logo" />
            </div>

            <div className="flex flex-row gap-4 justify-center items-center cursor-pointer">
                <Link to={'/home'}><FontAwesomeIcon icon={faHouse} /></Link>
                <Link to={'/home'} className="hidden lg:inline-block">Home</Link>
            </div>

            <div className="flex flex-row gap-4 justify-center items-center cursor-pointer">
                <Link to={'/search'}><FontAwesomeIcon icon={faMagnifyingGlass} /></Link>
                <Link to={'/search'} className="hidden lg:inline-block">Search</Link>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center cursor-pointer">
                <Link to={'/profile'}><FontAwesomeIcon icon={faUser}  /></Link>
                <Link to={'/profile'} className="hidden lg:inline-block">Profile</Link>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center cursor-pointer" onClick={logOut}>
                <FontAwesomeIcon className="text-red-600 font-bold" icon={faRightFromBracket} />
                <span className="hidden lg:inline-block text-red-600 font-bold">Log Out</span>
            </div>
        </div>
    )
}

export default Menu