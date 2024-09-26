import { ConnectDB } from "@/lib/ConnectDB"
import { NextResponse } from "next/server"

export const GET = async()=>{
    const db = await ConnectDB()
    const getBook = db.collection('bookmarks')
    // const { data: session, status } = useSession();
    // const user = session?.user;
    try {
        // const boolMail = request.nextUrl.searchParams.get("email")
        // if(!boolMail){
        //     return NextResponse.json({message:"Id is required"}, {status:404})
        // }
        const books = await getBook.find().toArray()
        return NextResponse.json({message: "Got it", books},{ status: 200})
    } catch (error) {
        return NextResponse.json({message:"Not Available", error: error.message}, { status:400})
    }
}