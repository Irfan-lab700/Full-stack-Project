import { useEffect, useState } from "react";
import "./Opportunities.css";


type Opportunity = {
    id:number;
    company_name:string;
    role:string;
    skills:string;
    description:string;
    deadline:string;
    status:string;
};



function TeacherOpportunities(){


    const [opportunities,setOpportunities] =
    useState<Opportunity[]>([]);


    const [company,setCompany] =
    useState("");

    const [role,setRole] =
    useState("");

    const [skills,setSkills] =
    useState("");

    const [description,setDescription] =
    useState("");

    const [deadline,setDeadline] =
    useState("");


    const [loading,setLoading] =
    useState(false);

    const [applyLink,setApplyLink] = useState("");



    const token =
    localStorage.getItem("token");



    const fetchOpportunities = async()=>{

        try{

            setLoading(true);


            const response =
            await fetch(
                "http://127.0.0.1:8000/opportunities",
                {
                    headers:{
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );


            const data =
            await response.json();


            setOpportunities(data);


        }
        catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }

    };




    useEffect(()=>{

        fetchOpportunities();

    },[]);





    const createOpportunity = async()=>{


        if(
            !company ||
            !role ||
            !skills ||
            !description ||
            !deadline
        ){

            alert(
                "Please fill all fields"
            );

            return;

        }



        try{


            await fetch(
                "http://127.0.0.1:8000/opportunities",
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json",

                        Authorization:
                        `Bearer ${token}`
                    },


                    body:JSON.stringify({

                        company_name:company,

                        role,

                        skills,

                        description,

                        deadline,

                        status:"Live",
                        apply_link:applyLink

                    })

                }
            );



            setCompany("");
            setRole("");
            setSkills("");
            setDescription("");
            setDeadline("");



            fetchOpportunities();


        }
        catch(error){

            console.log(error);

        }


    };






    const deleteOpportunity = async(
        id:number
    )=>{


        const confirmDelete =
        window.confirm(
            "Delete this opportunity?"
        );


        if(!confirmDelete)
            return;



        try{


            await fetch(

                `http://127.0.0.1:8000/opportunities/${id}`,

                {

                    method:"DELETE",

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );



            fetchOpportunities();


        }
        catch(error){

            console.log(error);

        }


    };






return(


<div className="opportunity-container">



<div className="opportunity-header">

<h2>
Opportunity Management
</h2>

<p>
Post internship and placement opportunities for students
</p>


</div>





<div className="opportunity-form">



<h3>
Create Opportunity
</h3>



<input

placeholder="Company Name"

value={company}

onChange={(e)=>
setCompany(e.target.value)
}

/>



<input

placeholder="Role"

value={role}

onChange={(e)=>
setRole(e.target.value)
}

/>



<input

placeholder="Required Skills (Python, React, ML)"

value={skills}

onChange={(e)=>
setSkills(e.target.value)
}

/>



<input

type="date"

value={deadline}

onChange={(e)=>
setDeadline(e.target.value)
}

/>



<textarea

placeholder="Opportunity Description"

value={description}

onChange={(e)=>
setDescription(e.target.value)
}

/>

<input
placeholder="Application Link"
value={applyLink}
onChange={(e)=>
setApplyLink(e.target.value)
}
/>



<button
onClick={createOpportunity}
>

Post Opportunity

</button>



</div>






<div className="opportunity-list">



<h3>
Your Opportunities
</h3>




{
loading ?


<p>
Loading opportunities...
</p>



:

opportunities.length===0 ?


<p>
No opportunities posted yet
</p>



:


opportunities.map((item)=>(


<div
className="opportunity-card"
key={item.id}
>



<div className="card-top">


<h3>
{item.company_name}
</h3>


<span className="status-badge">

{item.status}

</span>


</div>





<p>
<b>Role:</b>
{item.role}
</p>



<p>
<b>Skills:</b>
{item.skills}
</p>



<p>
<b>Deadline:</b>
{item.deadline}
</p>



<p>
{item.description}
</p>




<button

className="delete-btn"

onClick={()=>
deleteOpportunity(item.id)
}

>

Delete

</button>




</div>


))


}



</div>




</div>


)


}


export default TeacherOpportunities;