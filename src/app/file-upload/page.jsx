// "use client"
// import React, { useState } from "react";

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setUploadStatus(`Upload successful! File URL: ${data.url}`);
//       } else {
//         setUploadStatus(`Upload failed: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       setUploadStatus("An error occurred during upload.");
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       <p>{uploadStatus}</p>
//     </div>
//   );
// };

// export default FileUpload;
