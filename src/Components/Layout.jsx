import React from "react";
import TopMenu from "./TopMenu";
import SideBar from "./SideBar";
import Content from "./Content";
import Footer from "./Footer";

function Layout(){

    return(

    <div style = {{backgroundColor:"black"}}>
        <div style = {{backgroundColor:"red", textAlign:"center"}}>
        <TopMenu/>
        </div>
        <div style = {{backgroundColor:"green", width:"5cm", height: "9.44in", float:"left"}}>
        <SideBar/>
        </div>
        <div style = {{backgroundColor:"pink", width:"100%", height: "9in", textAlign:"center"}}>
        <Content/>
        </div>
        <div style = {{backgroundColor:"purple", height:"1in",textAlign:"center",width:"100%"}}>
        <Footer/>
        </div>
    </div>
    );
}

export default Layout;