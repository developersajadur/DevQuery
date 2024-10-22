// import { ConnectDB } from "@/lib/ConnectDB";
// import { NextResponse } from "next/server";

// export const POST = async (request) => {
//     const { userId, participantId } = await request.json();
//     const db = await ConnectDB();
//     const participantsCollection = db.collection("participants");

//     try {
//         // Check if the participant already exists for the user
//         const existingParticipant = await participantsCollection.findOne({
//             userId: userId,
//             "participants.participantsId": participantId
//         });

//         if (existingParticipant) {
//             return NextResponse.json({ message: 'Participant already exists', status: 200 });
//         }

//         // Add the participant to the user's participants list
//         const result = await participantsCollection.updateOne(
//             { userId: userId },
//             { $push: { participants: { participantsId: participantId } } },
//             { upsert: true }
//         );

//         return NextResponse.json({ status: 200 });
//     } catch (error) {
//         return NextResponse.json(
//             {
//                 message: 'Failed to add participant',
//                 error: error.message,
//             },
//             { status: 500 }
//         );
//     }
// };
