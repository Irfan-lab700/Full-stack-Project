import { useState } from "react";

function StudentUpload() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file");
      return;
    }

    if (!subject.trim()) {
      setMessage("Please enter subject");
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    const formData = new FormData();

    formData.append(
      "subject",
      subject
    );

    formData.append(
      "file",
      selectedFile
    );

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-document",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data =
        await response.json();

      setMessage(data.message);

      setSelectedFile(null);
      setSubject("");
    } catch {
      setMessage("Upload failed");
    }
  };

  return (
    <div>
      <h3>Upload Assignment</h3>

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) =>
          setSubject(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="file"
        onChange={(e) => {
          if (
            e.target.files &&
            e.target.files.length > 0
          ) {
            setSelectedFile(
              e.target.files[0]
            );
          }
        }}
      />

      <br />
      <br />

      <button onClick={handleUpload}>
        Upload
      </button>

      <p>{message}</p>
    </div>
  );
}

export default StudentUpload;