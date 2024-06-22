import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { ChatState } from "../../../Slices/chatSlice/chatSlice";
import { MessageState } from "../../../Slices/messageSlice/messageSlice";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { io } from "socket.io-client";
import { axiosInstance } from "../../../Utils/config/axios.config";
import {
  fetchChatMessages,
  getTutor,
} from "../../../Utils/config/axios.GetMethods";
import { sendMessageFrom } from "../../../Utils/config/axios.PostMethods";
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
  studentId: string;
  createdAt: string;
  _id: string;
  studentname: string;
  studentemail: string;
  phone: string;
  userId: string;
  photo: string;
  courseId: string;
  amount: string;
}

interface Tutor {
  _id: string;
  tutorname: string;
  tutoremail: string;
  phone: string;
  password: string;
  isBlocked: boolean;
  photo: string;
}

function StudentChat() {
  const [messages, setMessages] = useState("");
  const { student } = useSelector((state: any) => state.student);
  const myId = student._id;

  const chat = useSelector((state: ChatState) => state?.chat?.selectedchat);
  const message = useSelector(
    (state: MessageState) => state?.message?.selectedmessage
  );
  const [tutorDetails, setTutorDetails] = useState<Tutor | null>(null);
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [currentUsers, setCurentUsers] = useState<any>(null);
  const [input, setInput] = useState("");
  const { tutorId, chatId } = useParams<{ tutorId: string; chatId: string }>();
  const [socket, setSocket] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("inside the socket");

      socket.emit("addUser", myId);

      socket.on("getUsers", (users: any) => {
        toast.success("Received a message");
        setCurentUsers(users);
      });
    }
  }, [socket, myId]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (data: any) => {
        setMessageData((prevMessages) => [...prevMessages, data.data]);
        setInput("");
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await getTutor(tutorId);
        if (response && response.data) {
          setTutorDetails(response.data.tutorDetails);
        } else {
          toast.error("No tutor found");
        }
      } catch (error) {
        toast.error("Error fetching data");
      }
    };
    fetchTutor();
  }, [tutorId]);

  useEffect(() => {
    if (!myId) return;
    const fetchChat = async () => {
      try {
        const response = await fetchChatMessages(chatId);
        if (response && response.data.status) {
          setMessageData(response.data?.data);
        }
      } catch (error) {
        toast.error("Error fetching messages");
      }
    };
    fetchChat();
  }, [chatId, myId]);

  const uploadToCloudinary = async (file: any) => {
    console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cloud_name", "dwqo8zxbz");
    formData.append("api_key", "229385179296817");
    formData.append("api_secret", "ijzMLse_4SylKD_y140RvoEUJrk");
    formData.append("folder", "Profile");
    formData.append("upload_preset", "l2gj1ucv");
    const uploadURL = file.type.startsWith("image")
      ? "/v1_1/dwqo8zxbz/image/upload"
      : "/v1_1/dwqo8zxbz/video/upload";
    console.log(uploadURL, "Uploadd url");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com${uploadURL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "THIS OS RESPOCE");
      const data = response.data;
      console.log("Cloudinary response:", data);
      const { secure_url } = data;
      return secure_url;
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;

    if (socket) {
      let mediaUrl: any = "";
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
      socket.emit("sendMessage", {
        conversationId: chatId,
        senderId: myId,
        receiverId: tutorId,
        message: input,
        media: { url: mediaUrl, type: mediaType },
      });
      toast.success("Message sent");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  const onEmojiClick = (emojiObject: any) => {
    const emoji = emojiObject.emoji;
    setInput((prevInput) => prevInput + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-blue-gray-500">
      {/* MESSAGE SECTION */}
      <div className="w-full flex flex-col">
        {/* HEADER */}
        <header className="p-4 border-b border-gray-300 flex items-center bg-blue-400 text-white">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
            {tutorDetails?.photo && (
              <img
                src={tutorDetails.photo}
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
            )}
          </div>
          <h2 className="text-lg font-semibold">{tutorDetails?.tutorname}</h2>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {messageData.length > 0 && (
            <>
              {messageData.map((message, index) => {
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
                        isSender
                          ? "bg-gray-500 text-white"
                          : "bg-sky-600 text-white"
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
              <div ref={messagesEndRef}></div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <footer className="p-4 border-t border-gray-300">
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

export default StudentChat;
