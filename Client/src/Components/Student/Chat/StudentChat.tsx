import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { ChatState } from "../../../Slices/chatSlice/chatSlice";
import { MessageState } from "../../../Slices/messageSlice/messageSlice";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { io } from "socket.io-client";
// import { useSocket } from "../../../Socket/Socket";
import { axiosInstance } from "../../../Utils/config/axios.config";
import { fetchChatMessages, getTutor } from "../../../Utils/config/axios.GetMethods";
import { sendMessageFrom } from "../../../Utils/config/axios.PostMethods";

interface Message {
  _id: string;
  message: string | any[];
  senderId: string;
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

interface Tutor {
  _id: any;
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
  const [input,setInput]=useState('')
  const { tutorId,chatId } = useParams<{ tutorId:string,chatId:string}>();
  const [socket, setSocket] = useState<any>(null);
  // const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setSocket(io("http://localhost:5001"));
  }, []);
  
  useEffect(() => {
    if (socket) {
      console.log('inside the soket');
      
      socket.emit("addUser", myId);

      socket.on("getUsers", (users: any) => {
        toast.success('get a mesage')
        setCurentUsers(users);
      });

     
      

     
    }
  }, [socket, chatId]);


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
  }, [chatId]);

  const sendMessage = () => {
    if (!input.trim()) return;
toast.success("Message send")
    if (socket) {
      socket.emit("sendMessage", {
        conversationId:chatId,
        senderId:myId,
        receiverId:tutorId,
        message:input,
      });
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

  return (
    <div>
      <div>
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
          <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
            <div className="relative flex items-center space-x-4">
              <div className="relative">
                <span className="absolute text-green-500 right-0 bottom-0">
                  <svg width={20} height={20}>
                    <circle cx={8} cy={8} r={8} fill="currentColor" />
                  </svg>
                </span>
                <img
                  src={tutorDetails?.photo}
                  alt=""
                  className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                />
              </div>
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">
                  {tutorDetails?.tutorname}
                </span>
              </div>
              <div
                className="flex flex-col leading-tight"
                style={{ height: "100%" }}
              >
                <div className="flex justify-end mb-2">
                  <Link
                    to="/singleEnrolledCourses"
                    className="bg-teal-500 hover:from-pink-500 hover:to-yellow-500 ...  rounded-md px-4 py-2 text-white text-sm font-medium"
                  >
                    Back
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2"></div>
          </div>
          <div
            id="messages"
            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
            {messageData?.map((message: Message, index: number) => (
              <div key={index} className="chat-message">
                <div
                  className={`flex items-end ${
                    message.senderId === tutorId
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2">
                    <div>
                      <span
                        className={`px-4 py-2 rounded-lg inline-block ${
                          message.senderId === tutorId
                            ? "rounded-bl-none bg-gray-300 text-gray-600"
                            : "rounded-br-none bg-blue-600 text-white"
                        }`}
                      >
                        {message.message}
                      </span>
                    </div>
                  </div>
                  <img
                    src={
                      message.senderId === tutorId
                        ? tutorDetails?.photo
                        : "https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                    }
                    alt={
                      message.senderId === tutorId
                        ? "Tutor profile"
                        : "My profile"
                    }
                    className="w-6 h-6 rounded-full"
                  />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <form className="relative flex" onSubmit={(e)=>handleSubmit(e)}>
              <span className="absolute inset-y-0 flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              </span>
              <input
                type="text"
                placeholder="Write your message!"
                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                {/* <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button> */}
                {/* <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button> */}
                {/* <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button> */}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
             
                >
                  <span className="font-bold">Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 ml-2 transform rotate-90"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n.scrollbar-w-2::-webkit-scrollbar {\n  width: 0.25rem;\n  height: 0.25rem;\n}\n\n.scrollbar-track-blue-lighter::-webkit-scrollbar-track {\n  --bg-opacity: 1;\n  background-color: #f7fafc;\n  background-color: rgba(247, 250, 252, var(--bg-opacity));\n}\n\n.scrollbar-thumb-blue::-webkit-scrollbar-thumb {\n  --bg-opacity: 1;\n  background-color: #edf2f7;\n  background-color: rgba(237, 242, 247, var(--bg-opacity));\n}\n\n.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {\n  border-radius: 0.25rem;\n}\n",
          }}
        />
      </div>
    </div>
  );
}

export default StudentChat;
