import { useEffect, useState } from "react";

type Submission = {
  id: number;
  assignment_id: number;
  student_id: number;
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
          <p>
            <b>Assignment:</b> {submission.assignment_id}
          </p>

          <p>
            <b>Student:</b> {submission.student_id}
          </p>

          <p>
            <b>Document:</b> {submission.document_id}
          </p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default SubmissionList;