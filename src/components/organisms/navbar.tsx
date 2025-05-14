// navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "../atoms/ui/sidebar";
import WMASidebar from "../atoms/wma-sidebar";
import NavbarLinks from "../molecules/navbar-links";
import { Button } from "../atoms/ui/button";
import { useSession } from "next-auth/react";

const menu_items = [
  {
    title: "Blogs",
    url: "/blogs",
  },
  {
    title: "About Us",
    url: "/about-us",
  },
  {
    title: "Services",
    url: "/services",
  },
];

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-white px-4 py-2 sm:px-8 sm:py-4 lg:max-h-20 xl:px-20">
        <Button asChild variant="logo">
          <Link href="/">
            <Image
              src="/wma-logo.png"
              width={1000}
              height={1000}
              className="max-h-10 w-auto md:max-h-12"
              alt="WMA logo"
            />
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <NavbarLinks
            items={menu_items}
            session={session}
            isLoading={status === "loading"}
          />
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </nav>
      <WMASidebar
        items={menu_items}
        session={session}
        isLoading={status === "loading"}
      />
    </>
  );
}
