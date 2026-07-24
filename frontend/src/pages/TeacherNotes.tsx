import { useEffect, useState } from "react";
import "./TeacherNotes.css";

type DocumentType = {
  id: number;
  filename: string;
  subject: string;
};


function TeacherNotes() {


  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);


  const [subject, setSubject] =
    useState("");


  const [message, setMessage] =
    useState("");


  const [documents, setDocuments] =
    useState<DocumentType[]>([]);



  const fetchDocuments = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) return;


    try {

      const response = await fetch(
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


    } catch(error){

      console.log(error);

    }

  };



  useEffect(()=>{

    fetchDocuments();

  },[]);





  const handleUpload = async()=>{


    if(!selectedFile){

      setMessage("Please select PDF");

      return;

    }


    if(!subject.trim()){

      setMessage("Enter subject");

      return;

    }



    const token =
      localStorage.getItem("token");



    const formData =
      new FormData();



    formData.append(
      "subject",
      subject
    );


    formData.append(
      "file",
      selectedFile
    );



    try{


      const response =
        await fetch(
          "http://127.0.0.1:8000/upload-document",
          {
            method:"POST",

            headers:{
              Authorization:
                `Bearer ${token}`,
            },

            body:formData,

          }
        );



      const data =
        await response.json();



      setMessage(data.message);



      setSelectedFile(null);

      setSubject("");



      fetchDocuments();



    }
    catch{

      setMessage("Upload Failed");

    }


  };






  const handleDelete = async(
    documentId:number
  )=>{


    const token =
      localStorage.getItem("token");



    await fetch(
      `http://127.0.0.1:8000/documents/${documentId}`,
      {

        method:"DELETE",

        headers:{
          Authorization:
            `Bearer ${token}`,
        },

      }
    );



    fetchDocuments();


  };





return (

<div className="teacher-notes-container">


<h2>Manage Notes</h2>




<div className="upload-note-card">


<h3>
Upload New Note
</h3>



<input

type="text"

placeholder="Enter Subject"

value={subject}

onChange={(e)=>
setSubject(e.target.value)
}

/>



<input

type="file"

accept=".pdf"

onChange={(e)=>{

if(e.target.files){

setSelectedFile(
e.target.files[0]
);

}

}}

/>



{
selectedFile &&

<p>
Selected: {selectedFile.name}
</p>

}




<button

className="upload-btn"

onClick={handleUpload}

>
Upload Note
</button>



<p>
{message}
</p>


</div>





<h3>Your Uploaded Notes</h3>




<div className="notes-grid">


{
documents.length===0 ? (

<p>
No notes uploaded
</p>

)

:

(

documents.map((doc)=>(


<div

className="teacher-note-card"

key={doc.id}

>


<h4>
{doc.subject}
</h4>



<p>
{doc.filename}
</p>



<button

className="delete-note-btn"

onClick={()=>
handleDelete(doc.id)
}

>

Delete

</button>



</div>


))

)

}



</div>



</div>

);

}


export default TeacherNotes;