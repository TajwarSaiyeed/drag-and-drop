'use client'
import React, {useState, ChangeEvent, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useRouter} from "next/navigation";

interface Range {
    from: number;
    to: number;
}


interface SplitpdfProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
}


interface SplitParams {
    ranges: Range[];

    [key: string]: any;  // or replace 'any' with more specific types if possible

}


const Splitpdf: React.FC<SplitpdfProps> = ({file}) => {

    const [ranges, setRanges] = useState<Range[]>([{from: 1, to: 1}]);
    const router = useRouter();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);
    const [splitParams, setSplitParams] = useState<SplitParams>();
    const [processedPdf, setProcessedPdf] = useState(null);


    // Function to update split parameters from Splitpdf
    const handleSplitParamsChange = (params: SplitParams) => {
        setSplitParams(params);
    };

    useEffect(() => {
        const params: SplitParams = {
            ranges,
        };

        setSplitParams(params);
        console.log("Split parameters updated:", params);

    }, [ranges]);


    const handlePDFUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            console.log("Uploading file:", file); // Log the file being uploaded

            setUploadedFile(file);

            // Create a URL for the file
            const fileURL = URL.createObjectURL(file);
            setPdfPreview(fileURL);

        }
    };


    const handleRangeChange = (index: number, type: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const newRanges = [...ranges];
        newRanges[index] = {
            ...newRanges[index],
            [type]: parseInt(event.target.value, 10)
        };
        setRanges(newRanges);
        console.log("Updated ranges:", newRanges); // Log the updated ranges
    };


    const handleSplitPDF = async () => {
        if (!uploadedFile || !splitParams) return;

        const formData = new FormData();
        formData.append('pdfFile', uploadedFile);
        // Append split parameters to formData
        // Adjust according to how your API expects these parameters
        if (splitParams) {

            Object.keys(splitParams).forEach(key => {
                if (splitParams[key] !== undefined) {
                    formData.append('ranges', JSON.stringify(splitParams.ranges));
                }
            });

            console.log("Sending request with:", {uploadedFile, splitParams}); // Log the request details


            try {
                const response = await axios.post('/api/splitpdf', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("API response:", response.data);

                setProcessedPdf(response.data);
            } catch (error: any) {
                console.error("API request error:", error); // Log any errors

                if (error?.response?.status === 403) {
                } else {
                }
            } finally {
                console.log("Refreshing the router.");

                router.refresh();
            }
        }

    }

    return (
        <div className=" max-w-100 p-20 mr-80 ml-80">
            <div>this is</div>
            {ranges.map((range, index) => (
                <div key={index} className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium">Range {index + 1}</label>
                    <input className="w-12 px-2 py-1 text-sm border rounded" type="number" placeholder="from page"
                           value={range.from} onChange={(e) => handleRangeChange(index, 'from', e)}/>
                </div>
            ))}

            <div className="col-span-12">
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex justify-center items-center p-5 border-2 border-dashed hover:bg-gray-100">
                        اسحب وأفلت صورتك هنا، أو انقر لاختيار ملف
                    </div>
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="pdf/*"
                    onChange={handlePDFUpload}
                    className="hidden"
                />
            </div>

            <Button onClick={handleSplitPDF} className="col-span-12 w-full">
                تقسيم الملف
            </Button>

        </div>


    )
}

export default Splitpdf