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
import { NavbarLinksProps } from "@/types/navbar-links";
import { Skeleton } from "../atoms/ui/skeleton";

export default function NavbarLinks({
  items,
  data,
  isPending,
  isError,
  logoutMutation,
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
      {isPending ? (
        <li className="flex items-center justify-center">
          <Skeleton className="h-4 w-20" />
        </li>
      ) : isError || !data ? (
        <li>
          <Button variant="link" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </li>
      ) : (
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-medium">
                {data.user.name} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom">
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      )}
    </ul>
  );
}
