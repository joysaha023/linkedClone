import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { BsPencil, BsTrash } from "react-icons/bs";
import {
  getCurrentUser,
  getAllUsers,
  deletePost,
  getConnections,
} from "../../../api/FirestoreAPI";
import LikeButton from "../LikeButton";
import "./index.scss";

export default function PostsCard({ posts, id, getEditData }) {
  let navigate = useNavigate();
  // console.log("PostsCard", posts);
  // console.log("posts.userID", posts?.status?.userID);
  const postData = posts?.status?.status;
  //let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  console.log(allUsers);
  const all = allUsers.filter((item) => item.id ===posts.status?.userID) .map((item) => item.imageLink)

    // console.log(all)
  useMemo(() => {
    getCurrentUser(setCurrentUser);
    getAllUsers(setAllUsers);
  }, []);
  // console.log(currentUser);

  useEffect(() => {
    getConnections(currentUser?.userID, posts.status?.userID, setIsConnected);
  }, [currentUser?.userID, posts.status?.userID]);

  // console.log("POSTSCARD" , allUsers?.filter((user) => user?.id === posts.status?.userID)[0]?.name)
  // console.log("POSTSCARD POSTS" , posts)

  return (
    <div className="posts-card" key={id}>
      <div className="post-image-wrapper" > 
      <div className="action-container">
          {/* <BsPencil size={20} className="action-icon" onClick={() => getEditData(posts?.status)} />
          <BsTrash size={20} className="action-icon" /> */}
      </div>
      <img
        alt="profile-image"
        className="profile-image"
        src={all}
      />
      <p
        className="name"
       
        onClick={
          () =>
          navigate(
            "/profile"
            , {
            state: { 
              id: posts?.status?.userID, email: posts?.status?.userEmail
            },
          }
          )
          
        }
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {allUsers?.filter((user) => user?.id === posts?.status?.userID)[0]?.name}
        

      </p>
      </div>
      
     
     
      <p className="headline">{allUsers.filter((user) => user.id === posts.userID)[0]?.headline}</p>
      <p className="timestamp">{posts.status?.timeStamp}</p>
        
    
      <p className="status"> {postData}</p>
      {posts?.status?.postImage && (
        <img src={posts?.status?.postImage} alt="postImage" />
      )}

      <LikeButton
        userId={currentUser?.userID}
        postId={posts?.id}
        currentUser={currentUser}
      />
    </div>
  );
}
// {posts.status}
