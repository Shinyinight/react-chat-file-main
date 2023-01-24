import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import ReactBnbGallery from "react-bnb-gallery";
import { updateMessageAPI } from "./API";

const Messages = (props) => {
  // console.log(props);
  const {
    name,
    username,
    text,
    timestamp,
    index,
    nameDevice,
    imageurl,
    id,
    love = 0,
  } = props;
  const isUser =
    username === name || nameDevice === localStorage.getItem("name");
  const [timeNow, settimeNow] = useState(null);
  const [textArray, setTextArray] = useState([]);
  const [islLnk, setIslLnk] = useState(false);

  // loved by user or not
  const [isloved, setLoved] = useState(false);

  // image popup
  const [showBox, setshowBox] = useState(false);

  const onImageError = (e) => {
    let elem = e.target;
    elem.setAttribute("alt", "This image has been removed");
    elem.parentNode.classList.add("error");
  };

  function clearSelection() {
    if (document.selection && document.selection.empty) {
      document.selection.empty();
    } else if (window.getSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
    }
  }

  // liking the message box
  const onDoubleClick = async (e, id) => {
    e.preventDefault();
    clearSelection();
    // !isloved
    if (!isloved) {
      // like the mesage
      e.currentTarget.closest(".chatbox-wrapper").classList.add("liked");
      setLoved(true);
      await updateMessageAPI(id, love + 1);
      EditLocalStorage(id);
    }
  };

  const EditLocalStorage = (id) => {
    let userLiked = localStorage.getItem("userLiked");
    let tempArray;

    if (userLiked) {
      tempArray = [
        ...new Set([id, ...JSON.parse(localStorage.getItem("userLiked"))]),
      ];
    } else {
      tempArray = [id];
    }

    // console.log("tempArray", tempArray);
    tempArray = JSON.stringify(tempArray);
    localStorage.setItem("userLiked", tempArray);
  };

  // for loved check
  const lovedCheck = (id) => {
    let userLiked = localStorage.getItem("userLiked");
    if (userLiked) {
      let userLikedParse = JSON.parse(userLiked);
      if (userLikedParse.includes(id)) {
        setLoved(true);
      }
    }
  };

  // convert time into readable formate
  useEffect(() => {
    if (timestamp?.seconds) {
      let timetemp = new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
      });
      settimeNow(timetemp);
    }
  }, [timestamp]);

  // this will check for the text and link
  useEffect(() => {
    let regx = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    let link = text.match(regx);
    // console.log(link);
    if (link) {
      setIslLnk(true);
      let temp = text.split(link[0]);
      temp.splice(1, 0, link[0]);
      // console.log("temp", temp);
      setTextArray(temp);
    }
  }, [text]);

  // just calling loved checkfunction on refresh
  useEffect(() => {
    lovedCheck(id);
  }, [id]);

  return (
    <>
      <div
        className={
          (isUser ? "active chatbox-wrapper" : "unknown chatbox-wrapper") +
          " " +
          (isloved ? " liked " : " ")
        }
        key={index}
        id={id}
      >
        <div
          className="chatbox-wrapper-inner"
          onDoubleClick={(e) => onDoubleClick(e, id)}
          title={"double click to live the message"}
        >
          {imageurl && (
            <>
              <div className="image--wrapper" onClick={() => setshowBox(true)}>
                <img
                  src={imageurl.replace("/upload/", "/upload/c_thumb,w_200/")}
                  alt="chat anonyymously"
                  onError={onImageError}
                />
              </div>
              <ReactBnbGallery
                show={showBox}
                photos={imageurl}
                showThumbnails={false}
                onClose={() => setshowBox(false)}
              />
            </>
          )}

          {text && (
            <h2>
              {islLnk
                ? textArray.map((text, index) => {
                    if (index === 1) {
                      return (
                        <a
                          href={text}
                          target="_blank"
                          rel="noreferrer"
                          key={index}
                          className="link"
                        >
                          {text}
                        </a>
                      );
                    } else {
                      return <span key={index}>{text}</span>;
                    }
                  })
                : text}
            </h2>
          )}
          {love > 0 && (
            <div
              className="love noselect"
              onClick={(e) => onDoubleClick(e, id)}
              title={
                isloved
                  ? "I cannot belive you liked this"
                  : "Once you love someone, you cannot go back"
              }
            >
              <span>💖</span>
              <span className="numb">{love}</span>
            </div>
          )}
        </div>
        <Tooltip
          title={
            timestamp?.seconds
              ? new Date(timestamp.seconds * 1000).toLocaleString()
              : "NA"
          }
          placement="top"
          arrow
          className={"tooltip"}
        >
          <time>{timeNow || ".."}</time>
        </Tooltip>
      </div>
    </>
  );
};

export default Messages;
