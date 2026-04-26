import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Chat.css";

function Chat() {
  const { tutorEmail, courseId, courseName, tutorName } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, [tutorEmail, courseId]);

  const fetchMessages = async () => {
    try {
      let studentEmailParam = role === "student" ? userEmail : undefined;
      let tutorEmailParam = role === "tutor" ? userEmail : undefined;
      // If role is tutor, get studentEmail from URL params
      if (role === "tutor") studentEmailParam = useParams().tutorEmail;
      if (role === "student") tutorEmailParam = tutorEmail;
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats/get-messages/${studentEmailParam}/${tutorEmailParam}/${courseId}`
      );
      setMessages(res.data.messages || []);
      
      // Mark as read if there are unread messages from the other person
      const hasUnread = res.data.messages && res.data.messages.some(m => m.sender !== role && !m.isRead);
      if (res.data.chatId && hasUnread) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chats/mark-read/${res.data.chatId}/${role}`);
      }
    } catch (err) {
      // Error handled
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      // Determine sender and recipient fields
      let payload = {
        studentName: role === "student" ? userName : useParams().tutorName,
        studentEmail: role === "student" ? userEmail : useParams().tutorEmail,
        tutorName: role === "tutor" ? userName : tutorName,
        tutorEmail: role === "tutor" ? userEmail : tutorEmail,
        courseId,
        courseName,
        message,
        senderRole: role,
        senderName: userName
      };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chats/send-message`, payload);
      setMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ChatContainer">
      <div className="ChatHeader">
        <button className="BackBtn" onClick={() => navigate(-1)}>← Back</button>
        <div className="ChatHeaderInfo">
          <h2> 💬 {tutorName}</h2>
          <p>{courseName}</p>
        </div>
      </div>

      <div className="ChatMessages" ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <p className="NoMessagesText">Start your conversation...</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`ChatPageMessage ${msg.sender}`}>
              <div className="MessageBubble">
                <p className="MessageSender">{msg.senderName}</p>
                <p className="MessageContent">{msg.message}</p>
                <span className="MessageTimestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="ChatInput">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
