'use client'

import Image from "next/image";
import { useState } from "react";

export default () => {
    

    const [imgUrl, setImgUrl] = useState('/preview1.jpg')
    function preview(event){

        setImgUrl(URL.createObjectURL(event.target.files[0]))
    }

  return (
    <>
      <label htmlFor="imgpost" className="block mb-2 text-sm">
        <Image src={imgUrl} alt="preview" width={500} height={250} />
      </label>
      <input
            id="imgpost"
            type="file"
            name="media"
            hidden
            onChange={preview}
      />
    </>
  );
};