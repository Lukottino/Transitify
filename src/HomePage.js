import * as React from 'react';
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";

function HomePage() {

  let navigate = useNavigate(); 
  const routeChange = (path) =>{ 
    navigate(path);
  }

  return (
    <>
      <div style={{backgroundColor: "black", 
                  height:"100vh",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "left",
                  justifyContent: "left",
                  color: "white"}}>
          <div style={{justifyContent:"center", display:""}}>
              <img style={{objectFit:"cover", height:"100%", width:"100%", filter: "blur(10px)"}} src={require("./resources/trainstationwphomepage.jpg")}></img>
              <div style={{left:"50px", top:"200px", position:"absolute"}}>
                  <h1 style={{textShadow:"black 10px 10px 40px", fontWeight:"bold", fontSize:"80px", marginTop:"-2%"}}>Cos'è Transitify?</h1>
                  <h6 style={{textShadow:"black 2px 5px 20px", marginLeft:"10px", fontWeight:"400", width:"40%", fontSize:"20px"}}>Transitify è un sistema innovativo basato
                  su carta elettronica con cui puoi viaggiare su bus, treni, metro e tram.
                  Con questo sistema, puoi fare Check-in e Check-out direttamente nelle relative
                  stazioni/fermate, garantendo un viaggio più semplice da gestire.</h6>
                  <div style={{height: "200px",
                              display: "inline-block",
                              marginTop: "0",
                              width:"300px",
                              alignItems:"right",
                              justifyContent:"right",
                              marginLeft:"7px"}}>
                    <Button variant='outlined' onClick={() => routeChange("/login")} style={{color:"white", borderColor:"white", height:"100%px", borderRadius:"20px"}}>Login</Button>
                    <label style={{textShadow:"black 2px 5px 20px", fontWeight:"500", fontSize:"10px", paddingLeft:"5%"}}>O se non hai un account</label>
                    <a href='/register' style={{textDecoration:"none", textShadow:"black 2px 5px 20px", fontWeight:"500", fontSize:"10px"}}> Registrati</a>
                  </div>
              </div>
          </div>
      </div>
      <div style={{height: "200px", backgroundColor:"black", color:"white"}}>
        
      </div>
    </>
  );
}

export default HomePage;