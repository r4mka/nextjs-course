"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import classes from "./image-picker.module.css";

export default function ImagePicker({ label, name }) {
  const imageInput = useRef();
  const [image, setImage] = useState();

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        setImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  }

  function handlePickClick() {
    imageInput.current.click();
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {image ? (
            <Image src={image} alt="Preview" fill />
          ) : (
            <p>No image picked yet.</p>
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
