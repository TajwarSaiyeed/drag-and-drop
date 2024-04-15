import { getMyFiles } from "@/actions/get-my-files";

const Page = async () => {
  const myFiles = await getMyFiles();


  return <div>My Files</div>;
};

export default Page;
