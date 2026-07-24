import { useEffect, useState } from "react";
import "./StudentNotes.css";


type DocumentType = {
  id: number;
  filename: string;
  subject: string;
};



function StudentNotes() {


  const [documents, setDocuments] =
    useState<DocumentType[]>([]);



  const fetchDocuments = async()=>{


    const token =
      localStorage.getItem("token");



    if(!token) return;



    try{


      const response =
        await fetch(
          "http://127.0.0.1:8000/documents",
          {

            headers:{
              Authorization:
                `Bearer ${token}`,
            },

          }
        );



      const data =
        await response.json();



      setDocuments(data);



    }
    catch(error){

      console.log(error);

    }


  };





  useEffect(()=>{

    fetchDocuments();

  },[]);






return (

<div className="student-notes-container">


<h2>
Available Notes
</h2>




<div className="notes-grid">



{
documents.length===0 ? (

<p>
No notes available
</p>

)

:

(

documents.map((doc)=>(


<div

className="note-card"

key={doc.id}

>


<h4>
{doc.subject}
</h4>



<p>
{doc.filename}
</p>




<button
  className="view-note-btn"
  onClick={() =>
    window.open(
 `http://127.0.0.1:8000/documents/view/${doc.id}`,
 "_blank"
)
  }
>
  View Note
</button>



</div>


))

)

}



</div>




</div>

);


}



export default StudentNotes;