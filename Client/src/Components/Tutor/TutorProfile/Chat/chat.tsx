import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { useSocket } from '../../../../Socket/Socket';
import { fetchChatMessages, fetchTutorChatMessages } from '../../../../Utils/config/axios.GetMethods';
import { toast } from "sonner";
import { sendMessageFrom } from '../../../../Utils/config/axios.PostMethods';
import axios from 'axios';
import { ChatState } from '../../../../Slices/chatSlice/chatSlice';
import { MessageState } from '../../../../Slices/messageSlice/messageSlice';

interface Message {
    _id: string;
    message: string | any[];
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

function Chat() {
    const chat = useSelector((state: ChatState) => state?.chat?.selectedchat);
    const message = useSelector((state: MessageState) => state?.message?.selectedmessage);
    const Navigate = useNavigate();
    const [allUsers, setAllUsers] = useState<User[]>([]); // to list users in the sidebar
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // to show name on the message heading
    const [messages, setMessages] = useState<string>(""); // to show name on the message heading
    const [messageData, setMessageData] = useState<Message[]>([]);
    const [sendMessage, setSendMessage] = useState<boolean>(false);
    const [currentUsers, setCurrentUsers] = useState<any>([]);
    const [input,setInput]=useState('')
    const [searchError, setSearchError] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [chatData, setChatData] = useState([]);
    const { tutor } = useSelector((state: any) => state.tutor);
    const tutorId = tutor._id;
    const { chatId } = useParams();
    const socket = useSocket();

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

    useEffect(()=>{
      console.log('TRIGRED');
      
   if(socket){
    socket.on("receiveMessage",(data:any)=>{
      setMessageData((prevMessages: any) => {
        const setNewMessage = [...prevMessages, data.data];
        return setNewMessage;
      });
      setInput('')
    })
  
   
   }
    },[socket])
    useEffect(() => {
        if (chatId === 'index') return;
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
        (async () => {
            const data = {
                tutorId
            };
            const response = await axios.create({ withCredentials: true }).post("http://localhost:5000/chat/getUserMessages", data);
            if (response.data.status) {
                toast.success("YYA");
                setChatData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        })();
    }, [tutorId]);

    const handleUserClick = (chat: any) => {
        console.log("Setiing sellll", chat);
        Navigate(`/tutor/chat-box/${chat._id}`);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
        if (socket) {
          
          const userId=chatData[0]?.participants[0]?.userId._id
            socket.emit("sendMessage", {
              conversationId:chatId,
              senderId:tutorId,
              receiverId:userId,
              message:input,
            });
        }

       
    };

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

    return (
        <div className="flex h-screen overflow-hidden bg-blue-gray-500">
            {/* SIDE BAR */}
            <div className="w-1/4 border-r border-gray-300 b bg-sky-700">
                <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-teal-600 text-white">
                    <div className="max-w-2xl mx-auto">
                        <form className="flex items-center">
                            <label htmlFor="simple-search" className="sr-only">Search</label>
                            <div className="relative w-full ">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
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
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </button>
                        </form>
                    </div>
                </header>

                <div className="overflow-hidden h-screen p-3 mb-9 pb-20">
                    {chatData.length > 0 && (
                        <>
                            {chatData?.map((chat: any) => {
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
                                                    src={'https://res.cloudinary.com/dwqo8zxbz/image/upload/v1715588450/Profile/3d_female_character_reading_book_23_2148938892_jpg.jpg'}
                                                    alt="User Avatar"
                                                    className="w-12 h-12 rounded-full"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-l text-white font-semibold">
                                                {chat.participants[0].userId.studentname}
                                            </h2>
                                            <p className="text-white">How are you!!</p>
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
                        {selectedUser && (
                            <img
                                src={selectedUser.photo}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full"
                            />
                        )}
                    </div>
                    <h2 className="text-lg font-semibold">{selectedUser?.studentname}</h2>
                </header>

                {/* MESSAGES */}
                <div className="flex-1 p-4 overflow-y-auto bg-white">
                    {messageData.length > 0 && (
                        <>
                            {messageData?.map((message: any) => {
                                const isSender = message.senderId === tutorId;
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-xs p-2 rounded-md ${isSender ? 'bg-cyan-950 text-white' : 'bg-gray-200 text-gray-900'
                                                }`}
                                        >
                                            {message.message}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* FOOTER */}
                <footer className="p-4 border-t border-gray-300">
                    <form onSubmit={(e)=>handleSubmit(e)} className="flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 border rounded-lg p-2 mr-2"
                            placeholder="Type your message..."
                            required
                        />
                        <button
                            type="submit"
                            className="bg-cyan-950 text-white p-2 rounded-lg"
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
