import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { usePopup, PopupProvider } from "../components/Popup";
import "./ChatPage.css";

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { popup, showAlert, closePopup } = usePopup();

  // User info from localStorage
  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("name");
  const userRole = localStorage.getItem("role");

  // State
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChatData, setSelectedChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

  // Navigation state (when coming from Student Dashboard or My Purchases)
  const courseFromNav = useRef(location.state?.course || null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // ✅ STEP 1: Check auth and load chats on mount
  useEffect(() => {
    if (!userEmail || !userRole) {
      navigate("/login");
      return;
    }
    loadChats();
    const interval = setInterval(loadChats, 2000);
    return () => clearInterval(interval);
  }, []);

  // ✅ STEP 2: Auto-select first chat or prepare for new one from dashboard
  useEffect(() => {
    if (chats.length === 0 && !courseFromNav.current) return;

    if (courseFromNav.current) {
      const course = courseFromNav.current;
      const existing = chats.find((c) => c.courseId === (course._id || course.name));

      if (existing) {
        setSelectedChatId(existing._id);
      } else {
        setSelectedChatData({
          courseId: course._id || course.name,
          courseName: course.name,
          tutorEmail: course.tutorEmail,
          tutorName: course.tutorName,
        });
      }
      courseFromNav.current = null;
    }
    // ✅ REMOVED: Auto-select first chat - let user manually select
    // Only select if coming from course navigation (courseFromNav)
  }, [chats]);

  // ✅ STEP 3: Load messages when chat selected
  useEffect(() => {
    if (selectedChatId) {
      loadMessages();
      const interval = setInterval(loadMessages, 1500);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  const loadChats = async () => {
    try {
      const endpoint =
        userRole === "student"
          ? `/api/chats/list/${userEmail}/student`
          : `/api/chats/list/${userEmail}/tutor`;

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`);
      const chatsData = res.data || [];
      setChats(chatsData);
    } catch (err) {
      // Error handled silently
    }
  };

  const loadMessages = async () => {
    if (!selectedChatId) return;
    try {
      // Get the current selected chat from the chats list to ensure accuracy
      const selectedChat = chats.find((c) => c._id === selectedChatId);
      
      if (!selectedChat) {
        setMessages([]);
        return;
      }

      // Use the chat endpoint with the actual ID
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${selectedChatId}`);
      
      if (res.data?.messages) {
        setMessages(res.data.messages);
        
        // ✅ Mark as read if there are any unread messages from the other person
        const hasUnread = res.data.messages.some(m => m.sender !== userRole && !m.isRead);
        if (res.data._id && hasUnread) {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chats/mark-read/${res.data._id}/${userRole}`);
        }
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error loading messages:", err.message);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || loading) return;

    try {
      setLoading(true);

      const chatData = selectedChatData || chats.find((c) => c._id === selectedChatId);
      if (!chatData) {
        showAlert("Please select a conversation first.", "❌ No Chat Selected");
        setLoading(false);
        return;
      }

      // ✅ Ensure tutorEmail and studentEmail exist (fallback handling)
      let tutorEmailValue = chatData.tutorEmail;
      let studentEmailValue = chatData.studentEmail;

      if (!tutorEmailValue && userRole === "student") {
        // If tutorEmail missing and we're a student, we don't have it
        showAlert("Please refresh and try again.", "❌ Tutor Information Missing");
        setLoading(false);
        return;
      }

      if (!studentEmailValue && userRole === "tutor") {
        // If studentEmail missing and we're a tutor, we don't have it
        showAlert("Please refresh and try again.", "❌ Student Information Missing");
        setLoading(false);
        return;
      }

      const payload = {
        studentEmail: userRole === "student" ? userEmail : (studentEmailValue || chatData.studentEmail),
        tutorEmail: userRole === "student" ? (tutorEmailValue || chatData.tutorEmail) : userEmail,
        studentName: userRole === "student" ? userName : (chatData.studentName || "Student"),
        tutorName: userRole === "student" ? (chatData.tutorName || "Tutor") : userName,
        courseId: chatData.courseId,
        courseName: chatData.courseName,
        message: messageText.trim(),
        senderRole: userRole,
        senderName: userName,
      };

      // Validate required fields
      if (!payload.studentEmail || !payload.tutorEmail || !payload.courseId || !payload.message) {
        showAlert("Missing required fields", "❌ Missing Fields");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chats/send-message`, payload);

      setMessageText("");

      if (!selectedChatId) {
        setSelectedChatId(res.data.chat._id);
        setSelectedChatData(null);
      }

      await loadChats();
      if (res.data.chat._id) {
        setTimeout(loadMessages, 300);
      }
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
      const errorMsg = err.response?.data?.details ? 
        (Array.isArray(err.response.data.details) ? err.response.data.details.join(", ") : err.response.data.details)
        : err.response?.data?.error || "Failed to send message";
      showAlert(errorMsg, "❌ Error");
    } finally {
      setLoading(false);
    }
  };

  const selectChat = (chat) => {
    // ✅ Validate chat exists and has required fields
    if (!chat || !chat._id || !chat.courseId) {
      console.warn("⚠️ Invalid chat object:", chat);
      return;
    }
    setSelectedChatId(chat._id);
    setSelectedChatData(null);
  };

  const getOtherPersonName = () => {
    if (selectedChatData) {
      return selectedChatData.tutorName || (userRole === "student" ? "Tutor" : "Student");
    }
    if (!selectedChatId) return "";
    const chat = chats.find((c) => c._id === selectedChatId);
    return userRole === "student" ? (chat?.tutorName || "Tutor") : (chat?.studentName || "Student");
  };

  const getCourseName = () => {
    if (selectedChatData) return selectedChatData.courseName || "Course";
    const chat = chats.find((c) => c._id === selectedChatId);
    return chat?.courseName || "";
  };

  return (
    <>
      <PopupProvider popup={popup} closePopup={closePopup} />
      
      <div className="ChatPageContainer">
      <div className="ChatPageLeftColumn">
        <div className="ChatPageListHeader">
          <h2>💬 My Chats</h2>
        </div>

        {chats.length === 0 ? (
          <div className="NoChatsMessage">
            {userRole === "student" ? (
              <>
                <p>No conversations yet</p>
                <button onClick={() => navigate("/student-dashboard")} className="btn">
                  Start Chatting
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ fontSize: "14px", marginBottom: "10px" }}>📭 No Active Conversations</p>
                <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
                  ⏳ Waiting for students to initiate conversations about your courses
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="ChatPageList">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`ChatRoomItem ${selectedChatId === chat._id ? "active" : ""}`}
                onClick={() => selectChat(chat)}
              >
                <div className="ChatPageItemInfo">
                  <h4>{userRole === "student" ? chat.tutorName : chat.studentName}</h4>
                  <p className="ChatPageItemCourse">📚 {chat.courseName}</p>
                  <p className="ChatPageItemLastMsg">
                    {chat.messages.length === 0
                      ? "No messages yet"
                      : chat.messages[chat.messages.length - 1].message.substring(0, 40) + "..."}
                  </p>
                </div>
                <div className="ChatPageItemMeta">
                  {chat.unreadCount > 0 && (
                    <span className="ChatListUnreadBadge">
                      {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ChatRoomRightColumn">
        {selectedChatId || selectedChatData ? (
          <>
            <div className="ChatRoomHeader">
              <div className="ChatRoomHeaderInfo">
                <h2>💬 {getOtherPersonName()}</h2>
                <p>📚 {getCourseName()}</p>
              </div>
            </div>

            <div className="ChatRoomMessages" ref={messagesContainerRef}>
              {messages.length === 0 ? (
                <p className="NoMessagesText">Start your conversation...</p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`ChatRoomMessage ${msg.sender === userRole ? "sent" : "received"}`}
                  >
                    <div className="ChatRoomMessageBubble">
                      <p className="ChatRoomMessageSender">{msg.senderName}</p>
                      <p className="ChatRoomMessageContent">{msg.message}</p>
                      <span className="ChatRoomMessageTimestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="ChatRoomInput">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading}>
                {loading ? "..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="ChatRoomEmpty">
            {userRole === "tutor" ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "48px", margin: "0" }}>💬</p>
                <p>👈 Select a conversation to reply</p>
                <p style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
                  Students will contact you through your courses
                </p>
              </div>
            ) : (
              <p>👈 Select a chat to start messaging</p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ChatPage;
