import {NextResponse} from "next/server";
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request) {
    try {
        const data = await req.formData();

        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({success: false});
        }

        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);
        const encodedDocument = buffer.toString('base64');


    } catch
        (error: Error | any) {

        return NextResponse.json("Something went wrong", {status: 500})
    }
}