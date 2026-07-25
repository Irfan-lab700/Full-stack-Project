import {useEffect,useState} from "react";
import "./Opportunities.css";


type Opportunity={

id:number;
company_name:string;
role:string;
skills:string;
description:string;
deadline:string;
status:string;

}



function StudentOpportunities(){


const [opportunities,setOpportunities]
=
useState<Opportunity[]>([]);



useEffect(()=>{


const fetchData=async()=>{


const token=
localStorage.getItem("token");


const response=
await fetch(
"http://127.0.0.1:8000/opportunities",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);


const data=
await response.json();


setOpportunities(data);


}


fetchData();


},[]);



return(

<div className="opportunity-container">


<h2>
Available Opportunities
</h2>



{
opportunities
.filter(
(item)=>item.status==="Live"
)
.map((item)=>(


<div
className="opportunity-card"
key={item.id}
>


<h3>
{item.company_name}
</h3>


<p>
Role: {item.role}
</p>


<p>
Required Skills:
{item.skills}
</p>


<p>
{item.description}
</p>


<p>
Deadline:
{item.deadline}
</p>


<button>
Apply
</button>


</div>


))
}



</div>


)


}


export default StudentOpportunities;