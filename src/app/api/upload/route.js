// import uploadThing from "@/utils/uploadthing";
// import { NextResponse } from "next/server";

// export const POST = async (request) => {
//     try {
//         const formData = await request.formData();
//         const file = formData.get("file"); // Assuming file input is named 'file'

//         if (!file) {
//             return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
//         }

//         // Upload file to UploadThing
//         const response = await uploadThing.upload(file);

//         // Check if the upload was successful
//         if (response && response.url) {
//             return NextResponse.json({ url: response.url, message: "File uploaded successfully" }, { status: 200 });
//         } else {
//             return NextResponse.json({ message: "Upload failed" }, { status: 500 });
//         }
//     } catch (error) {
//         console.error("Upload error:", error);
//         return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
//     }
// };
