import {SignUp} from "@clerk/nextjs";

export default function Page() {
    return <div className={"w-full min-h-screen mx-auto flex justify-center items-center"}>
        <SignUp/>
    </div>
}