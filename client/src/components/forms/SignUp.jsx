import SignUpForm from "./SignUpForm";
import pixlLogoBlack from '../../assets/pixlLogoBlack.png';
import { Link } from "react-router-dom";

const SignUp = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full md:mb-1 md:max-h-5/6">
            <div className="flex flex-col justify-center items-center md:border md:w-1/4 md:my-4 md:px-4     ">
                <div className="logo-container border-black flex items-center justify-center">
                    <img src={pixlLogoBlack} alt="pixel logo" className="w-56 md:w-52 h-52 md:h-44 " />
                </div>
                <div className="message-container font-semibold text-gray-500 text-md  pt-2 pb-4 md:pb-0 ">
                    Sign Up to see photos from your friends
                </div>
                <SignUpForm />
                
            </div>
            <div className="border md:w-1/4 mt-2 md:mt-1 py-4 px-2 flex items-center justify-center">
                <span className="mr-2 text-gray-500 font-bold text-md">Have an account?</span> <Link to={'/'}>
                    <span className="text-blue-500 text-md font-bold"> Log in</span>
                </Link>
            </div>
        </div>
    )
}

export default SignUp