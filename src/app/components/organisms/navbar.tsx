"use client";
import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "../atoms/ui/sidebar";
import WMASidebar from "../atoms/wma-sidebar";
import NavbarLinks from "../molecules/navbar-links";
import { useAuthContext } from "@/features/auth/components/auth-provider";
import { Button } from "../atoms/ui/button";

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

export type NavbarProps = {
  data: {
    title: string;
    url: string;
  }[];
};

export default function Navbar() {
  const { data, isPending, isError, logoutMutation } = useAuthContext();
  return (
    <>
      <nav className="fixed top-0 z-50 flex w-screen items-center justify-between bg-white p-2 sm:px-8 sm:py-4 lg:max-h-20 xl:px-20">
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
        <NavbarLinks
          items={menu_items}
          data={data}
          isPending={isPending}
          isError={isError}
          logoutMutation={logoutMutation}
        />
        <SidebarTrigger />
      </nav>
      <WMASidebar
        items={menu_items}
        data={data}
        isPending={isPending}
        isError={isError}
        logoutMutation={logoutMutation}
      />
    </>
  );
}
