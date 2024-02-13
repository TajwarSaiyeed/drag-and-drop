import {NextResponse} from "next/server";
import {DocumentProcessorServiceClient} from "@google-cloud/documentai";

import credentials from "@/sibaa-413812-c43b5cafc4da.json";
import {getFileType} from "@/lib/utils";

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
        const fileType = getFileType(file.name);

        const [response] = await client.processDocument({
            name: "projects/sibaa-413812/locations/us/processors/ec149a3f9d4a6f12",
            inlineDocument: {
                content: buffer.toString("base64"),
                mimeType: fileType,
            },
        });

        return NextResponse.json({
            success: true,
            response,
        }, {status: 200});
    } catch
        (error: Error | any) {
        console.error(error);
        return NextResponse.json("Something went wrong", {status: 500})
    }
}

