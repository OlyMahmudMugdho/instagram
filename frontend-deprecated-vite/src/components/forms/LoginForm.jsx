import { useState } from "react"
import { useDispatch } from "react-redux";
import { setLoggedInUsername, setLoggedInUserID, setLoggedIn, setStatus, setRefreshToken } from "./LoginSlice";
import { useNavigate } from "react-router-dom";


const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonClass, setButtonClass] = useState("bg-blue-400 text-white w-full bold text-lg font-bold h-10 rounded my-2 ");
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loginSucess, setLoginSuccess] = useState(false);



  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setButtonDisabled(true);
    setButtonClass("bg-gray-400 text-white w-full bold text-lg font-bold h-10 rounded my-2 ");
    let status = false;
    const res = await fetch("https://instagram-cx9j.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(
          {
            username: username,
            password: password
          }
        ),
        // credentials: 'same-origin',

      })

    const response = await res.json()



    if (await response?.error === true) {
      console.log("occured error")
      setButtonDisabled(false);
      setButtonClass("bg-blue-400 text-white w-full bold text-lg font-bold h-10 rounded my-2 ");

      if (await response?.message === "user not found") {
        setErrorType("user");
        setErrorMessage("user not found with this username");
        return
      }

      if (await response?.message === "wrong password") {
        setErrorType("password")
        setErrorMessage("wrong password");
        return
      }

      setErrorMessage("Wrong Credentials");




      return
    }


    console.log(await response)
    const refreshToken = await response.refreshToken;
    const message = await response.message;
    const data = await response.data;
    const userID = await data[0].userID;


    console.log(await userID);

    if (await refreshToken && await message) {
      localStorage.setItem("refreshToken", JSON.stringify(await refreshToken))
      setLoginSuccess(true);
      console.log(message);





      status = true;
    }


    dispatch(setLoggedInUsername(username));
    const msg = "logged"
    /* () => { dispatch(setLoggedInUsername(username)) } */

    if (!status) {
      return
    }


    dispatch(setLoggedInUserID(userID))

    console.log(status)
    dispatch(setLoggedIn(true));
    dispatch(setStatus(msg));
    dispatch(setRefreshToken(refreshToken));


    const accessToken = fetch("https://instagram-cx9j.onrender.com/token", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    })
      .then(res => res.json())

    // const accessToken = fetchAccessToken("https://instagram-cx9j.onrender.com/token");

    console.log(accessToken);
    console.log("logging accessToken from LoginForm.jsx");


    navigate('/home', { replace: true })
  }


  return (
    <div>
      <form className="flex flex-col justify-center items-center gap-1" onSubmit={handleLogin}>
        <input type="text" name="username" id="login-username" className="border-2 border-solid border-gray-300   h-12 px-2 " placeholder="username"
          onChange={e => setUsername(e.target.value)}
        />
        {(errorType === "user") ? <span className="text-red-700 font-bold">{errorMessage}</span> : null}
        <input type="password" name="password" id="login-password" className="border-2 border-solid border-gray-300 h-12 px-2" placeholder="password"
          onChange={e => setPassword(e.target.value)}
        />
        {(errorType === "password") ? <span className="text-red-700 font-bold">{errorMessage}</span> : null}
        <button className={buttonClass} disabled={buttonDisabled} >Log in</button>

      </form>
    </div>
  )
}

export default LoginForm