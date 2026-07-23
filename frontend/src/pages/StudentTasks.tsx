import { useEffect, useState } from "react";
import "./StudentTasks.css";


type Assignment = {
    id:number;
    title:string;
    description:string;
    subject:string;
    deadline:string;
};


type Submission = {
    id:number;
    assignment_id:number;
    document_id:number;
    student_id:number;
};


function StudentTasks(){


    const [assignments,setAssignments] =
        useState<Assignment[]>([]);


    const [submissions,setSubmissions] =
        useState<Submission[]>([]);


    const [selectedFile,setSelectedFile] =
        useState<File | null>(null);


    const [selectedAssignment,setSelectedAssignment] =
        useState<number | null>(null);



    const token =
        localStorage.getItem("token");



    const fetchAssignments = async()=>{

        try{

            const response =
            await fetch(
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



    const fetchSubmissions = async()=>{

        try{

            const response =
            await fetch(
                "http://127.0.0.1:8000/submissions",
                {
                    headers:{
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );


            const data =
            await response.json();


            setSubmissions(data);

        }
        catch(error){
            console.log(error);
        }

    };



    useEffect(()=>{

        fetchAssignments();
        fetchSubmissions();

    },[]);





    const handleSubmit = async()=>{


        if(!selectedAssignment){
            alert("Select assignment");
            return;
        }


        if(!selectedFile){
            alert("Select file");
            return;
        }



        /*
          Currently backend expects:
          assignment_id
          document_id

          File upload API will create document_id
          after integrating upload.
        */


        try{


            const response =
            await fetch(
                "http://127.0.0.1:8000/submissions",
                {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    Authorization:
                    `Bearer ${token}`

                },


                body:JSON.stringify({

                    assignment_id:
                    selectedAssignment,


                    document_id:1

                })

                }
            );



            const data =
            await response.json();


            console.log(data);


            alert(
                "Assignment Submitted"
            );


            fetchSubmissions();


            setSelectedFile(null);
            setSelectedAssignment(null);


        }
        catch(error){

            console.log(error);

        }

    };





return(

<div className="student-task-container">


<h2>
Student Tasks
</h2>



<div className="student-grid">



<div className="student-card">


<h3>
Available Assignments
</h3>



{
assignments.length===0 ?

<p>
No assignments available
</p>


:

assignments.map((assignment)=>(


<div
className="assignment-box"
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
{assignment.description}
</p>


<p>
<b>Deadline:</b>
{assignment.deadline}
</p>



<button

onClick={()=>{

setSelectedAssignment(
assignment.id
)

}}

>

Select

</button>



</div>


))

}


</div>






<div className="student-card">


<h3>
Submit Assignment
</h3>



<input
type="file"

onChange={(e)=>{

if(e.target.files)
setSelectedFile(
e.target.files[0]
);

}}

/>



{
selectedFile &&

<p>
Selected:
{selectedFile.name}
</p>

}



<button
onClick={handleSubmit}
>

Submit

</button>


</div>






<div className="student-card">


<h3>
My Submissions
</h3>



{
submissions.length===0 ?

<p>
No submissions
</p>


:

submissions.map((submission)=>(


<div
className="submission-box"
key={submission.id}
>

<p>
Submission ID:
{submission.id}
</p>


<p>
Assignment ID:
{submission.assignment_id}
</p>


<p>
Document ID:
{submission.document_id}
</p>


</div>


))

}


</div>



</div>


</div>

)


}


export default StudentTasks;