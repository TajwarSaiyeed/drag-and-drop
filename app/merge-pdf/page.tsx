// // "use client";
// //
// // import * as z from "zod";
// // import axios from "axios";
// // import Image from "next/image";
// // import {useState, useEffect} from "react";
// // import {toast} from "react-hot-toast";
// // import {useRouter} from "next/navigation";
// //
// // import {Button} from "@/components/ui/button";
// // import {Card, CardFooter} from "@/components/ui/card";
// // import {Input} from "@/components/ui/input";
// // import Loader from "@/components/ui/loader";
// // // import {useProModal} from "@/hooks/use-pro-modal";
// //
// //
// // import {DragDropContext, Droppable, Draggable} from "@hello-pangea/dnd";
// // import Link from "next/link";
// //
// // const Mergepdf = () => {
// //     // const proModal = useProModal();
// //     const router = useRouter();
// //     // const { isSignedIn, openSignIn } = useUser();
// //     // const [selectedFiles, setSelectedFiles] = useState([]);
// //     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
// //
// //     // const [previewUrls, setPreviewUrls] = useState<string[]>([]);
// //     const [thumbnails, setThumbnails] = useState<string[]>([]); // Store thumbnail data URLs
// //
// //     const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
// //
// //
// //     // Generate thumbnails when files change
// //     useEffect(() => {
// //
// //         const placeholderThumbnail = '/home.png'; // Corrected path
// //
// //         // Set the placeholder image for each selected file
// //         const thumbs = selectedFiles.map(() => placeholderThumbnail);
// //         setThumbnails(thumbs);
// //     }, [selectedFiles]);
// //
// //
// //     // Handle file selection and generate previews
// //     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //         if (event.target.files) {
// //             const files = Array.from(event.target.files);
// //             setSelectedFiles(files);
// //
// //             //   const urls  = files.map(file => URL.createObjectURL(file));
// //             //   setPreviewUrls(urls);
// //             // }
// //         }
// //     }
// //     const onDragEnd = (result: any) => {
// //         if (!result.destination) return;
// //
// //         const newFilesArray = Array.from(selectedFiles);
// //         const newThumbnailsArray = Array.from(thumbnails);
// //         const [reorderedFile] = newFilesArray.splice(result.source.index, 1);
// //         const [reorderedThumbnail] = newThumbnailsArray.splice(result.source.index, 1);
// //
// //         newFilesArray.splice(result.destination.index, 0, reorderedFile);
// //         newThumbnailsArray.splice(result.destination.index, 0, reorderedThumbnail);
// //
// //         setSelectedFiles(newFilesArray);
// //         setThumbnails(newThumbnailsArray);
// //     };
// //
// //     // Submit files to the backend
// //     const handleSubmit = async () => {
// //         const formData = new FormData();
// //
// //         selectedFiles.forEach(file => {
// //             formData.append('file', file);
// //         });
// //
// //
// //         try {
// //             const response = await axios.post('/api/pdf/mergepdf', formData, {
// //                 headers: {
// //                     'Content-Type': 'multipart/form-data',
// //                 },
// //             });
// //             console.log('Upload successful', response.data);
// //
// //             setMergedPdfUrl(response.data.mergedFileUrl);
// //
// //
// //         } catch (error) {
// //             console.error('Error uploading files:', error);
// //         }
// //     };
// //
// //     return (
// //
// //         <>
// //             <div className="mr-80 pr-80 mt-20 pt-20">
// //                 <input
// //                     type="file"
// //                     accept="application/pdf"
// //                     multiple
// //                     onChange={handleFileChange}
// //                 />
// //                 <button onClick={handleSubmit}>Upload</button>
// //                 <div className="flex flex-wrap">
// //                     {previewUrls.map((url, index) => (
// //                         <div key={index} className="p-4">
// //                             <div className="border rounded-lg shadow-sm overflow-hidden">
// //                                 <div className="flex items-center justify-between p-4">
// //                                     <div className="flex items-center">
// //
// //                                         <div className="ml-4">
// //                                             <div className="text-sm font-medium text-gray-900">
// //                                                 {selectedFiles[index]?.name}
// //                                             </div>
// //                                             <div className="text-sm text-gray-500">
// //                                                 {selectedFiles[index]?.size} bytes
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                     <button
// //                                         className="bg-transparent border-0 text-gray-400 hover:text-gray-500"
// //                                     >
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </>
// //     );
// // };
// //
// //
// //                     {previewUrls.map((url, index) => (
// //                         <div key={index} style={{margin: '10px 0'}}>
// //                             <embed src={url} type="application/pdf" width="500" height="600"/>
// //                         </div>
// //                     ))}
// //             </div>
// //             <div className="mr-80 pr-80 mt-20 pt-20">
// //                 <input type="file" accept="application/pdf" multiple onChange={handleFileChange}/>
// //                 <button onClick={handleSubmit}>Upload</button>
// //                 {mergedPdfUrl && (
// //                     <div className="mt-4">
// //                         <Link href={mergedPdfUrl} download="MergedDocument.pdf" className="button-class-names">
// //                             Download Merged PDF
// //                         </Link>
// //                     </div>
// //                 )}
// //
// //                 <DragDropContext onDragEnd={onDragEnd}>
// //                     <Droppable droppableId="thumbnails">
// //                         {(provided) => (
// //                             <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap">
// //                                 {thumbnails.map((thumb, index) => (
// //                                     <Draggable key={selectedFiles[index].name}
// //                                                draggableId={selectedFiles[index].name} index={index}>
// //                                         {(provided) => (
// //                                             <div
// //                                                 ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
// //                                                 className="p-4">
// //                                                 <div className="border rounded-lg shadow-sm overflow-hidden">
// //                                                     <Image src={thumb} alt={`Thumbnail ${index + 1}`} width={96}
// //                                                            height={128} className="w-24 h-32"/>
// //                                                     <div
// //                                                         className="text-sm font-medium text-gray-900">{selectedFiles[index]?.name}</div>
// //                                                     <div
// //                                                         className="text-sm text-gray-500">{selectedFiles[index]?.size} bytes
// //                                                     </div>
// //                                                 </div>
// //                                             </div>
// //                                         )}
// //                                     </Draggable>
// //                                 ))}
// //                                 {provided.placeholder}
// //                             </div>
// //                         )}
// //                     </Droppable>
// //                 </DragDropContext>
// //             </div>
// //         </>
// //     );
// // };
// //
// // export default Mergepdf;
//
//
// "use client";
//
// import * as z from "zod";
// import axios from "axios";
// import Image from "next/image";
// import {useState} from "react";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {Download, ImageIcon} from "lucide-react";
// import {useForm} from "react-hook-form";
// import {toast} from "react-hot-toast";
// import {useRouter} from "next/navigation";
//
// import {Button} from "@/components/ui/button";
// import {Card, CardFooter} from "@/components/ui/card";
// import {Input} from "@/components/ui/input";
// import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
// import {Loader} from "@/components/loader";
// import {Empty} from "@/components/ui/empty";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
// // import {useProModal} from "@/hooks/use-pro-modal";
//
// import {amountOptions, formSchema, resolutionOptions} from "./constants";
//
//
// const Mergepdf = () => {
//     const proModal = useProModal();
//     const router = useRouter();
//     const [photos, setPhotos] = useState<string[]>([]);
//     // const { isSignedIn, openSignIn } = useUser();
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [previewUrls, setPreviewUrls] = useState<string[]>([]);
//
//
//     const handleFileChange = (event) => {
//         if (event.target.files) {
//             setSelectedFiles(Array.from(event.target.files));
//         }
//     };
//
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             prompt: "",
//             amount: "1",
//             resolution: "512x512"
//         }
//     });
//
//     const isLoading = form.formState.isSubmitting;
//
//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         console.log("Form values:", values); // Log the form values
//
//         const formData = new FormData();
//
//         // Append the form fields
//         Object.keys(values).forEach(key => {
//             formData.append(key, values[key]);
//         });
//
//         selectedFiles.forEach((file) => {
//             formData.append('file', file); // Use 'file' for all files
//         });
//
//         // Log FormData contents
//         let specIterableIterator = formData.entries();
//         for (let [key, value] of specIterableIterator) {
//             console.log(key, value);
//         }
//
//         // if (!isSignedIn) {
//         //   // Open the Clerk sign-in modal if the user is not signed in
//         //   openSignIn();
//         //   return;
//         // }
//         try {
//             setPhotos([]);
//
//             const response = await axios.post('/api/pdf/mergepdf', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//
//             const urls = response.data.map((image: { url: string }) => image.url);
//
//             setPhotos(urls);
//         } catch (error: any) {
//             if (error?.response?.status === 403) {
//                 proModal.onOpen();
//             } else {
//                 toast.error("Something went wrong.");
//             }
//         } finally {
//             router.refresh();
//         }
//     }
//
//     return (
//         <div className="  md:mr-80 justify-center  ">
//
//             <div className="px-4 lg:px-8">
//
//                 <Form {...form}>
//                     <form
//                         onSubmit={form.handleSubmit(onSubmit)}
//                         className="
//               rounded-lg
//               border
//               w-full
//               p-4
//               px-3
//               md:px-6
//               focus-within:shadow-sm
//               grid
//               grid-cols-12
//               gap-2
//             "
//                     >
//
//                         <FormField
//                             name="prompt"
//                             render={({field}) => (
//                                 <FormItem className="col-span-12 lg:col-span-6">
//                                     <FormControl className="m-0 p-0">
//                                         <Input
//                                             className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
//                                             disabled={isLoading}
//                                             placeholder="صورة حصان في المروج"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="amount"
//                             render={({field}) => (
//                                 <FormItem className="col-span-12 lg:col-span-2">
//                                     <Select
//                                         disabled={isLoading}
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue defaultValue={field.value}/>
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {amountOptions.map((option) => (
//                                                 <SelectItem
//                                                     key={option.value}
//                                                     value={option.value}
//                                                 >
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="resolution"
//                             render={({field}) => (
//                                 <FormItem className="col-span-12 lg:col-span-2">
//                                     <Select
//                                         disabled={isLoading}
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                         defaultValue={field.value}
//                                     >
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue defaultValue={field.value}/>
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {resolutionOptions.map((option) => (
//                                                 <SelectItem
//                                                     key={option.value}
//                                                     value={option.value}
//                                                 >
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </FormItem>
//                             )}
//                         />
//
//
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             multiple
//                             onChange={handleFileChange} // A function to handle file selection
//                         />
//                         <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading}
//                                 size="icon">
//                             إنشاء
//                         </Button>
//                     </form>
//                 </Form>
//                 {isLoading && (
//                     <div className="p-20">
//                         <Loader/>
//                     </div>
//                 )}
//                 {photos.length === 0 && !isLoading && (
//                     <Empty label="لم يتم انشاء أي صورة"/>
//                 )}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
//                     {photos.map((src) => (
//                         <Card key={src} className="rounded-lg overflow-hidden">
//                             <div className="relative aspect-square">
//                                 <Image
//                                     fill
//                                     alt="generate"
//                                     src={src}
//                                 />
//                             </div>
//                             <CardFooter className="p-2">
//
//                             </CardFooter>
//                         </Card>
//                     ))}
//
//                 </div>
//
//             </div>
//         </div>
//     );
// }
//
// export default Mergepdf;