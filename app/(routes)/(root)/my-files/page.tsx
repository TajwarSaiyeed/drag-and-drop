import { getMyFiles } from "@/actions/get-my-files";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "./components/columns";

const Page = async () => {
  const myFiles = await getMyFiles();
  return <div className='flex p-10'>
    <DataTable data={myFiles} columns={columns} />
  </div>;
};

export default Page;
