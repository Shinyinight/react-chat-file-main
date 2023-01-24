import axios from "axios";
import db from "../Firebase/Firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

export const sendMessageAPI = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { id } = await addDoc(collection(db, "chat12"), {
        ...data,
        timestamp: serverTimestamp(),
      });
      resolve(id);

      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      reject(e);
      // handleChange("text", "");
    }
  });
};

// update message
export const updateMessageAPI = async (id, love) => {
  const messageRef = doc(db, "chat12", id);

  return new Promise(async (resolve, reject) => {
    try {
      let resp = await updateDoc(messageRef, { love: love });
      resolve(resp);
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      reject(e);
      // handleChange("text", "");
    }
  });
};

// image related api
export const ImageUploadAPI = async (image) => {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", process.env.REACT_APP_PRESET_NAME);
  data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
  data.append("folder", "chat");

  try {
    const resp = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      data
    );
    // setimageData({url: resp.data.url, public_id: resp.data.public_id});
    // console.log("resp", resp);
    return resp?.data;
    // handleChange("imageurl", resp.data.url);
  } catch (err) {
    // console.log("errr : ", err);
    // handleChange("imageurl", "");
    alert("Error in uploading  image ");
    return err;
  }
};

export const deleteImageAPI = async ({ publicId, signature, time }) => {
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("api_key", process.env.REACT_APP_CLOUD_API_KEY);
  formData.append("timestamp", time);
  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/destroy`,
      formData
    );
    return res?.data;
  } catch (err) {
    return err;
  }
};

export const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
