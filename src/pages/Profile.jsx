import { Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import getDesignTokens from "../styles/MyTheme";
import MainContent from "../components/MainContent";
function Profile() {
  console.log("Profile Page")
  const [showList, setshowList] = useState("none");
  const [mode, setmyMode] = useState(
    localStorage.getItem("currentMode") === null
      ? "dark"
      : localStorage.getItem("currentMode") === "light"
      ? "light"
      : "dark"
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);


  return (
    <div>
        <div style={{height:"100px" ,backgroundImage: "linear-gradient(to right, #434343 0%, black 100%)",position:"relative"}}>
           <img src={JSON.parse(localStorage.getItem("user")).picture} alt="Profile Image"
            style={{width:"150px",height:"150px",borderRadius:"50%"
          
          ,position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-15%)",
          borderRight: "4px solid cyan",
          borderLeft: "4px solid cyan",
          borderBottom: "4px solid cyan",
          borderTop: "4px solid cyan"}}
           />
        </div>
        <h1 style={{textAlign:"center" , paddingTop:"90px" ,  backgroundColor:
          theme.palette.mode === "light" ? " rgb(248, 248, 248)" : null}}>{JSON.parse(localStorage.getItem("user")).name}</h1>
        
          <MainContent theme={theme} showList={showList} uid={JSON.parse(localStorage.getItem("user")).sub} />

    </div>

  )
}

export default Profile;