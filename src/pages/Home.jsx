 /* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  Stack,
  ThemeProvider,
} from "@mui/material";
import Appbar from "../components/Appbar";
import React, { useMemo, useState } from "react";
import { Outlet } from "react-router";
import getDesignTokens from "../styles/MyTheme";
import MainContent from "../components/MainContent";
import DRAWER from "../components/DRAWER";
import RightDrawer from "../components/RightDrawer";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import jwtDecode from "jwt-decode";
import VideoBackground from "../components/VideoBackground";
const Root = (props) => {
  const [user, setuser] = useState({});
  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "646245005567-5lqp8psc62h89093k15ilee8lrvdqrft.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
  }, []);
  useEffect(() => {
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, [user]);
  // useEffect(() => {
  //   google.accounts.id.prompt();
  //   console.log("prompt");
  // }, []);
  const handleCallbackResponse = async (response) => {
    const UserObject = jwtDecode(response.credential);
     localStorage.setItem("user", JSON.stringify(UserObject));
     localStorage.setItem("signedIn", true);
     setTimeout((params) => {
      setuser(UserObject);
     },[1000])
    await setDoc(doc(db, UserObject.sub , "UserData" ), {
      userName: UserObject.name,
      image : UserObject.picture,
      uid : UserObject.sub,
    });
     
    
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [showList, setshowList] = useState("none");
  const [mode, setmyMode] = useState(
    localStorage.getItem("currentMode") === null
      ? "dark"
      : localStorage.getItem("currentMode") === "light"
      ? "light"
      : "dark"
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const handleGoogle = async() => {
    const provider = await new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
    
  }
 

  



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {Object.keys(JSON.parse(localStorage.getItem("user"))).length === 0 && <VideoBackground><div id="signInDiv"><h1>Sign in with Google</h1></div></VideoBackground>}
      {Object.keys(JSON.parse(localStorage.getItem("user"))).length !== 0 && (  <Box>
        {/* Appbar is landing here */}
        <Appbar
          showList={showList}
          setshowList={setshowList}
          handleDrawerToggle={handleDrawerToggle}
        />
            <Stack
          direction="row"
        >
          <DRAWER
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
            props={props}
            theme={theme}
            mode={mode}
            setmyMode={setmyMode}
          />
          <MainContent theme={theme} showList={showList} uid={"AllPosts"}  />
          {/* <RightSection theme={theme} /> */}
          <RightDrawer theme={theme} />
        </Stack>
        {/* Main content is landing here */}
    
        <Outlet />
      </Box>)}
      
      {/* <Box sx={{display:"flex" , justifyContent:"center",  alignItems:"center" , height:"100vh" , border:"1px solid red"}}>
      <Button onClick={handleGoogle}>Sign with Google</Button>
      </Box> */}
    </ThemeProvider>
  );
};

export default Root;