import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { useSocket } from "../../../../Socket/Socket";
import {
  fetchChatMessages,
  fetchTutorChatMessages,
} from "../../../../Utils/config/axios.GetMethods";
import { toast } from "sonner";
import { getUserMessages, sendMessageFrom } from "../../../../Utils/config/axios.PostMethods";
import axios from "axios";
import { ChatState } from "../../../../Slices/chatSlice/chatSlice";
import { MessageState } from "../../../../Slices/messageSlice/messageSlice";
import { format } from "date-fns";
import EmojiPicker from "emoji-picker-react";

interface Message {
  _id: string;
  message: string;
  senderId: string;
  media?: {
    url: string;
    type: "image" | "video";
  };
  createdAt: string;
}

interface User {
  studentId: any;
  createdAt: string | number | Date;
  _id: any;
  studentname: string;
  studentemail: string;
  phone: string;
  userId: string;
  photo: any;
  courseId: any;
  amount: string;
}

interface Chat {
  _id: string;
  participants: { userId: User, tutorId: string }[];
  messages: string[]; 
  lastMessage: string; 
  updatedAt: string;
  createdAt: string;
}

function Chat() {
  const chat = useSelector((state: ChatState) => state?.chat?.selectedchat);
  const message = useSelector(
    (state: MessageState) => state?.message?.selectedmessage
  );
  const Navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<User[]>([]); 
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // to show name on the message heading
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [sendMessage, setSendMessage] = useState<boolean>(false);
  const [currentUsers, setCurrentUsers] = useState<any>([]);
  const [input, setInput] = useState("");
  const [searchError, setSearchError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [chatData, setChatData] = useState<Chat[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sortedChats, setSortedChats] = useState<Chat[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState("");
  const { tutor } = useSelector((state: any) => state.tutor);
  const tutorId = tutor._id;
  const { chatId } = useParams();
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (socket) {
      console.log("I AM SOCKET");

      socket.emit("addUser", tutorId);
      socket.on("getUsers", (users: any) => {
        console.log("active >>", users);
        setCurrentUsers(users);
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("TRIGRED");

    if (socket) {
      socket.on("receiveMessage", (data: any) => {
        setMessageData((prevMessages: any) => {
          const setNewMessage = [...prevMessages, data.data];
          return setNewMessage;
        });
        setInput("");
      });
    }
  }, [socket]);

  useEffect(() => {
    if (chatId === "index") return;
    const fetchChat = async () => {
      try {
        const response = await fetchTutorChatMessages(chatId);
        if (response && response.data.status) {
          setMessageData(response.data?.data);
        }
      } catch (error) {
        toast.error("Error fetching messages");
      }
    };
    fetchChat();
  }, [chatId]);


  useEffect(() => {
    const sorted = chatData.sort((a, b) => {
      const lastMsgATime = new Date(a.updatedAt).getTime();
      const lastMsgBTime = new Date(b.updatedAt).getTime();
      return lastMsgBTime - lastMsgATime;
    });
  
    setSortedChats(sorted);
  }, [chatData]);

  useEffect(() => {
    (async () => {
      const data = {
        tutorId,
      };
      const response = await getUserMessages(data)
      if (response.data.status) {
        setChatData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    })();
  }, [tutorId,messageData]);

  


  const handleUserClick = (chat: Chat) => {
    const user = chat.participants[0].userId;
    console.log(user, "))))))))))))))))))))))))))))))))))");
    setSelectedUser(user);
    console.log("Setiing sellll", chat);
    Navigate(`/tutor/chat-box/${chat._id}`);
    const chatExists = sortedChats.some(sortedChat => sortedChat._id === chat._id);
    if (!chatExists) {
      setSortedChats([...sortedChats, chat]);
    }
  };

  const uploadToCloudinary = async (file:any) => {
    console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cloud_name", "dwqo8zxbz");
    formData.append("api_key", "229385179296817");
    formData.append("api_secret", "ijzMLse_4SylKD_y140RvoEUJrk");
    formData.append("folder", "Profile");
    formData.append('upload_preset', 'l2gj1ucv');
    const uploadURL = file.type.startsWith("image")? "/v1_1/dwqo8zxbz/image/upload" : "/v1_1/dwqo8zxbz/video/upload";
  console.log(uploadURL,'Uploadd url');
  
    try {
      const response = await axios.post(`https://api.cloudinary.com${uploadURL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
        console.log(response,'THIS OS RESPOCE');
        const data = response.data;
        console.log("Cloudinary response:", data);
        const {secure_url}=data
        return secure_url;
     
     
      
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      throw error;
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (socket) {
      
      
      let mediaUrl:any = "";
      let mediaType = "";
  
      if (selectedFile) {
        try {
          mediaUrl = await uploadToCloudinary(selectedFile);
          mediaType = selectedFile.type.startsWith("image") ? "image" : "video";
          setSelectedFile(null); 
        } catch (error) {
          console.error("Failed to upload media to Cloudinary:", error);
          toast.error("Failed to upload media.");
          return;
        }
      }
      const userId = chatData[0]?.participants[0]?.userId._id;
      socket.emit("sendMessage", {
        conversationId: chatId,
        senderId: tutorId,
        receiverId: userId,
        message: input,
        media: { url: mediaUrl, type: mediaType },
      });

      toast.success("message sedn ")

    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  

  const isValidAlphabetic = (value: string) => {
    return /^([a-zA-Z]+( [a-zA-Z]+)*)*$/.test(value);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.toLowerCase();
    if (!isValidAlphabetic(inputValue)) {
      setSearchError("The provided value to search should be in Alphabetic");
      setSearch("");
    } else {
      setSearchError("");
      setSearch(inputValue);
    }
  };


  const onEmojiClick = (emojiObject: any) => {
    const emoji = emojiObject.emoji;
    setInput((prevInput) => prevInput + emoji);
    setShowEmojiPicker(false);
  };




  return (
    <div className="flex h-screen overflow-hidden bg-blue-gray-500  ">
      {/* SIDE BAR */}
      <div className="w-1/4 border-r border-gray-300 b bg-sky-700  ">
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-teal-600 text-white">
          <div className="max-w-2xl mx-auto">
            <form className="flex items-center">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full ">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-950 focus:border-cyan-950 block w-full pl-10 p-2.5"
                  placeholder="Search"
                  required
                  onChange={(e) => handleSearch(e)}
                  value={search}
                />
              </div>
              <button
                type="submit"
                className="p-2.5 ml-2 text-sm font-medium text-white bg-sky-950 rounded-lg border border-cyan-950 hover:bg-cyan-950 focus:ring-4 focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </header>

        <div className="overflow-hidden h-screen p-3 mb-9 pb-20">
          {sortedChats.length > 0 && (
            <>
              {sortedChats?.map((chat: any) => {
                const lastMessage = chat.lastMessage
             
                
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => handleUserClick(chat)}
                    className="flex items-center mb-4 cursor-pointer hover:bg-cyan-700 p-2 rounded-md"
                  >
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                      {chat.participants[0].userId.photo ? (
                        <img
                          src={chat.participants[0].userId.photo}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <img
                          src={
                            "https://res.cloudinary.com/dwqo8zxbz/image/upload/v1715588450/Profile/3d_female_character_reading_book_23_2148938892_jpg.jpg"
                          }
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center">
  <div className="flex-1">
    <h2 className="text-l text-white font-semibold">
      {chat.participants[0].userId.studentname}
    </h2>
    <small className="text-white">{lastMessage}</small>
  </div>
  <small className="text-white mt-2 sm:mt-0 sm:ml-5">{format(new Date(chat.updatedAt), "p")}</small>
</div>

                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* MESSAGE SECTION */}
      <div className="w-3/4 flex flex-col">
        {/* HEADER */}
        <header className="p-4 border-b border-gray-300 flex items-center bg-indigo-300 text-white">
  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
    {selectedUser && selectedUser.photo && (
      <img
        src={selectedUser.photo}
        alt={`${selectedUser.studentname}'s Avatar`}
        className="w-12 h-12 rounded-full"
      />
    )}
  </div>
  <h2 className="text-lg font-semibold">
    {selectedUser ? selectedUser.studentname : "No user selected"}
  </h2>
</header>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
        {messageData.length > 0 && (
          <>
            {messageData.map((message, index) => {
               {console.log(message,'MM')
               }
              const isSender = message.senderId === tutorId;
              return (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-md ${
                      isSender ? "bg-gray-500 text-white" : "bg-sky-600 text-white"
                    }`}
                  >
                    {message.media && (
                      <>
                     
                        {message.media.type === "image" && (
                          <img src={message.media.url} alt="Message Media" />
                        )}
                        {message.media.type === "video" && (
                          <video controls src={message.media.url}></video>
                        )}
                      </>
                    )}
                    <p>{message.message}</p>
                    <small className="text-xs text-white">
                      {format(new Date(message.createdAt), "PPP p")}
                    </small>
                  </div>
                </div>
              );
            })}
            {/* <div ref={messagesEndRef}></div> */}
          </>
        )}
      </div>

        {/* FOOTER */}
        <footer className="p-4 border-t border-gray-300 ">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg p-2 mr-2"
              placeholder="Type your message..."
              required
            />

{showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}

{chosenEmoji && <span>{chosenEmoji}</span>}

            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                style={{ width: "100px", height: "auto" }}
              />
            )}

            <div>
              <button
                type="button"
                className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <button
              type="button"
              className="flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointe mr-4 ml-2"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="currentColor"
                className="bi bi-emoji-smile"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
              </svg>
            </button>

            <button
              type="submit"
              className="bg-sky-600 text-white p-2 rounded-lg"
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default Chat;
