import {NextResponse} from "next/server";
import {DocumentProcessorServiceClient} from "@google-cloud/documentai";

import credentials from "@/sibaa-413812-c43b5cafc4da.json";
import {getFileType} from "@/lib/utils";
import {UTApi} from "uploadthing/server";
import {auth} from "@clerk/nextjs";
import supabase from "@/utils/supabase/client";

const client = new DocumentProcessorServiceClient({
    credentials: credentials,
});

export async function POST(req: Request) {
    try {
        const {userId} = auth();
        const data = await req.formData();

        interface CustomFile extends File {
            customId: string;
        }

        const file: CustomFile | null = data.get("file") as unknown as CustomFile;

        if (!file || !userId) {
            return NextResponse.json({success: false});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileType = getFileType(file.name);

        const ut = new UTApi();
        const {data: fileData} = await ut.uploadFiles(file);

        await supabase.from("files").insert({
            user_id: userId,
            file_key: fileData.key,
            file_name: fileData.name,
            file_url: fileData.url,
            type: fileData.type,
        });

        const [response] = await client.processDocument({
            name: "projects/sibaa-413812/locations/us/processors/ec149a3f9d4a6f12",
            inlineDocument: {
                content: buffer.toString("base64"),
                mimeType: fileType,
            },
        });

        return NextResponse.json(
            {
                success: true,
                response,
                file_key: fileData.key,
            },
            {status: 200}
        );
    } catch (error: Error | any) {
        console.error(error);
        return NextResponse.json("Something went wrong", {status: 500});
    }
}


export async function PATCH(req: Request) {
    try {
        const {userId} = auth();
        const data = await req.formData();

        const fileKey = req.url.split("=")[1]

        interface CustomFile extends File {
            customId: string;
            fileName: string;
        }

        const file: CustomFile | null = data.get("file") as unknown as CustomFile;
        if (!file || !userId) {
            return NextResponse.json({success: false});
        }

        const ut = new UTApi();
        const {data: fileData} = await ut.uploadFiles(file);

        await supabase.from("files").update({
            resulted_file: fileData.url
        }).eq("file_key", fileKey);

        return NextResponse.json("OK");
    } catch (error: Error | any) {
        console.error(error);
        return NextResponse.json("Something went wrong", {status: 500});
    }
}

