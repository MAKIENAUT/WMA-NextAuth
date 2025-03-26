import ServiceTemplate from "@/app/components/templates/service-template";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | WMA",
  description: "",
};

export default function ServicesPage() {
  return <ServiceTemplate type="page" />;
}
