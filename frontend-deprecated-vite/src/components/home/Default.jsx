import LoginForm from '../forms/LoginForm';
import pixlLogoBlack from '../../assets/pixlLogoBlack.png';
import train from '../../assets/train.jpeg';
import campfire from '../../assets/campfire.jpeg'
import { useSelector } from 'react-redux/es/hooks/useSelector';
import fetchAccessToken from '../../utils/fetchToken';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '../forms/LoginSlice';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../layout/Loading';

const Default = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverRunning, setServerRunning] = useState(true);

  useEffect(() => {
    fetch("https://instagram-cx9j.onrender.com/api")
      .then(res => res.json())
      .then(data => (data.success) ? setServerRunning(true) : setServerRunning(false))
  }, [serverRunning])

  useEffect(() => {
    const data = fetch("https://instagram-cx9j.onrender.com/token", {
      credentials: 'include'
    })
      .then(res => res.json())
      .then((res) => (res.accessToken) ? dispatch(setLoggedIn(true)) && navigate('/home') : dispatch(setLoggedIn(false)) && setLoading(false))
  }, [loading])

  console.log(token)

  return (
    <div className=' w-full flex flex-row items-center justify-center gap-3 min-h-full md:min-h-screen'>
    {!serverRunning ? (<Loading />) : (
      <div className='flex flex-row items-center justify-center gap-3 min-h-full md:min-h-screen'>
        <div className="image-section hidden md:inline-block  mix-blend-difference relative	mx-10">
          <img src={train} alt="train" className='w-64 train opacity-90  -rotate-3 absolute right-40' />
          <img src={campfire} alt="train" className='w-64 train opacity-90   rotate-2 left-44 top-3 z-10' />
        </div>
        <div className='form-section md:border  md:ml-6 md:px-4  md:inline-block  '>
          <div className="form-container form-section flex flex-col items-center justify-center">
            <div className="logo-container">
              <img src={pixlLogoBlack} alt="pixlLogo" className='w-56 md:w-52 h-52 ' />
            </div>
            <div className="form-container">
              <LoginForm />
            </div>

            <div className='mt-10'>
              <a href="b.com" className='text-blue-600'>Forgot Password?</a>
            </div>

            <div className="mt-8 border  p-5 mb-5  font-medium">
              Don&apos;t have an account? <Link to={'/signup'} ><span className='text-blue-600 '>Sign-Up</span></Link>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default Default