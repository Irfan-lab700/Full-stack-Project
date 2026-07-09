import { useState, useEffect, useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello 👋 How can I help you today?",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setInput("");

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
        },
      ]);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Server error.",
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={
        isMaximized
          ? "chat-window maximized"
          : "chat-window"
      }
    >
      <div className="chat-header">
        <span>🤖 AI Assistant</span>

        <button
          className="maximize-btn"
          onClick={() =>
            setIsMaximized(!isMaximized)
          }
        >
          {isMaximized ? "🗗" : "🗖"}
        </button>
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

        {loading && (
          <div className="bot-message">
            Typing...
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
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