import { useState, useEffect } from "react";

// import { createChatRoom } from "../../services/ChatService";
import Contact from "./Contact";
// import UserLayout from "../layouts/UserLayout";
// import { async } from "@firebase/util";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AllUsers({
  chatRooms,
  setCurrentChat,
  currentUser,
  changeChat,
  socket,
  currentSession
}) {
  const [selectedChat, setSelectedChat] = useState();
  const [matching , setMatching] = useState(false);
  const [hasRoom, setHasRoom] = useState(chatRooms.length > 0);

  useEffect(() => {
    const Ids = chatRooms.filter(chatRoom => !chatRoom.isEnd).map((chatRoom) => {
      return chatRoom.members.find((member) => member !== currentUser.uid);
    });
    if (Ids.length === 0) {
      setHasRoom(false);
    }
  }, [chatRooms, currentUser.uid]);

  /** recover session */
  /**
   * change current chatroom to unfinished one
   * frontend should recieve it right after refresh or reopen
   * Future: disable possible operation if recieved it
   */

  useEffect(() => {
    if (chatRooms.length == 0) {
      setHasRoom(false);
      setMatching(false);
    } else {
      setHasRoom(true);
    }
  }, [chatRooms])

  useEffect(() => {
    socket.current?.on("matchedUser", ({data, index}) => {
      // console.log("recieved matching");
      // console.log(`match: ${matching}`);
      console.log('matchedUser: recieved');

      if (matching) {
        // console.log(`socket ${socket.current.id} recieve data`);
        // console.log(`not back data: ${data}`);
        
        data.index = index;
        setCurrentChat(data);
        setHasRoom(true);
        setMatching(false);
      }
    });
  })

  const changeCurrentChat = (index, chat) => {
    setSelectedChat(index);
    changeChat(chat);
  };

  // this function will call the API for creating new chat room
  // const handleNewChatRoom = async (userId) => {
  //   const members = {
  //     senderId: currentUser.uid,
  //     receiverId: userId,
  //   };
  //   const res = await createChatRoom(members);
  //   setChatRooms((prev) => [...prev, res]);
  //   changeChat(res);
  // };



  //
  const handleMatchNewUser = async () => {
    // alert("//TODO: use api to match a new user")
    if (!matching && !hasRoom) {
      setMatching(true);
      socket.current.emit("matchUser", {
        userId: currentUser.uid,
      });
    }
  }

  return (
    <>
      <ul className="overflow-auto h-[30rem]">
        <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">Chats</h2>
        <li>
          {!hasRoom && (<button
            className="dark:text-white transition duration-150 ease-in-out cursor-pointer bg-white border-b border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center px-3 py-2 text-sm "
            onClick={handleMatchNewUser}>
            {matching === true ? ('matching') : ('match')}
          </button>)}
        </li>
        <li>
          {chatRooms.filter(chatRoom => !chatRoom.isEnd).map((chatRoom, index) => (
            <div
              key={index}
              className={classNames(
                index === selectedChat
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "transition duration-150 ease-in-out cursor-pointer bg-white border-b border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700",
                "flex items-center px-3 py-2 text-sm "
              )}
              onClick={() => changeCurrentChat(index, chatRoom)}
            >
              <Contact
                chatRoom={chatRoom}
                // onlineUsersId={onlineUsersId}
                currentUser={currentUser}
              />
            </div>
          ))}
        </li>
      </ul>
    </>
  );
}
