import React, { useState, useMemo } from "react";
import {
  getSingleStatus,
  getSingleUser,
  postStatus,
  getStatus,
} from "../../../api/FirestoreAPI";
import PostsCard from "../PostsCard";
import { HiOutlinePencil } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import FileUploadModal from "../FileUploadModal";
import { uploadImage as uploadImageAPI } from "../../../api/ImageUpload";
import "./index.scss";

export default function ProfileCard({ onEdit, currentUser }) {
  console.log(currentUser);
  let location = useLocation();
  console.log(location);
  console.log(location?.state?.id);
  const [allStatuses, setAllStatus] = useState([]);
  const [singleStatuses, setSingleStatus] = useState([]);
  const [currentProfile, setCurrentProfile] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const getImage = (event) => {
    setCurrentImage(event.target.files[0]);
  };
  console.log(currentProfile, currentUser);
  const uploadImage = () => {
    uploadImageAPI(
      currentImage,
      currentUser.userID,
      setModalOpen,
      setProgress,
      setCurrentImage
    );
  };

  useMemo(() => {
    getStatus(setAllStatus);
  }, []);
  console.log(allStatuses);

  let newStatus = allStatuses.filter((post) => {
    return post?.status?.userID === currentUser?.userID;
  });
  console.log(newStatus);
  useMemo(() => {
    if (location?.state?.id) {
      getSingleStatus(setSingleStatus, location?.state?.id);
    }

    if (location?.state?.email) {
      getSingleUser(setCurrentProfile, location?.state?.email);
    }
  }, []);
  console.log("currentProfile", currentProfile);
  console.log("singleStatuses", singleStatuses);

  let singleStatus = singleStatuses.filter((post) => {
    return post?.status?.userID === location?.state?.id;
  });
  console.log("singleStatus1", singleStatus);
console.log("line 65", currentProfile?.userID)
  return (
    <>
      <FileUploadModal
        getImage={getImage}
        uploadImage={uploadImage}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        currentImage={currentImage}
        progress={progress}
      />
      <div className="profile-card">
        {/* logic not working here */}
        {/* {currentUser.userID === location.state.id ? (
          <div className="edit-btn">
            <HiOutlinePencil className="edit-icon" onClick={onEdit} />
          </div>
        ) : (
          <>Edit</>
        )} */}
        {/* <input type={"file"} onChange={getImage} /> */}
        <div className="edit-btn">
          {(currentProfile?.userID=== currentUser?.userID || currentProfile?.userID === undefined) && <HiOutlinePencil className="edit-icon" onClick={onEdit} /> }
        </div>
        <div className="profile-info">
          <div>
            <img 
              className="profile-image"
              onClick={() => setModalOpen(true)}
              src={
                Object.values(currentProfile).length === 0
                  ? currentUser?.imageLink
                  : currentProfile?.imageLink
              }
              alt="profile-image"
            />
            <h3 className="userName">
              {Object.values(currentProfile).length === 0
                ? currentUser?.name
                : currentProfile?.name}
            </h3>
            <p className="heading">
              {Object.values(currentProfile).length === 0
                ? currentUser?.headline
                : currentProfile?.headline}
            </p>
            {(currentUser?.city || currentUser?.country) &&
            (currentProfile?.city || currentProfile?.country) ? (
              <p className="location">
                {Object.values(currentProfile).length === 0
                  ? `${currentUser?.city}, ${currentUser?.country} `
                  : `${currentProfile?.city}, ${currentUser.country}`}
              </p>
            ) : (
              <></>
            )}
            {currentUser?.website || currentProfile?.website ? (
              <a
                className="website"
                target="_blank"
                href={
                  Object.values(currentProfile).length === 0
                    ? `${currentUser?.website}`
                    : currentProfile?.website
                }
              >
                {Object.values(currentProfile).length === 0
                  ? `${currentUser?.website}`
                  : currentProfile?.website}
              </a>
            ) : (
              <></>
            )}
          </div>

          <div className="right-info">
            <p className="college">
              {Object.values(currentProfile).length === 0
                ? currentUser?.college
                : currentProfile?.college}
            </p>
            <p className="company">
              {Object.values(currentProfile).length === 0
                ? currentUser?.company
                : currentProfile?.company}
            </p>
          </div>
        </div>
        <p className="about-me">
          {Object.values(currentProfile).length === 0
            ? currentUser?.aboutMe
            : currentProfile?.aboutMe}
        </p>

        {currentUser?.skills || currentProfile?.skills ? (
          <p className="skills">
            <span className="skill-label">Skills</span>:&nbsp;
            {Object.values(currentProfile).length === 0
              ? currentUser?.skills
              : currentProfile?.skills}
          </p>
        ) : (
          <></>
        )}
      </div>

      <div className="post-status-main">
        {location?.state?.id ? (
          <>
            {singleStatus?.map((posts) => {
              return (
                <div key={posts.id}>
                  <PostsCard posts={posts} />
                </div>
              );
            })}
          </>
        ) : (
          <>
            {newStatus?.map((posts) => {
              return (
                <div key={posts.id}>
                  <PostsCard posts={posts} />
                </div>
              );
            })}
          </>
        )}
        {/* {newStatus?.map((posts) => {
              return (
                <div key={posts.id}>
                  <PostsCard posts={posts} />
                </div>
              );
            })} */}
      </div>
    </>
  );
}
