import React, { useState, useMemo } from "react";
import { postStatus, getStatus, updatePost  , getPosts} from "../../../api/FirestoreAPI";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import ModalComponent from "../Modal";
import { uploadPostImage } from "../../../api/ImageUpload";
import { getUniqueID } from "../../../helpers/getUniqueId";
import PostsCard from "../PostsCard";
import "./index.scss";


export default function  PostStatus({ currentUser }) {
  console.log("currentUser" , currentUser)
  // console.log("currentUser.userId" , currentUser.userID)
  let userEmail = localStorage.getItem("userEmail"); 
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [allStatuses, setAllStatus] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [postImage, setPostImage] = useState("");

  const sendStatus = async () => {
    let object = { 
      status: status,
      timeStamp: getCurrentTimeStamp("LLL"),
      userEmail: currentUser.email,
      userName: currentUser.name,
      postID: getUniqueID(),
      userID: currentUser.userID,
      postImage: postImage,
    }; 
     postStatus(object);
     setModalOpen(false);
     setIsEdit(false);
     setStatus("");
  };

  

  const getEditData = (posts) => {
    console.log(posts);
    setModalOpen(true);
    console.log(posts?.status);
    setCurrentPost(posts);
    setIsEdit(true);
  };

  const updateStatus = () => {
    console.log(status);
    console.log(currentPost)
    updatePost(currentPost?.postID, status, postImage);
    setModalOpen(false);
  };


 
  useMemo(() => {
    getStatus(setAllStatus);
  }, []);
  
console.log(allStatuses);
  return (
    <div className="post-status-main">
      
      <div className="user-details">
      
        <img src={currentUser?.imageLink} alt="imageLink" />
        <p className="name">{currentUser?.name}</p>
        <p className="headline">{currentUser?.headline}</p>
      </div>
      <div className="post-status">
        <img
          className="post-image"
          src={currentUser?.imageLink}
          alt="imageLink"
        />
        <button
          className="open-post-modal"
          onClick={() => {
            setModalOpen(true);
            setIsEdit(false);
          }}
        >
          Start a Post
        </button>
      </div>

      <ModalComponent
        setStatus={setStatus}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        status={status}
        sendStatus={sendStatus}
        isEdit={isEdit}
        updateStatus={updateStatus}
        uploadPostImage={uploadPostImage}
        postImage={postImage}
        setPostImage={setPostImage}
        setCurrentPost={setCurrentPost}
        currentPost={currentPost}
      />
      <div>
      {allStatuses?.map((posts) => {
         return(
            <PostsCard posts={posts} getEditData={getEditData}/>
         )
        })}
      </div>
    </div>
  );
}
