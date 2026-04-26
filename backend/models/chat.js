const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["student", "tutor"], required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
}, { _id: true });

const chatSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  tutorName: { type: String, required: true },
  tutorEmail: { type: String, required: true, lowercase: true, trim: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  
  // Main messages array
  messages: [messageSchema],
  
  // Backup/Archive of deleted messages (for recovery)
  archivedMessages: [messageSchema],
  
  // Chat metadata for consistency
  messageCount: { type: Number, default: 0 },
  lastMessageTime: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastBackupAt: { type: Date, default: Date.now }
});

// ✅ Create indexes for fast queries
chatSchema.index({ studentEmail: 1, tutorEmail: 1, courseId: 1 }, { unique: true });
chatSchema.index({ studentEmail: 1 });
chatSchema.index({ tutorEmail: 1 });
chatSchema.index({ updatedAt: -1 });
chatSchema.index({ "messages.timestamp": -1 });

// ✅ Instance method: Archive a message (backup before deletion)
chatSchema.methods.archiveMessage = function (messageIndex) {
  if (messageIndex >= 0 && messageIndex < this.messages.length) {
    const message = this.messages[messageIndex];
    this.archivedMessages.push(message);
    this.messages.splice(messageIndex, 1);
    return true;
  }
  return false;
};

// ✅ Instance method: Restore archived message
chatSchema.methods.restoreMessage = function (messageId) {
  const index = this.archivedMessages.findIndex(m => m._id.toString() === messageId.toString());
  if (index !== -1) {
    const message = this.archivedMessages[index];
    this.messages.push(message);
    this.archivedMessages.splice(index, 1);
    return true;
  }
  return false;
};

// ✅ Instance method: Get chat backup info
chatSchema.methods.getBackupInfo = function () {
  return {
    totalMessages: this.messageCount,
    activeMessages: this.messages.length,
    archivedMessages: this.archivedMessages.length,
    lastBackupAt: this.lastBackupAt,
    lastMessageTime: this.lastMessageTime,
    isActive: this.isActive
  };
};

module.exports = mongoose.model("Chat", chatSchema);
