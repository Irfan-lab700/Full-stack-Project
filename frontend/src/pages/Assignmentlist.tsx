import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


type Assignment = {
  id:number;
  title:string;
  description:string;
  subject:string;
  deadline:string;
};


function AssignmentList(){

const [assignments,setAssignments]=useState<Assignment[]>([]);


const [role,setRole]=useState("");

const [title,setTitle]=useState("");

const [description,setDescription]=useState("");

const [subject,setSubject]=useState("");

const [deadline,setDeadline]=useState("");



useEffect(()=>{


const token = localStorage.getItem("token");


if(token){

 const decoded:any = jwtDecode(token);

 setRole(decoded.role);

}


fetchAssignments();


},[]);





const fetchAssignments = async()=>{


try{

const response = await fetch(
"http://127.0.0.1:8000/assignments"
);


const data = await response.json();


setAssignments(data);


}

catch(error){

console.log(error);

}


};





const handleCreateAssignment = async()=>{


const token =
localStorage.getItem("token");



try{


const response = await fetch(

"http://127.0.0.1:8000/assignments",

{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${token}`

},


body:JSON.stringify({

title,

description,

subject,

deadline

})

}

);



const data =
await response.json();


console.log(data);



setTitle("");

setDescription("");

setSubject("");

setDeadline("");


fetchAssignments();



}

catch(error){

console.log(error);

}


};






return (

<div>


{
role==="admin" && (

<>

<h2>Create Assignment</h2>


<input

type="text"

placeholder="Title"

value={title}

onChange={(e)=>
setTitle(e.target.value)
}

/>


<br/><br/>


<input

type="text"

placeholder="Subject"

value={subject}

onChange={(e)=>
setSubject(e.target.value)
}

/>


<br/><br/>


<input

type="date"

value={deadline}

onChange={(e)=>
setDeadline(e.target.value)
}

/>


<br/><br/>


<textarea

placeholder="Description"

value={description}

onChange={(e)=>
setDescription(e.target.value)
}

/>


<br/><br/>


<button
onClick={handleCreateAssignment}
>
Create Assignment
</button>


<hr/>

</>

)

}



<h2>
Assignments
</h2>



{

assignments.length===0 ?

(

<p>No Assignments Found</p>

)

:

(

assignments.map((assignment)=>(


<div key={assignment.id}>


<h3>
{assignment.title}
</h3>


<p>
{assignment.description}
</p>


<p>
<b>Subject:</b>
{assignment.subject}
</p>


<p>
<b>Deadline:</b>
{assignment.deadline}
</p>


<hr/>


</div>


))

)

}



</div>


);


}


export default AssignmentList;