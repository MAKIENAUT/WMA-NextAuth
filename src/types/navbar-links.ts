// Updated navbar-links.ts
import { Session } from "next-auth";

export type NavbarLinksProps = {
  items: { title: string; url: string }[];
  session: Session | null;
  isLoading: boolean;
};
