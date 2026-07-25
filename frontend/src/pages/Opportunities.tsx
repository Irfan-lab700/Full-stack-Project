import TeacherOpportunities from "./TeacherOpportunities";
import StudentOpportunities from "./StudentOpportunities";


function Opportunities(){

const role =
localStorage.getItem("role");


if(role==="teacher" || role==="admin")
{
    return <TeacherOpportunities/>
}


return <StudentOpportunities/>

}


export default Opportunities;