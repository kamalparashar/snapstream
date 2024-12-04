import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {Home as HomeComponent} from "../components/index"

function Home() {
    return (
      <div className='w-full py-8'>
        <HomeComponent/>
      </div>
    ) 
}

export default Home;
