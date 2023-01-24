import React, { useState, useEffect, useRef, useMemo } from "react";
import "./message.style.scss";

import Messages from "./Messages";
import Skeleton from "@mui/material/Skeleton";

import db from "./Firebase/Firebase";
import { useInView } from "react-intersection-observer";
import "react-bnb-gallery/dist/style.css";

import {
  collection,
  query,
  orderBy,
  getDocs,
  limitToLast,
  onSnapshot,
  // endBefore,
} from "firebase/firestore";

const MessageWrapper = () => {
  // for scrolled up image
  const [messageAdded, setAddedMessage] = useState([]);

  // combining message and messageAdded
  const totalMessage = useMemo(() => [...messageAdded], [messageAdded]);

  // to know how many total message in the data base
  const [countMessage, setCountMessage] = useState(0);

  // scroll effect  on infinite scroll
  const [isScrollTop, setIsScrollTop] = useState(false);

  const [pageSize, setPageSize] = useState(0);

  // firebase Ref
  const dataRef = collection(db, "chat12");

  // last visible item
  // eslint-disable-next-line no-unused-vars
  const [lastVisible, setLastVisible] = useState(null);

  // unsub function
  const [unsunbFunct, setunsunbFunct] = useState(() => {});

  // state data for starting 20 data
  useEffect(() => {
    const firstQuery = query(
      dataRef,
      orderBy("timestamp", "asc"),
      limitToLast(pageSize * 20 + 20)
    );
    if (pageSize > 0) {
      unsunbFunct();
    }

    const fetchData = async () => {
      // for snapshot
      const unsub = onSnapshot(firstQuery, (querySnapshot) => {
        const initData = [];
        querySnapshot.forEach((doc) => {
          initData.push({ id: doc.id, data: doc.data() });
        });
        setAddedMessage(initData);
      });
      setunsunbFunct(() => unsub);

      const docSnap2 = await getDocs(firstQuery);

      // to last visible item
      setLastVisible(docSnap2.docs[0]);
    };

    // for total data on snapshot
    const countTotal = async () => {
      onSnapshot(dataRef, (querySnapshot) => {
        setCountMessage(querySnapshot.size);
      });
    };

    fetchData();
    countTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  // added data when scrolling is update
  useEffect(() => {
    if (pageSize > 0) {
      // console.log("pageSize", lastVisible.data().text);
      // const nextQuery = query(
      //   dataRef,
      //   orderBy("timestamp", "asc"),
      //   endBefore(lastVisible),
      //   limitToLast(20)
      // );
      // const fetchData = async () => {
      //   const querySnapshot = await getDocs(nextQuery);
      //   const addedData = [];
      //   setLastVisible(querySnapshot.docs[0]);
      //   querySnapshot.forEach((doc) => {
      //     addedData.push({ id: doc.id, data: doc.data() });
      //   });
      //   // console.log("add", addedData);
      //   setAddedMessage((messageAdded) => [
      //     ...new Set([...addedData, ...messageAdded]),
      //   ]);

      //   // if (querySnapshot.size > 0) {

      //   // }
      // };
      // fetchData();
      setIsScrollTop(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  useEffect(() => {
    // console.log("scrollTop");
    if (isScrollTop) {
      scrollToTop();
      setIsScrollTop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageAdded]);

  useEffect(() => {
    // no question on message added
    scrollToBottom();
  }, [countMessage]);

  const chatRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef?.current?.scrollIntoView({ behavior: "auto" });
    }
  };

  const scrollToTop = () => {
    // console.log("scrollToTop", chatRef?.current?.children[19]);
    if (chatRef?.current?.children[19])
      chatRef?.current?.children[19]?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
  };

  const messagesEndRef = useRef(null);

  // detect the view of loader
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 1,
  });

  useEffect(() => {
    if (inView) {
      setPageSize((pageSize) => pageSize + 1);
    }
  }, [inView]);

  return (
    <div className="chat--wrapper">
      {totalMessage.length > 0 ? (
        <>
          {countMessage > pageSize * 20 + 20 && (
            <Skeleton
              variant="text"
              height={130}
              width={"30%"}
              style={{
                minWidth: "200px",
                borderRadius: "var(--br)",
                boxShadow: "-6px 9px var(--dark)",
              }}
              ref={ref}
            />
          )}
          <div ref={chatRef}>
            {totalMessage.map(({ id, data }) => (
              <Messages key={id} {...data} id={id} />
            ))}
          </div>
        </>
      ) : (
        <div>
          <Skeleton
            variant="text"
            height={130}
            width={"30%"}
            style={{
              minWidth: "200px",
              borderRadius: "var(--br)",
              boxShadow: "-6px 9px var(--dark)",
            }}
          />
          <br />
          <Skeleton
            variant="text"
            height={130}
            width={"20%"}
            style={{
              minWidth: "150px",
              borderRadius: "var(--br)",
              boxShadow: "-6px 9px var(--dark)",
            }}
          />
          <br />
          <Skeleton
            variant="text"
            height={130}
            width={"30%"}
            style={{
              minWidth: "200px",
              borderRadius: "var(--br)",
              boxShadow: "-6px 9px var(--dark)",
            }}
          />
          <br />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageWrapper;
