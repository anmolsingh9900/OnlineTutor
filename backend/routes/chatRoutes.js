const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const mongoose = require("mongoose");

// ✅ HELPER: Normalize email
const normalizeEmail = (email) => (email || "").toLowerCase().trim();

// ✅ HELPER: Validate message payload
const validateMessagePayload = (payload) => {
  const { studentEmail, tutorEmail, courseId, message, senderRole, senderName, studentName, tutorName, courseName } = payload;
  
  const errors = [];
  
  // Check existence
  if (!studentEmail || typeof studentEmail !== "string" || studentEmail.trim().length === 0) {
    errors.push("studentEmail is required and must be non-empty");
  }
  if (!tutorEmail || typeof tutorEmail !== "string" || tutorEmail.trim().length === 0) {
    errors.push("tutorEmail is required and must be non-empty");
  }
  if (!courseId || typeof courseId !== "string" || courseId.toString().trim().length === 0) {
    errors.push("courseId is required and must be non-empty");
  }
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    errors.push("message is required and cannot be empty");
  }
  if (!senderRole || !["student", "tutor"].includes(senderRole)) {
    errors.push("senderRole is required and must be 'student' or 'tutor'");
  }
  if (!senderName || typeof senderName !== "string" || senderName.trim().length === 0) {
    errors.push("senderName is required and must be non-empty");
  }
  if (!studentName || typeof studentName !== "string" || studentName.trim().length === 0) {
    errors.push("studentName is required and must be non-empty");
  }
  if (!tutorName || typeof tutorName !== "string" || tutorName.trim().length === 0) {
    errors.push("tutorName is required and must be non-empty");
  }
  if (!courseName || typeof courseName !== "string" || courseName.trim().length === 0) {
    errors.push("courseName is required and must be non-empty");
  }
  
  return errors.length > 0 ? { valid: false, errors } : { valid: true, errors: [] };
};

// 📨 SEND MESSAGE - Create chat if doesn't exist, add message with backup
router.post("/send-message", async (req, res) => {
  try {
    console.log("📨 Received send-message request:");
    console.log("   Payload:", JSON.stringify(req.body, null, 2));

    const { studentEmail, tutorEmail, studentName, tutorName, courseId, courseName, message, senderRole, senderName } = req.body;

    // ✅ VALIDATE payload
    const validation = validateMessagePayload(req.body);
    if (!validation.valid) {
      console.error("❌ Validation failed:", validation.errors);
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.errors 
      });
    }

    // Normalize emails
    const normStudentEmail = normalizeEmail(studentEmail);
    const normTutorEmail = normalizeEmail(tutorEmail);

    console.log("📨 Send Message:");
    console.log(`  From: ${senderName} (${senderRole})`);
    console.log(`  To: ${senderRole === "student" ? tutorName : studentName}`);
    console.log(`  Course: ${courseName}`);

    // Find OR create chat
    let chat = await Chat.findOne({
      studentEmail: normStudentEmail,
      tutorEmail: normTutorEmail,
      courseId
    });

    if (!chat) {
      chat = new Chat({
        studentEmail: normStudentEmail,
        studentName,
        tutorEmail: normTutorEmail,
        tutorName,
        courseId,
        courseName,
        messages: [],
        archivedMessages: [],
        messageCount: 0,
        isActive: true
      });
      console.log("  ✓ Created new chat");
    } else {
      // Update chat if names changed
      chat.studentName = studentName;
      chat.tutorName = tutorName;
      chat.courseName = courseName;
      console.log("  ✓ Found existing chat");
    }

    // Add message with validation
    const newMessage = {
      sender: senderRole,
      senderName: senderName.trim(),
      message: message.trim(),
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.isActive = true;
    chat.updatedAt = new Date();
    chat.lastBackupAt = new Date();

    // ✅ Sync metadata
    chat.messageCount = chat.messages.length;
    if (chat.messages.length > 0) {
      chat.lastMessageTime = chat.messages[chat.messages.length - 1].timestamp;
    }

    console.log("  → About to call chat.save()");
    await chat.save();
    console.log("  ✓ chat.save() completed successfully");

    console.log(`  ✓ Message saved (Total: ${chat.messageCount})`);
    console.log(`  ✓ Backup info: ${JSON.stringify(chat.getBackupInfo())}`);

    res.json({ 
      success: true, 
      chat,
      backupInfo: chat.getBackupInfo()
    });
  } catch (err) {
    console.error("❌ Error in send-message route:", err.message);
    console.error("   Error type:", err.name);
    console.error("   Stack:", err.stack);
    res.status(500).json({ 
      error: "Error sending message", 
      details: err.message,
      errorName: err.name
    });
  }
});

