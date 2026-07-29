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
apply_link:string;

}



function StudentOpportunities(){


const [opportunities,setOpportunities]
=
useState<Opportunity[]>([]);


const [loading,setLoading]
=
useState(true);




useEffect(()=>{


const fetchData=async()=>{


try{


const token=
localStorage.getItem("token");


const response=
await fetch(
"http://127.0.0.1:8000/opportunities",
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);



const data=
await response.json();


setOpportunities(data);


}
catch(error){

console.log(error);

}

finally{

setLoading(false);

}


}



fetchData();


},[]);





return(

<div className="opportunity-container">



<div className="opportunity-header">

<h2>
Available Opportunities
</h2>

<p>
Explore internships and placement opportunities
</p>

</div>





<div className="opportunity-list">



{
loading ?


<p>
Loading opportunities...
</p>



:

opportunities.filter(
(item)=>
item.status==="Live"
).length===0 ?


<p>
No opportunities available currently
</p>



:


opportunities

.filter(
(item)=>
item.status==="Live"
)

.map((item)=>(



<div

className="opportunity-card"

key={item.id}

>



<div className="card-top">


<h3>
{item.company_name}
</h3>


<span className="status-badge">
Live
</span>


</div>




<p>
<b>Role:</b>
{" "}
{item.role}
</p>



<p>
<b>Required Skills:</b>
{" "}
{item.skills}
</p>



<p>
{item.description}
</p>



<p>
<b>Deadline:</b>
{" "}
{item.deadline}
</p>





{
item.apply_link &&

<a
href={item.apply_link}
target="_blank"
rel="noreferrer"
>

<button className="apply-btn">
Apply Now
</button>

</a>

}




</div>



))


}



</div>



</div>


)


}


export default StudentOpportunities;