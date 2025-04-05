// navbar-links.tsx
"use client";
import { ChevronDown } from "lucide-react";
import { Button } from "../atoms/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../atoms/ui/dropdown-menu";
import Link from "next/link";
import { Skeleton } from "../atoms/ui/skeleton";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface NavbarLinksProps {
  items: {
    title: string;
    url: string;
  }[];
  session: any;
  isLoading: boolean;
}

export default function NavbarLinks({
  items,
  session,
  isLoading,
}: NavbarLinksProps) {
  return (
    <ul className="hidden md:inline-flex md:gap-4">
      {items.map((item) => (
        <li key={item.title}>
          <Button asChild variant="link">
            <Link href={item.url}>{item.title}</Link>
          </Button>
        </li>
      ))}
      {isLoading ? (
        <li className="flex items-center justify-center">
          <Skeleton className="h-4 w-20" />
        </li>
      ) : !session ? (
        <li>
          <Button variant="link" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        </li>
      ) : (
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 p-1">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="Profile picture"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                  </div>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      )}
    </ul>
  );
}