import { useEffect, useState } from "react";

type Submission = {
  id: number;
  assignment: string;
  student: string;
  document: string;
  document_id: number;
};

function SubmissionList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/submissions")
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h3>Assignment Submissions</h3>

      {submissions.map((submission) => (
        <div key={submission.id}>
          <p>Assignment: {submission.assignment}</p>
<p>Student: {submission.student}</p>
<p>Document: {submission.document}</p>
<p>Document ID: {submission.document_id}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default SubmissionList;