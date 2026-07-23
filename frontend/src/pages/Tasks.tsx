import TeacherTasks from "./TeacherTasks";
import StudentTasks from "./StudentTasks";


function Tasks(){

    const role = localStorage.getItem("role");
    console.log("CURRENT ROLE =", role);


    if(role === "teacher" || role === "admin"){
        return <TeacherTasks />;
    }


    else{
        return <StudentTasks />;
    }

}


export default Tasks;