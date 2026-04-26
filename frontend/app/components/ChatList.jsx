import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ChatList.css";

function ChatList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const userEmail = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      let res;
      res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chats/list/${userEmail}/${role}`);
      setChats(res.data);
    } catch (err) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const openChat = (chat) => {
    if (role === "student") {
      navigate(`/chat/${chat.tutorEmail}/${chat.courseId}/${encodeURIComponent(chat.courseName)}/${encodeURIComponent(chat.tutorName)}`);
    } else {
      navigate(`/chat/${chat.studentEmail}/${chat.courseId}/${encodeURIComponent(chat.courseName)}/${encodeURIComponent(chat.studentName)}`);
    }
  };

  const getLastMessage = (messages) => {
    if (messages.length === 0) return "No messages yet";
    return messages[messages.length - 1].message.substring(0, 50) + (messages[messages.length - 1].message.length > 50 ? "..." : "");
  };

  const getLastMessageTime = (messages) => {
    if (messages.length === 0) return "";
    const date = new Date(messages[messages.length - 1].timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="ChatsListContainer">
      <div className="ChatsListHeader">
        <h2>💬 My Chats</h2>
        <button onClick={() => navigate(-1)} className="BackBtn">← Back</button>
      </div>

      {chats.length === 0 ? (
        <div className="NoChatsMessage">
          <p>No conversations yet</p>
          <button onClick={() => navigate("/")} className="btn">Start Chatting</button>
        </div>
      ) : (
        <div className="ChatsList">
          {chats.map((chat, idx) => (
            <div key={idx} className="ChatItem" onClick={() => openChat(chat)}>
              <div className="ChatItemInfo">
                <h4>{role === "student" ? chat.tutorName : chat.studentName}</h4>
                <p className="ChatItemCourse">📚 {chat.courseName}</p>
                <p className="ChatItemLastMsg">{getLastMessage(chat.messages)}</p>
              </div>
              <div className="ChatItemMeta">
                <span className="ChatItemDate">{getLastMessageTime(chat.messages)}</span>
                {chat.unreadCount > 0 && (
                  <span className="ChatListUnreadBadge">{chat.unreadCount > 99 ? "99+" : chat.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;
