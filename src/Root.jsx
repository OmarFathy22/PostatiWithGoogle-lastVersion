/* eslint-disable no-undef */
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import  { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import getDesignTokens from "./styles/MyTheme";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import VideoBackground from "./components/VideoBackground";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import ScrollToTop from "./components/ScrollToTop";
import { getDoc } from "firebase/firestore";

const Root = (props) => {
  const navigate = useNavigate();
  const [contentVisible, setContentVisible] = useState(false);
  const [user, setuser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
   
  const SignedIn = localStorage.getItem("SignedIn");
  useEffect(() => {
      if (SignedIn == "true") {
         if(Object.keys(user).length === 0)
         {
          navigate('/')
         }
        setContentVisible(true);
    }
  }, [user, navigate, SignedIn]);
  useEffect(() => {
    const handleGoogleApiLoad = () => {
      google.accounts.id.initialize({
        client_id:
          // "646245005567-1a33npebn0q9i0sbdnanqqotpr216gjc.apps.googleusercontent.com",
          "646245005567-l4hf2eq6k8rmkleau7lsqh12i3aglnou.apps.googleusercontent.com",
        callback: handleCallbackResponse,
      });
      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
    };
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = handleGoogleApiLoad;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCallbackResponse = async (response) => {
    const UserObject = jwtDecode(response.credential);
    localStorage.setItem("user", JSON.stringify(UserObject));
    setuser(UserObject);
    const { name } = JSON.parse(localStorage.getItem("user"));
    const { picture } = JSON.parse(localStorage.getItem("user"));
    const { sub } = JSON.parse(localStorage.getItem("user"));
    const SetData = async () => {
      await setDoc(doc(db, "AllUsers", sub), {
        name: name,
        picture: picture,
        uid: sub,
        notification: [],
      });
    };
    const docRef = doc(db, "AllUsers" , sub);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      SetData();
    }
    localStorage.setItem(
      "CurrUser",
      JSON.stringify({
        name: name,
        picture: picture,
        sub: sub,
      })
    );
    localStorage.setItem("SignedIn", "true");
      setTimeout(() => {
        location.reload()
      }, 700);
  };

  // const [mobileOpen, setMobileOpen] = React.useState(false);
  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };
  // const [showList, setshowList] = useState("none");
  const [mode, setmyMode] = useState(
    localStorage.getItem("currentMode") === null
      ? "dark"
      : localStorage.getItem("currentMode") === "light"
      ? "light"
      : "dark"
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {localStorage.getItem("SignedIn") === "false" && (
        <VideoBackground>
          <div id="signInDiv"></div>
        </VideoBackground>
      )}
      {contentVisible && (
        <Box>
          <ScrollToTop />
          {/* <Appbar
            showList={showList}
            setshowList={setshowList}
            handleDrawerToggle={handleDrawerToggle}
            theme={theme}
          /> */}
          <Outlet />
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Root;
