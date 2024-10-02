import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server"; 

export const POST = async (req) => {
  const applyJob = await req.json();
//   console.log("Application Data:", applyJob);

  const db = await ConnectDB();
  const jobApplyCollection = db.collection("job-apply");

  try {
    const result = await jobApplyCollection.insertOne(applyJob);
    // console.log("Insertion Result:", result);

    return NextResponse.json({
      message: 'Job application submitted successfully',
      applicationId: result.insertedId,
    }, { status: 201 }); 
  } catch (error) {
    console.error("Error inserting job application:", error); 

    return NextResponse.json({
      message: 'Failed to apply for the job',
      error: error.message,
    }, { status: 500 });
  }
};
