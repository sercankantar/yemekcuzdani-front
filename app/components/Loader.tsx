'use client';

import Image from "next/image";
import { PuffLoader } from "react-spinners";

const Loader = () => {
  return ( 
    <div
      className="
        h-[70vh]
        flex 
        flex-col 
        justify-center 
        items-center 
        relative
      "
    >
      <div className="logo-container">
        <Image
          className="logo" 
          src="/images/mobil-logo.png" 
          height="50" 
          width="70"  
          alt="Logo" 
        />
      </div>
    </div>
  );
}
 
export default Loader;