// 💬 GET CHATS FOR USER (Student=sender, Tutor=receiver)
router.get("/list/:email/:role", async (req, res) => {
  try {
    const { email, role } = req.params;
    const normEmail = normalizeEmail(email);

    console.log(`💬 Get ${role === "student" ? "Student" : "Tutor"} Chats: ${email}`);

    let chats;
    if (role === "student") {
      chats = await Chat.find({
        studentEmail: normEmail
      }).sort({ updatedAt: -1 });
    } else {
      chats = await Chat.find({
        tutorEmail: normEmail
      }).sort({ updatedAt: -1 });
    }

    // ✅ Auto-populate missing tutorEmail from courses
    try {
      const Course = mongoose.model("Course");
      for (let chat of chats) {
        if (!chat.tutorEmail || chat.tutorEmail === "") {
          // Try to find the course and get tutorEmail
          const course = await Course.findOne({ 
            $or: [
              { _id: chat.courseId },
              { name: chat.courseId }
            ]
          });
          
          if (course && course.tutorEmail) {
            chat.tutorEmail = course.tutorEmail;
            chat.tutorName = chat.tutorName || course.tutorName;
            console.log(`   ✅ Populated tutorEmail for chat ${chat._id}: ${chat.tutorEmail}`);
          }
        }
      }
    } catch (courseErr) {
      console.warn("   ⚠️ Could not populate tutorEmail:", courseErr.message);
      // Continue anyway - tutorEmail might be set already
    }

    console.log(`  ✓ Found ${chats.length} chats`);
    res.json(chats);
  } catch (err) {
    console.error("❌ Error fetching chats:", err.message);
    res.status(500).json({ error: "Error fetching chats" });
  }
});

// 📖 GET MESSAGES FOR A SPECIFIC CONVERSATION
router.get("/get-messages/:studentEmail/:tutorEmail/:courseId", async (req, res) => {
  try {
    const { studentEmail, tutorEmail, courseId } = req.params;

    const normStudentEmail = normalizeEmail(studentEmail);
    const normTutorEmail = normalizeEmail(tutorEmail);

    console.log(`📖 Get Messages: Student=${normStudentEmail}, Tutor=${normTutorEmail}, Course=${courseId}`);

    const chat = await Chat.findOne({
      studentEmail: normStudentEmail,
      tutorEmail: normTutorEmail,
      courseId
    });

    if (!chat) {
      console.log(`  ✓ No chat found, returning empty messages`);
      return res.json({ 
        messages: [],
        backupInfo: null
      });
    }

    console.log(`  ✓ Found ${chat.messages.length} messages`);
    res.json({ 
      messages: chat.messages,
      backupInfo: chat.getBackupInfo()
    });
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// 📖 GET SINGLE CHAT WITH MESSAGES
router.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    console.log(`📖 Get Chat: ${chatId} (${chat.messageCount} messages)`);
    res.json({
      ...chat.toObject(),
      backupInfo: chat.getBackupInfo()
    });
  } catch (err) {
    console.error("❌ Error fetching chat:", err.message);
    res.status(500).json({ error: "Error fetching chat" });
  }
});

// 🔄 GET CHAT BACKUP INFO
router.get("/backup/info/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    console.log(`🔄 Backup Info: ${chatId}`);
    res.json(chat.getBackupInfo());
  } catch (err) {
    console.error("❌ Error fetching backup info:", err.message);
    res.status(500).json({ error: "Error fetching backup info" });
  }
});

// 📦 GET ALL ARCHIVED MESSAGES
router.get("/archive/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    console.log(`📦 Archived Messages: ${chatId} (${chat.archivedMessages.length} messages)`);
    res.json({
      archivedMessages: chat.archivedMessages,
      totalArchived: chat.archivedMessages.length
    });
  } catch (err) {
    console.error("❌ Error fetching archived messages:", err.message);
    res.status(500).json({ error: "Error fetching archived messages" });
  }
});

