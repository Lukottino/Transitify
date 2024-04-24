import * as React from 'react';
import Button from '@mui/material/Button'
import logo from './logo.svg';

function HomePage() {
  return (
    <div style={{backgroundColor: "#282c34", 
                height:"100vh",
                display: "flex",
                flexDirection: "row",
                alignItems: "left",
                justifyContent: "left",
                color: "white"}}>
        <div style={{justifyContent:"center", display:""}}>
            <img style={{objectFit:"cover", height:"100%", width:"300%", filter: "blur(10px)"}} src={require("./resources/trainstationwphome.jpeg")}></img>
            <div style={{left:"50px", top:"200px", position:"absolute"}}>
                <h1 style={{textShadow:"black 10px 10px 40px", fontWeight:"bold", fontSize:"80px"}}>Cos'è Transitify?</h1>
                <h6 style={{textShadow:"black 2px 5px 20px", marginTop:"-30px", marginLeft:"10px", fontWeight:"400", width:"40%", fontSize:"20px"}}>Transitify è un sistema innovativo basato
                su carta elettronica con cui puoi viaggiare su bus, treni, metro e tram.
                Con questo sistema, puoi fare Check-in e Check-out direttamente nelle relative
                stazioni/fermate, garantendo un viaggio più semplice da gestire.</h6>
                <input type='button'></input>
                
            </div>
        </div>
    </div>
  );
}

export default HomePage;