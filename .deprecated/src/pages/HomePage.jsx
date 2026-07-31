import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import fetchAccessToken from "../utils/fetchToken";
import { setLoggedIn } from "../components/forms/LoginSlice";
import { Navigate, useNavigate } from "react-router-dom";
import CreatePost from "../components/content/CreatePost";
import Menu from "./Menu";
import SuggestedUsers from "../components/layout/SuggestedUsers";
import Loading from "../components/layout/Loading";
import Contents from "../components/feed/Contents";
import getUserInfo from "../components/forms/LoginSlice";

const HomePage = () => {

  const [accessToken, setAcessToken] = useState(null);
  const [loading, setLoading] = useState(true);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const doFetch = async () => {
      let data = await fetchAccessToken("https://instagram-cx9j.onrender.com/token");
      console.log(await data)

      if (await data.accessToken) {
        setAcessToken(data.accessToken)
        setLoading(false)
        dispatch(setLoggedIn(true));
        return
      }

      if (await data?.error) {
        dispatch(setLoggedIn(false));
        console.log("error occurred");
        navigate('/')
        return;
      }
    };

    doFetch();
  }, []);

  const isLoggedIn = JSON.parse(localStorage.getItem('loginState')).isLoggedIn;
  console.log(isLoggedIn)

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center gap-9">

      {/* {(isLoggedIn) ? <CreatePost /> : <Navigate to={"/"} />} */}



      <>
        <CreatePost />
        <div className="lg:w-2/5 lg:ml-1 mx-6 flex flex-col justify-center items-center text-justify  ">
          {(loading) ? <Loading /> :
            <Contents />
          }
        </div>

        <Menu />

        {
          (loading) ? <Loading /> :
            <SuggestedUsers accessToken={accessToken} />
        }
      </>


    </div>
  )
};

export default HomePage;
