import React, { useState, useEffect } from "react";
import "./messageinput.styled.scss";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
import ClearIcon from "@mui/icons-material/Clear";
import { ImageUploadAPI, deleteImageAPI } from "./API";
import Skeleton from "@mui/material/Skeleton";

/**
 *
 * @param {send is a  submit function} param0
 * @param {text is a value of text} param1
 * @param {imageurl is a  link to the image} param2
 * @param {handleChange is a function that update the change in text} param3
 * @returns
 */

const MessageInput = ({ send, text, handleChange, imageurl }) => {
  const [loader, setLoader] = useState(false);
  const [imgObj, setImgObj] = useState({
    publicId: "",
    signature: "",
    time: "",
  });

  const ImageUpload = (event, fileSource) => {
    setLoader(true);

    const file = event ? event.target.files[0] : fileSource;
    if (file.size / (1024 * 1024) > 5) {
      alert("you can only upload images under 5MB");
    } else {
      ImageUploadAPI(file)
        .then((resp) => {
          if (resp) {
            handleChange("imageurl", resp?.url);
            // console.log("resp", resp);
            setImgObj({
              ...imgObj,
              publicId: resp.public_id,
              signature: resp.signature,
              time: new Date(resp.created_at).valueOf(),
            });
          }
          setLoader(false);
        })
        .catch(() => {
          alert("Error in uploading Image");
          setLoader(false);
        });
    }
  };

  const ImageDelete = () => {
    if (imageurl) {
      handleChange("imageurl", "");
      deleteImageAPI(imgObj)
        .then((resp) => {
          if (resp) {
            // console.log("resp deleteImageAPI", resp);
            setImgObj({ ...imgObj, publicId: "", signature: "", time: "" });
          }
        })
        .catch(() => {
          alert("Error in uploading Image");
          setImgObj({ ...imgObj, publicId: "", signature: "", time: "" });
        });
    }
  };

  // useEffect
  useEffect(() => {
    document.onpaste = function (event) {
      const item = (event.clipboardData || event.originalEvent.clipboardData)
        .items[0];
      // console.log("item", item);

      if (item.type.indexOf("image") !== -1) {
        let file = item.getAsFile();
        ImageUpload(0, file);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form method="" action="#!" onSubmit={send} className="messageInput">
      <div className="form-group">
        {loader ? (
          <div className="imput--img">
            <Skeleton
              variant="rectangular"
              width={60}
              height={60}
              animation="wave"
            />
          </div>
        ) : (
          imageurl && (
            <div className="imput--img">
              <img src={imageurl} alt="loading" />
              <span className="cross" onClick={ImageDelete}>
                <ClearIcon />
              </span>
            </div>
          )
        )}

        <input
          className="form-control"
          placeholder="write your message"
          value={text}
          onChange={(event) => handleChange("text", event.target.value)}
          required={imageurl ? false : true}
          autoFocus
          title="You cannot send empty message"

          // autoComplete={text.toString()}
        />
        <label
          className="upimageLabel"
          htmlFor="upimage"
          title={loader ? "your image is uploading" : "upload your image"}
        >
          <PhotoRoundedIcon />
        </label>
        <button type="submit" title="send">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48.251"
            height="48.251"
            viewBox="0 0 48.251 48.251"
          >
            <path
              id="Path_2"
              data-name="Path 2"
              d="M34.338,2.4a1.246,1.246,0,0,1,.257,1.388L20.5,35.5a1.246,1.246,0,0,1-2.285-.017L13.131,23.607,1.254,18.519a1.246,1.246,0,0,1-.015-2.282L32.95,2.143a1.246,1.246,0,0,1,1.385.257Z"
              transform="translate(23.397 -1.865) rotate(41)"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <input
        type="file"
        id="upimage"
        accept="image/*"
        onChange={ImageUpload}
        name="imageurl"
        disabled={loader}
        hidden
      />
    </form>
  );
};

export default MessageInput;
