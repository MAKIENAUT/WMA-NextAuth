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
import {   Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, } from "./ui/sidebar";
import { signOut } from "next-auth/react";

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
                    <SidebarMenuButton>
                      {session.user?.name || session.user?.email} <ChevronUp className="ml-auto" />
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