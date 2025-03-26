import { LogoutMutationProps } from "@/features/auth/types/logout-mutation";
import { DataProps } from "@/features/auth/types/user-data";

export type NavbarLinksProps = {
  items: { title: string; url: string }[];
  data: DataProps;
  isPending: boolean;
  isError: boolean;
  logoutMutation: LogoutMutationProps;
};