// ♻️ RESTORE ARCHIVED MESSAGE
router.post("/restore-message/:chatId/:messageId", async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const restored = chat.restoreMessage(messageId);
    if (!restored) {
      return res.status(404).json({ error: "Archived message not found" });
    }

    chat.updatedAt = new Date();
    chat.messageCount = chat.messages.length;
    await chat.save();

    console.log(`♻️ Message Restored: ${messageId} in Chat ${chatId}`);
    res.json({
      success: true,
      message: "Message restored successfully",
      backupInfo: chat.getBackupInfo()
    });
  } catch (err) {
    console.error("❌ Error restoring message:", err.message);
    res.status(500).json({ error: "Error restoring message" });
  }
});

// 🔐 EXPORT CHAT HISTORY (For data backup/GDPR)
router.get("/export/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const exportData = {
      chatId: chat._id,
      participants: {
        student: { name: chat.studentName, email: chat.studentEmail },
        tutor: { name: chat.tutorName, email: chat.tutorEmail }
      },
      course: { id: chat.courseId, name: chat.courseName },
      statistics: {
        totalMessages: chat.messageCount,
        activeMessages: chat.messages.length,
        archivedMessages: chat.archivedMessages.length,
        createdAt: chat.createdAt,
        lastUpdateAt: chat.updatedAt
      },
      messages: chat.messages,
      archivedMessages: chat.archivedMessages
    };

    console.log(`🔐 Chat Exported: ${chatId}`);
    res.json(exportData);
  } catch (err) {
    console.error("❌ Error exporting chat:", err.message);
    res.status(500).json({ error: "Error exporting chat" });
  }
});

// ✅ VERIFY CHAT CONSISTENCY
router.post("/verify/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Verify message count consistency
    const actualCount = chat.messages.length;
    const recordedCount = chat.messageCount;
    const isConsistent = actualCount === recordedCount;

    console.log(`✅ Chat Verification: ${chatId}`);
    console.log(`   Actual: ${actualCount}, Recorded: ${recordedCount}, Consistent: ${isConsistent}`);

    if (!isConsistent) {
      // Auto-fix inconsistency
      chat.messageCount = actualCount;
      if (chat.messages.length > 0) {
        chat.lastMessageTime = chat.messages[chat.messages.length - 1].timestamp;
      }
      await chat.save();
      console.log(`   ✓ Fixed inconsistency`);
    }

    res.json({
      isConsistent,
      actualMessageCount: actualCount,
      recordedMessageCount: recordedCount,
      backupInfo: chat.getBackupInfo(),
      fixed: !isConsistent
    });
  } catch (err) {
    console.error("❌ Error verifying chat:", err.message);
    res.status(500).json({ error: "Error verifying chat" });
  }
});

// 🔧 REPAIR CHATS - Fix missing email fields in existing chats
router.post("/repair-all", async (req, res) => {
  try {
    console.log("🔧 Starting chat repair process...");

    // Find all chats with missing email fields
    const chatsToRepair = await Chat.find({
      $or: [
        { tutorEmail: { $exists: false } },
        { tutorEmail: null },
        { tutorEmail: "" },
        { studentEmail: { $exists: false } },
        { studentEmail: null },
        { studentEmail: "" }
      ]
    });

    console.log(`   Found ${chatsToRepair.length} chats to repair`);

    let repaired = 0;
    for (const chat of chatsToRepair) {
      try {
        let fixed = false;

        // If studentEmail is missing but we have studentName, we can't fix it (need to look in Users)
        if (!chat.studentEmail || chat.studentEmail === "") {
          console.log(`   ⚠️ Chat ${chat._id}: Missing studentEmail, cannot auto-fix`);
          continue;
        }

        // If tutorEmail is missing but we have tutorName, we can't fix it (need to look in Users)
        if (!chat.tutorEmail || chat.tutorEmail === "") {
          console.log(`   ⚠️ Chat ${chat._id}: Missing tutorEmail, cannot auto-fix`);
          continue;
        }

        if (fixed) {
          await chat.save();
          repaired++;
          console.log(`   ✅ Repaired chat ${chat._id}`);
        }
      } catch (err) {
        console.error(`   ❌ Error repairing chat ${chat._id}:`, err.message);
      }
    }

    console.log(`✅ Repair complete: ${repaired} chats fixed`);
    res.json({
      success: true,
      totalChats: chatsToRepair.length,
      repairedChats: repaired,
      message: `Repair complete. ${repaired} chats were fixed.`
    });
  } catch (err) {
    console.error("❌ Error in repair process:", err.message);
    res.status(500).json({ error: "Error in repair process", details: err.message });
  }
});

module.exports = router;
