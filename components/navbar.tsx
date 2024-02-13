"use client";
import Link from "next/link";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import {Separator} from "@/components/ui/separator"
import {buttonVariants} from "@/components/ui/button";

const Navbar = () => {
    return (
        <nav
            className={
                "flex border-b px-6 sm:px-10 h-14 items-center justify-between shadow-lg"
            }
        >
            <div className={"flex items-center gap-x-3 sm:gap-x-6"}>
                <Link
                    href={"/"}
                    className={
                        "flex items-center gap-x-2 font-bold uppercase text-teal-500"
                    }
                >
                    <Image src={"logo.svg"} width={120} alt="logo" height={100}/>
                </Link>
                <div className={"flex space-x-6"}>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link className={buttonVariants({
                                    variant: "link",
                                    size: "sm"
                                })} href={"/"}>
                                    MERGE PDF
                                </Link>
                            </NavigationMenuItem>
                            <Separator orientation="vertical" className={"h-5 mx-3"}/>
                            <NavigationMenuItem>
                                <Link
                                    className={buttonVariants({
                                        variant: "link",
                                        size: "sm"
                                    })}
                                    href={"/image-to-doc"}>Image to
                                    Doc</Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
