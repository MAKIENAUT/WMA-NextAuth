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
              <Button variant="ghost" className="font-medium">
                {session.user?.name || session.user?.email} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom">
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