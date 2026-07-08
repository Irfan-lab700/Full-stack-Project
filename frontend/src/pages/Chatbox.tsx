import { useState } from "react";
import "./Chatbox.css";

type ChatBoxProps = {
  isOpen: boolean;
};

type Message = {
  sender: "user" | "bot";
  text: string;
};

function Chatbox({ isOpen }: ChatBoxProps) {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello 👋 How can I help you today?",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: input,
      },
      {
        sender: "bot",
        text: "I am your AI Project Copilot.",
      },
    ]);

    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="chat-window">
      <div className="chat-header">
        AI Assistant
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? "user-message"
                : "bot-message"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input
  type="text"
  placeholder="Type your message..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }}
/>

        <button onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbox;