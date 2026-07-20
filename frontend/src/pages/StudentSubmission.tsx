import { useEffect, useState } from "react";

type Assignment = {
  id: number;
  title: string;
};

type Document = {
  id: number;
  filename: string;
};

function StudentSubmission() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const [selectedAssignment, setSelectedAssignment] =
    useState("");

  const [selectedDocument, setSelectedDocument] =
    useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data));

    const token = localStorage.getItem("token");

    fetch(
      "http://127.0.0.1:8000/my-documents",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setDocuments(data));
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://127.0.0.1:8000/submissions",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignment_id:
            Number(selectedAssignment),
          document_id:
            Number(selectedDocument),
        }),
      }
    );

    const data = await response.json();

    alert(data.message);
  };

  return (
    <div>
      <h3>Submit Assignment</h3>

      <select
        value={selectedAssignment}
        onChange={(e) =>
          setSelectedAssignment(
            e.target.value
          )
        }
      >
        <option value="">
          Select Assignment
        </option>

        {assignments.map((a) => (
          <option
            key={a.id}
            value={a.id}
          >
            {a.title}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={selectedDocument}
        onChange={(e) =>
          setSelectedDocument(
            e.target.value
          )
        }
      >
        <option value="">
          Select Document
        </option>

        {documents.map((d) => (
          <option
            key={d.id}
            value={d.id}
          >
            {d.filename}
          </option>
        ))}
      </select>

      <br />
      <br />

      <button onClick={handleSubmit}>
        Submit Assignment
      </button>
    </div>
  );
}

export default StudentSubmission;