import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";


const SignUpForm = () => {

  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isError, setIsError] = useState(false);


  const navigate = useNavigate();

  let errorMsg = "Error";

  const send = async (event) => {
    event.preventDefault();
    console.log(username)
    const info = {
      username: username,
      password: password,
      name: name,
      email: email
    };
    const data = await fetch("https://instagram-cx9j.onrender.com/register", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(info)
    });

    const response = await data.json();

    if (await response.error) {
      console.log(await response.error)
      return
    }

    if (!response.error) {
      console.log(await response.message)
      navigate('/')
      return
    }

    /* .then(res => res.json())
    .then(
      res => (!res.error) ? <Navigate to={'/'} /> : () => setIsError(true)
    ) */
  }

  return (
    <form onSubmit={send} className="flex flex-col mx-2 my-2 md:my-1 gap-1 w-full justify-center items-center">
      <input type="email" name="signup-email" id="signup-email" placeholder='E-mail' className="w-full border-2 h-14 text-gray-500 border-gray-300 px-3 text-sm rounded-lg"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input type="text" name="signup-name" id="signup-name" placeholder='Full Name' className="w-full border-2 h-14 text-gray-500 border-gray-300 px-3 text-sm rounded-lg"
        onChange={(e) => setName(e.target.value)} />
      <input type="text" name="signup-username" id="signup-username" placeholder='Username' className="w-full border-2 h-14 text-gray-500 border-gray-300 px-3 text-sm rounded-lg"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input type="password" name="signup-password" id="signup-password" placeholder='Password' className="w-full border-2 h-14 text-gray-500 border-gray-300 px-3 text-sm rounded-lg"
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="signup-button w-full flex justify-center items-center mt-2 mb-6">
        <button className="bg-blue-400 text-white w-full py-2 inline-block rounded-md text-bold text-xl">Sign up</button>
        {(isError) ? <span>{errorMsg}</span> : null}
      </div>
    </form>
  )
}

export default SignUpForm