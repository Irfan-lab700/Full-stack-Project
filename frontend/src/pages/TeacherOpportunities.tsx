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


    const [company,setCompany] = useState("");
    const [role,setRole] = useState("");
    const [skills,setSkills] = useState("");
    const [description,setDescription] = useState("");
    const [deadline,setDeadline] = useState("");

const fetchOpportunities = async()=>{

    const token =
    localStorage.getItem("token");

    const response = await fetch(
        "http://127.0.0.1:8000/opportunities",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    setOpportunities(data);

};



    const createOpportunity = async()=>{

        const token =
        localStorage.getItem("token");


        await fetch(
        "http://127.0.0.1:8000/opportunities",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },

            body:JSON.stringify({

                company_name:company,
                role,
                skills,
                description,
                deadline,
                status:"Live"

            })
        });


        fetchOpportunities();

        setCompany("");
        setRole("");
        setSkills("");
        setDescription("");
        setDeadline("");

    };



    const deleteOpportunity = async(id:number)=>{

        const token =
        localStorage.getItem("token");
        console.log(localStorage.getItem("token"));


        await fetch(
        `http://127.0.0.1:8000/opportunities/${id}`,
        {
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        


        fetchOpportunities();

    };



return(

<div className="opportunity-container">

<h2>Create Opportunity</h2>


<input
placeholder="Company Name"
value={company}
onChange={(e)=>setCompany(e.target.value)}
/>


<input
placeholder="Role"
value={role}
onChange={(e)=>setRole(e.target.value)}
/>


<input
placeholder="Required Skills"
value={skills}
onChange={(e)=>setSkills(e.target.value)}
/>


<input
type="date"
value={deadline}
onChange={(e)=>setDeadline(e.target.value)}
/>


<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>



<button onClick={createOpportunity}>
Post Opportunity
</button>



<h2>Your Opportunities</h2>


{
opportunities.map((item)=>(

<div className="opportunity-card"
key={item.id}>


<h3>
{item.company_name}
</h3>

<p>
Role: {item.role}
</p>

<p>
Skills: {item.skills}
</p>

<p>
Status: {item.status}
</p>


<button
onClick={()=>deleteOpportunity(item.id)}
>
Delete
</button>


</div>


))
}


</div>

)


}


export default TeacherOpportunities;