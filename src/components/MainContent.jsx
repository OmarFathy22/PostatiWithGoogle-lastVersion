/* eslint-disable react/prop-types */
// main
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  deleteDoc,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import  { useState } from "react";
import { doc } from "firebase/firestore";
import {
  Box,
} from "@mui/material";
import AddPostModal from "./postModal/AddPostModal";
import Post from "./Post";
import SekeletonCard from "./SekeletonCard";
const MainContent = ({ theme, showList , uid }) => {
  console.log(uid)
  console.log(typeof(uid))
  const [FEELING, setFEELING] = useState(null);
  const [value, loading] = useCollection(
    query(collection(db, uid), orderBy("id", "desc"))
  );
  
  const ID = new Date().getTime().toString();
  const n = 8;
  const deletePost = async (id) => {
    await deleteDoc(doc(db, JSON.parse(localStorage.getItem("user")).sub , id));
    await deleteDoc(doc(db, "AllPosts" , id));
  };

  const updatePost = async (id, checked, checked2) => {
    await updateDoc(doc(db,JSON.parse(localStorage.getItem("user")).sub, id), {
      liked: checked,
      bookmarked: checked2,
    });
    await updateDoc(doc(db,"AllPosts", id), {
      liked: checked,
      bookmarked: checked2,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          flexGrow: "1",
          pt: "100px",
          pl: { xs: "12px" },
          pr: { xs: "12px" },
          justifyContent: "center",
        }}
      >
        {[...Array(n)].map((e, i) => (
         <SekeletonCard key={i}/>
        ))}
      </Box>
    );
  }

  if (value) {
    return (
      <Box
      sx={{
        flexGrow: "1",
        pt: "100px",
        pl: { xs: "12px" },
        pr: { xs: "12px" },
        justifyContent: "center",
        backgroundColor:
          theme.palette.mode === "light" ? " rgb(248, 248, 248)" : null,
      }}
      >
        {value?.docs?.map((post , index) => {
        return(
          <Post key={index} theme={theme} showList={showList} ID={ID} deletePost={deletePost} updatePost={updatePost} value={value} loading={loading} post={post} uid = {uid}/>
        )
      })}
        <AddPostModal theme={theme} ID={ID} FEELING={FEELING} setFEELING={setFEELING} />
      </Box>
    )
    }      
};

export default MainContent;
