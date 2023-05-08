import { firestore } from "../firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { toast } from "react-toastify";

let postsRef = collection(firestore, "posts");
let userRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");
let commentsRef = collection(firestore, "comments");
let connectionRef = collection(firestore, "connections");

let dbRef = collection(firestore, "posts");
export const postStatus = (status) => {
  let object = {
    status: status,
  };
  addDoc(dbRef, object)
   .then((res) => {
    console.log("Document has been added successfully");
   })
   .catch((err) => {
    console.log(err);
   });
};

// export const postStatus = (object) => {
//   addDoc(postsRef, object)
//     .then(() => {
//       toast.success("Post has been added successfully");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

export const getPosts = () => {
  onSnapshot(dbRef,(response) => {
    console.log("index in firesore" , response.docs.map((docs) => {
      return{...docs.data() };
    })); 
  });
};
getPosts();
export const getStatus = (setAllStatus) => {
  const q = query(postsRef, orderBy("timeStamp"));
  onSnapshot(dbRef, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getAllUsers = (setAllUsers) => {
  
  onSnapshot(userRef, (response) => {
    setAllUsers(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};


// export const getSingleStatus = (setAllStatus, id) => {
//   const singlePostQuery = query(postsRef, where("userID", "==", id));
//   onSnapshot(singlePostQuery, (response) => {
//     console.log(
//       response.docs.map((docs) => {
//         return { ...docs.data(), id: docs.id };
//       })
//     );
//   });
// };

export const getSingleStatus = (setAllStatus, id) => {
  console.log(id);
  const singlePostQuery = query(postsRef, where("userID", "==", id));
  onSnapshot(postsRef, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id }; 
      })
    );
  });
};

export const getSingleUser = (setCurrentUser, email) => {
  console.log(userRef)
  const singleUserQuery = query(userRef, where("email", "==", email));
  onSnapshot(singleUserQuery, (response) => {
    setCurrentUser(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })[0]
    );
  });
};

export const postUserData = (object) => {
  addDoc(userRef, object)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

export const getCurrentUser = (setCurrentUser) => {
  let currEmail = localStorage.getItem("userEmail");
  onSnapshot(userRef, (response) => {
    console.log("FireStore" , response.docs);
    setCurrentUser(
      response.docs
        .map((docs) => {
          return { ...docs.data(), userID: docs.id };
        })
        .filter((item) => {
          return item.email === currEmail;
        })[0]
    );
  });
};

export const editProfile = (userID, payload) => {
  console.log(userID)
  let userToEdit = doc(userRef, userID);
  console.log(userToEdit)

  updateDoc(userToEdit, payload)
    .then(() => {
      toast.success("Profile has been updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const likePost = (userId, postId, liked) => {
  try {
    let docToLike = doc(likeRef, `${userId}_${postId}`);
    if (liked) {
      deleteDoc(docToLike);
    } else {
      setDoc(docToLike, { userId, postId });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getLikesByUser = (userId, postId, setLiked, setLikesCount) => {
  try {
    let likeQuery = query(likeRef, where("postId", "==", postId));

    onSnapshot(likeQuery, (response) => {
      let likes = response.docs.map((doc) => doc.data());
      let likesCount = likes?.length;

      const isLiked = likes.some((like) => like.userId === userId);

      setLikesCount(likesCount);
      setLiked(isLiked);
    });
  } catch (err) {
    console.log(err);
  }
};

export const postComment = (postId, comment, timeStamp, name) => {
  try {
    addDoc(commentsRef, {
      postId,
      comment,
      timeStamp, 
      name,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getComments = (postId, setComments) => {
  try {
    let singlePostQuery = query(commentsRef, where("postId", "==", postId));

    onSnapshot(singlePostQuery, (response) => {
      const comments = response.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

     setComments(comments);
    });
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = (id, status, postImage) => {
  console.log(status);
  console.log(postImage);
  console.log(postsRef);
  console.log(id);
  let docToUpdate = doc(postsRef,  "895546");
  console.log("line 219", docToUpdate);
  try {
     updateDoc(docToUpdate, { status, postImage });
    toast.success("Post has been updated!");
    
    } catch (err) {
    console.log(err);
  }
};

export const deletePost = (id) => {
  let docToDelete = doc(postsRef, id);
  try {
    deleteDoc(docToDelete);
    toast.success("Post has been Deleted!");
  } catch (err) {
    console.log(err);
  }
};

export const addConnection = (userId, targetId) => {
  try {
    let connectionToAdd = doc(connectionRef, `${userId}_${targetId}`);

    setDoc(connectionToAdd, { userId, targetId });

    toast.success("Connection Added!");
  } catch (err) {
    console.log(err);
  }
};

export const getConnections = (userId, targetId, setIsConnected) => {
  console.log(targetId);
  try {
    let connectionsQuery = query(
      connectionRef,
      where("targetId", "==", targetId)
    );

    onSnapshot(connectionsQuery, (response) => {
      let connections = response.docs.map((doc) => doc.data());

      const isConnected = connections.some(
        (connection) => connection.userId === userId
      );

      setIsConnected(isConnected);
    });
  } catch (err) {
    console.log(err);
  }
};
