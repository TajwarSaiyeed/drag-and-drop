import Navbar from "@/components/navbar";
import {ReactNode} from "react";


export default function MainLayout({children}: { children: ReactNode; }) {
    return (
        <>
            <Navbar/>
            <main className={"w-full mx-auto"}>{children}</main>
        </>
    );
}