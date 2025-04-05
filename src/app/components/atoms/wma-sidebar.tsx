// wma-sidebar.tsx
"use client";

import { Button } from "./ui/button";
import { ChevronUp, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar } from "./ui/sidebar";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface WMASidebarProps {
  items: {
    title: string;
    url: string;
  }[];
  session: any;
  isLoading: boolean;
}

export default function WMASidebar({
  items,
  session,
  isLoading,
}: WMASidebarProps) {
  const { toggleSidebar, isMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sidebar side="right">
        <SidebarHeader>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X />
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild variant="outline">
                      <Link href={item.url} onClick={toggleSidebar}>
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : !session ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  variant="outline"
                  onClick={toggleSidebar}
                >
                  <Link href="/signin">Sign in</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="gap-2">
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
                      <ChevronUp className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top">
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
  }
  return null;
}