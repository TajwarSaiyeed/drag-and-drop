import {getMyFiles} from "@/actions/get-my-files";
import {DataTable} from "@/components/ui/DataTable";
import {columns} from "./components/columns";

export const revalidate = 1;
export const dynamic = "force-dynamic"

const Page = async () => {
    const myFiles = await getMyFiles();

    if (myFiles?.length === 0) {
        return <div className='flex p-10'>
            <h3>
                You have no files yet. Upload a file to get started.
            </h3>
        </div>
    }

    return <section className={'flex flex-col gap-2  p-10'}>
        <h3 className='text-2xl font-bold'>
            My Files
        </h3>
        <div className='flex justify-center overflow-x-auto w-full'>
            <DataTable data={myFiles || []} columns={columns}/>
        </div>
    </section>
}

export default Page;
