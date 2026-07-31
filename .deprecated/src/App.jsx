import Default from "./components/home/Default";
import HomePage from "./pages/HomePage";
// import '../dist/style.css';
import './style.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/forms/SignUp";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Search from "./pages/Search";
import Menu from "./pages/Menu";
import 'react-toastify/dist/ReactToastify.css';
import EditPost from "./pages/EditPost";
import PostInfo from "./pages/PostInfo";

function App() {


  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Default />}>

          </Route>
        </Routes>

        <Routes>
          <Route path="home" element={<HomePage />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="post/edit/:userID/:postId" element={<EditPost />} />
          <Route path="posts/:userID/:postId" element={<PostInfo />} />
          <Route path="search" element={<Search />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
