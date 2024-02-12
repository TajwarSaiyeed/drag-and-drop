"use client";
import Link from "next/link";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import {forwardRef} from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator"


const ListItem = forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});

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
                                <Link className="text-primary font-semibold text-sm" href={"/"}>
                                    MERGE PDF
                                </Link>
                            </NavigationMenuItem>
                            <Separator orientation="vertical" />
                            <NavigationMenuItem>
                                <Link className="text-primary font-semibold text-sm" href={"/image-to-doc"}>Image to
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
