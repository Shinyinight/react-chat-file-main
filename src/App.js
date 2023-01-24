import "./App.css";
import React, { useState, useEffect } from "react";
import Personalized from "./Components/Personalized";
import MessageWrapper from "./Components/MessageWrapper";
import MessageInput from "./Components/MessageInput";
import Welcome from "./Components/Welcome";
import { sendMessageAPI, uuid } from "./Components/API";

function App() {
  const [data, setData] = useState({
    text: "",
    username: "",
    nameDevice: "",
    fullLocation: {
      ip: "",
      city: "",
      country_name: "",
      latitude: "",
      longitude: "",
    },
    // count the reaction
    love: 0,
    imageurl: "",
    timestamp: "",
  });

  // file to upload image before submit

  const { text, imageurl } = data;
  const [theme, setTheme] = useState("purple");
  const handleChange = (name, value) => {
    setData((data) => ({ ...data, [name]: value }));
  };
  // user location
  const getUserGeoLocation = () => {
    fetch("http://ip-api.com/json/")
      .then((response) => response.json())
      .then((data) => {
        handleChange("fullLocation", {
          ip: data?.query,
          city: data?.city,
          country_name: data?.country,
          latitude: data?.lat,
          longitude: data?.lon,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // this uniqid will work as user id to detect who is sending a message
  const getUniqId = () => {
    // before generation new id lets check on localStorage
    if (localStorage.getItem("name")) {
      handleChange("nameDevice", localStorage.getItem("name"));
    } else {
      const id = uuid();
      localStorage.setItem("name", id);
      handleChange("nameDevice", id || "NA");
      handleChange("username", id || "NA");
    }
  };

  // add location
  useEffect(() => {
    getUniqId();
    getUserGeoLocation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // for theme change
  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme"));
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").classList.add(theme);
    } else {
      localStorage.setItem("theme", `${theme}`);
    }
  }, [theme]);

  // submit me
  const send = async (e) => {
    e.preventDefault();
    if (text || imageurl) {
      try {
        let res = await sendMessageAPI(data);
        handleChange("text", "");
        handleChange("imageurl", "");
        if (res) {
        }
      } catch (e) {
        console.error("Error adding document: ", e);
        handleChange("text", "");
        handleChange("imageurl", "");
      }
    }
  };

  return (
    <div className="App">
      <div className="top--part">
        <section className="section__rule">
          <Personalized theme={(theme) => setTheme(theme)} askTheme={theme} />
          <MessageWrapper />
          <MessageInput
            send={send}
            text={text}
            handleChange={handleChange}
            imageurl={imageurl}
          />
        </section>
      </div>

      <Welcome />
    </div>
  );
}

export default App;
