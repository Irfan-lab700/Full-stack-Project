import "./AdminDashboard.css";
import AssignmentList from "./Assignmentlist";
import { useState, useEffect } from "react";

type DocumentType = {
id: number;
filename: string;
subject: string;
};

function AdminDashboard() {
const [selectedFile, setSelectedFile] =
useState<File | null>(null);

const [subject, setSubject] =
useState("");

const [message, setMessage] =
useState("");

const [documents, setDocuments] =
useState<DocumentType[]>([]);

const fetchDocuments = async () => {
const token =
localStorage.getItem("token");


if (!token) return;

try {
  const response = await fetch(
    "http://127.0.0.1:8000/documents",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data =
    await response.json();

  setDocuments(data);
} catch (error) {
  console.log(error);
}


};

useEffect(() => {
fetchDocuments();
}, []);

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

  fetchDocuments();
} catch {
  setMessage("Upload failed");
}


};

const handleDelete = async (
documentId: number
) => {
const token =
localStorage.getItem("token");


try {
  await fetch(
    `http://127.0.0.1:8000/documents/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  fetchDocuments();
} catch (error) {
  console.log(error);
}


};

return ( <div className="admin-container"> <h2>🛡️ Admin Dashboard</h2>

  <div className="admin-cards">

    <div className="admin-card">
      <h3>Upload Documents</h3>

      <input
        type="text"
        placeholder="Enter Subject"
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

      {selectedFile && (
        <p>
          Selected: {selectedFile.name}
        </p>
      )}

      <button onClick={handleUpload}>
        Upload
      </button>

      <p>{message}</p>
    </div>

    <div className="admin-card">
      <h3>Uploaded Documents</h3>

      {documents.length === 0 ? (
        <p>No documents uploaded</p>
      ) : (
        documents.map((doc) => (
          <div key={doc.id}>
            <p>
              <strong>
                {doc.subject}
              </strong>
              {" | "}
              {doc.filename}
            </p>

            <button
              onClick={() =>
                handleDelete(doc.id)
              }
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>

    <div className="admin-card">
      <h3>Manage Users</h3>
      <p>
        Control user access and roles.
      </p>
    </div>

    <div className="admin-card">
  <h3>Analytics</h3>
  <p>
    View system insights.
  </p>
</div>

<div className="admin-card">
  <AssignmentList />
</div>

  </div>
</div>



);
}

export default AdminDashboard;
