import { useEffect, useState } from "react";
import "./TeacherTasks.css";

type Assignment = {
  id: number;
  title: string;
  description: string;
  subject: string;
  deadline: string;
};
type Submission = {
  id:number;
  assignment:string;
  student:string;
  document:string;
  document_id:number;
};

function TeacherTasks() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions,setSubmissions] = useState<Submission[]>([]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(
 "http://127.0.0.1:8000/assignments",
 {
   headers:{
     Authorization:
     `Bearer ${localStorage.getItem("token")}`
   }
 }
);

      const data = await response.json();

      setAssignments(data);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchSubmissions = async()=>{

  try{

    const response = await fetch(
      "http://127.0.0.1:8000/submissions",
      {
        headers:{
          Authorization:
          `Bearer ${localStorage.getItem("token")}`
        }
      }
    );


    const data = await response.json();

    setSubmissions(data);

  }
  catch(error){
    console.log(error);
  }

};

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);




  const handleCreateAssignment = async () => {
    const token = localStorage.getItem("token");
    console.log("ASSIGNMENT TOKEN =", token);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            subject,
            deadline,
          }),
        }
      );

      await response.json();

      setTitle("");
      setDescription("");
      setSubject("");
      setDeadline("");

      fetchAssignments();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteAssignment = async (
  assignmentId:number
) => {

  const token =
  localStorage.getItem("token");

  try {

    await fetch(
      `http://127.0.0.1:8000/assignments/${assignmentId}`,
      {
        method:"DELETE",
        headers:{
          Authorization:
          `Bearer ${token}`
        }
      }
    );

    fetchAssignments();

  }
  catch(error){
    console.log(error);
  }

};


  return (
    <div className="teacher-tasks-container">

      <div className="tasks-header">
        <h2>Assignment Management</h2>
        <p>Create and manage assignments for students</p>
      </div>

      <div className="tasks-grid">

        <div className="task-card">

          <h3>Create Assignment</h3>

          <input
            type="text"
            placeholder="Assignment Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
          />

          <textarea
            placeholder="Assignment Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button
            onClick={handleCreateAssignment}
          >
            Create Assignment
          </button>

        </div>

        <div className="task-card">

          <h3>My Assignments</h3>

          {assignments.length === 0 ? (
            <p className="empty-text">
              No assignments created yet
            </p>
          ) : (
            assignments.map((assignment) => (
              <div
  className="assignment-card"
  key={assignment.id}
>
  <h4>
    {assignment.title}
  </h4>

  <span className="subject-badge">
    {assignment.subject}
  </span>

  <p className="deadline">
    📅 {assignment.deadline}
  </p>

  <p className="description">
    {assignment.description}
  </p>

  <button
    className="delete-btn"
    onClick={() =>
      handleDeleteAssignment(
        assignment.id
      )
    }
  >
    Delete
  </button>

</div>
            ))
          )}

        </div>
        <div className="task-card">

<h3>
Student Submissions
</h3>


{
submissions.length === 0 ?

<p className="empty-text">
No submissions yet
</p>


:

submissions.map((submission)=>(

<div
className="assignment-card"
key={submission.id}
>

<h4>
{submission.assignment}
</h4>


<p>
<b>Student:</b>
{submission.student}
</p>


<p>
<b>File:</b>
{submission.document}
</p>


<a
href={`http://127.0.0.1:8000/documents/view/${submission.document_id}`}
target="_blank"
>
View Submission
</a>


</div>

))

}


</div>

      </div>

    </div>
  );
}

export default TeacherTasks;