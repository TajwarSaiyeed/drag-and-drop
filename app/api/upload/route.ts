import {NextResponse} from "next/server";
import credentials from "@/key.json"
import {DocumentProcessorServiceClient} from "@google-cloud/documentai";

const client = new DocumentProcessorServiceClient({
    credentials: credentials,
})


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


        const [response] = await client.processDocument({
            inlineDocument: {
                content: buffer.toString("base64"),
            },
        });


        console.log(response)

        return NextResponse.json({success: true});
    } catch
        (error: Error | any) {
        console.error(error);
        return NextResponse.json("Something went wrong", {status: 500})
    }
}