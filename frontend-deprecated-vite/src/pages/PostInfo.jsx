import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Loading from "../components/layout/Loading";
import Menu from "./Menu";
import Slider from "../components/feed/Slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Actions from "../components/content/Actions";
import avatar from "../assets/avatar.png";
import Comment from "../components/content/Comment";
import Modal from "../components/layout/Modal";


const PostInfo = () => {
  const { userID } = useParams();
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const [likeNum, setLikeNum] = useState(null);
  const [token, setToken] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [date, setDate] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsAdded, setCommentsAdded] = useState(0);
  const [commentsNum, setCommentsNum] = useState(null);




  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);




  const fetchUserInfo = () => {
    fetch('https://instagram-cx9j.onrender.com/token', {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        fetch(`https://instagram-cx9j.onrender.com/users/${userID}`, {
          headers: {
            'authorization': `Bearer ${data.accessToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.success) {
              console.log(data.message.foundUser);
              setProfilePic(data.message.foundUser.profilePic);
            }
          })
      })
  }


  useEffect(() => {
    setLoading(true);
    fetch('https://instagram-cx9j.onrender.com/token', {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.accessToken);
        setToken(data.accessToken);
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
            if (data.success) {
              fetchUserInfo();
              console.log(data.data)
              setContent(data.data.content);
              setLikeNum(data.data.likes);
              setLikeNum(data.data.likes);
              setImageUrl([...data.data.imageUrl]);
              setDate(data.data.date);
              setCommentsNum(data.data.comments)
              console.log(data.data.likes)
              console.log([...data.data.imageUrl]);
              setLoading(false);
            }
          })
      })

    console.log(imageUrl);
  }, [content, likeNum, comments])



  useEffect(() => {
    setLoading(true);
    fetch('https://instagram-cx9j.onrender.com/token', {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.accessToken);
        setToken(data.accessToken);
        fetch(`https://instagram-cx9j.onrender.com/comment/${userID}/${postId}`, {
          headers: {
            'authorization': `Bearer ${data.accessToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            console.log(data.data);
            setComments([...data.data]);
            setLoading(false);
          })
      })

    console.log(imageUrl);
  }, [commentsAdded])

  /*   useEffect(() => {
      console.log(comments[0])
    }, [comments]) */


  const addComment = (event) => {
    event.preventDefault();
    fetch('https://instagram-cx9j.onrender.com/token', {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        fetch(`https://instagram-cx9j.onrender.com/comment/${userID}/${postId}`, {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${data.accessToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            comment: newComment
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            console.log(newComment);
            setNewComment("");
            setCommentsAdded(commentsAdded + 1);
          })
      })
  }

  function extractYear(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    return year;
  }

  function extractMonth(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    return month;
  }

  function extractDay(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    return day;
  }

  return (
    <div className="relative flex justify-center items-center mt-4 pb-10 lg:mt-5 w-full" >

      {(loading) ? <Loading /> :
        <div className="w-full flex flex-col justify-center items-center ">
          <div className="absolute left-0">
            <Menu />
          </div>

          <div className="lg:ml-28 w-11/12  lg:w-5/12 border border-solid border-gray-300">
            <div className="w-full">

              <div className="flex gap-2 flex-row justify-start items-center w-full">
                <div>
                  {(profilePic) ? <img src={profilePic} /> : <img src={avatar} className="w-5 md:w-8 h-1/4 rounded-full mx-2" />}
                </div>
                <p className="text-left text-sm text-zinc-700 w-full flex items-center py-3 px-2">{author}   |   {extractDay(date)}-{extractMonth(date)}-{extractYear(date)}  </p>
              </div>

              <h1 className="px-2">{content}</h1>
              <Slider images={imageUrl} />
              <Actions userID={userID} postId={postId} likeNum={likeNum} token={token} commentsNum={commentsNum} />
            </div>
            <div className="border border-solid border-gray-300 py-1 px-2 pb-5 lg:pb-1 w-full flex flex-col gap-2">
              <label htmlFor="commentBox" className="font-bold text-zinc-800 text-xl lg:text-lg">Add a comment</label>
              <input onChange={(e) => setNewComment(e.target.value)} type="text" name="commentBox" id="commentBox" className="hidden lg:flex  flex-wrap border border-solid border-gray-400 rounded-lg h-14 px-2" />


              <div className="lg:hidden w-full flex gap-2">
                <input onChange={(e) => setNewComment(e.target.value)} type="text" name="commentBox" id="commentBox" className="border border-solid border-gray-400 w-10/12 rounded-lg h-14 px-2" />
                <button onClick={addComment} className="bg-blue-400 w-14 py-1 text-white font-bold border border-solid rounded-lg text-center hover:bg-blue-300 ">
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    className="text-xl text-center "
                  />
                </button>
              </div>

              <div className="w-full hidden lg:flex justify-end py-1 ">
                <button onClick={addComment} className="bg-blue-400 hover:bg-blue-300 w-32 py-2 text-white font-bold border border-solid rounded-lg">Post Comment</button>
              </div>
            </div>

            <div className="w-full px-2 py-5 overflow-y-scroll max-h-56">
              {comments && comments.map(
                (item, id) => <Comment
                  key={id}
                  comment={item.comment}
                  commentor={item.commentor}
                  date={item.date}
                />
              )}
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={openModal}
            >
              Open Modal
            </button>

            <Modal isOpen={isModalOpen} onClose={closeModal} />


          </div>



        </div>}

    </div>
  )
}

export default PostInfo