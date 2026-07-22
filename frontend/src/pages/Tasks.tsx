import { useEffect, useState } from "react";
import "./Tasks.css";


type Assignment = {
    id:number;
    title:string;
    description:string;
    subject:string;
    deadline:string;
};


function Tasks(){

    const [title,setTitle] = useState("");
    const [subject,setSubject] = useState("");
    const [deadline,setDeadline] = useState("");
    const [description,setDescription] = useState("");

    const [file,setFile] = useState<File | null>(null);

    const [assignments,setAssignments] =
        useState<Assignment[]>([]);


    const fetchAssignments = async()=>{

        try{

            const response = await fetch(
                "http://127.0.0.1:8000/assignments"
            );

            const data =
                await response.json();

            setAssignments(data);

        }
        catch(error){
            console.log(error);
        }

    };


    useEffect(()=>{

        fetchAssignments();

    },[]);



    const handleCreateTask = async()=>{


        const token =
            localStorage.getItem("token");


        try{


            const response =
                await fetch(
                    "http://127.0.0.1:8000/assignments",
                    {

                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json",

                        Authorization:
                        `Bearer ${token}`
                    },


                    body:JSON.stringify({

                        title,
                        subject,
                        deadline,
                        description

                    })

                    }
                );


            const data =
                await response.json();


            console.log(data);


            setTitle("");
            setSubject("");
            setDeadline("");
            setDescription("");
            setFile(null);


            fetchAssignments();


        }
        catch(error){

            console.log(error);

        }


    };



return(

<div className="tasks-container">


<h2>Tasks</h2>



<div className="task-layout">


{/* CREATE TASK */}

<div className="task-card">

<h3>Create Task</h3>


<input
type="text"
placeholder="Assignment Title"
value={title}
onChange={(e)=>
setTitle(e.target.value)}
/>


<input
type="text"
placeholder="Subject"
value={subject}
onChange={(e)=>
setSubject(e.target.value)}
/>



<input
type="date"
value={deadline}
onChange={(e)=>
setDeadline(e.target.value)}
/>



<textarea

placeholder="Assignment Description"

value={description}

onChange={(e)=>
setDescription(e.target.value)}

 />



<label>
Upload Assignment File
</label>


<input

type="file"

onChange={(e)=>{

if(e.target.files)
setFile(e.target.files[0]);

}}

/>


{
file &&
<p>
Selected: {file.name}
</p>
}



<button
onClick={handleCreateTask}
>

Create Task

</button>


</div>





{/* ASSIGNMENT LIST */}


<div className="task-card">


<h3>
Assignments
</h3>



{
assignments.length===0 ?

<p>
No assignments created
</p>


:

assignments.map((assignment)=>(


<div
className="assignment-item"
key={assignment.id}
>


<h4>
{assignment.title}
</h4>


<p>
<b>Subject:</b>
{assignment.subject}
</p>


<p>
<b>Deadline:</b>
{assignment.deadline}
</p>


<p>
{assignment.description}
</p>



<hr/>


</div>


))

}


</div>



</div>


</div>


)

}


export default Tasks;