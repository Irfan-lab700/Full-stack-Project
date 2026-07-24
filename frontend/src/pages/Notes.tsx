import TeacherNotes from "./TeacherNotes";
import StudentNotes from "./StudentNotes";

function Notes() {

  const role =
    localStorage.getItem("role");

  if (role === "admin") {
    return <TeacherNotes />;
  }

  return <StudentNotes />;
}

export default Notes;