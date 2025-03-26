import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../atoms/ui/button";
import Link from "next/link";
import Facebook from "../../../public/facebook";
import Instagram from "../../../public/instagram";

function FooterGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-8 py-16 sm:flex-row", className)}>
      {children}
    </div>
  );
}

function FooterLogos() {
  const LOGOS = [
    { alt: "WMC logo", src: "/wmc-logo.png", className: "" },
    {
      alt: "USCIS logo",
      src: "/USCIS-logo.png",
      className: "bg-white p-2 rounded",
    },
    {
      alt: "DepEd logo",
      src: "/us-deped-logo.svg",
      className: "bg-white p-2 rounded",
    },
    { alt: "DOL logo", src: "/DOL-logo.svg", className: "" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 px-4 sm:order-last sm:basis-full">
      {LOGOS.map((logo) => (
        <FooterLogoItem
          key={logo.src}
          alt={logo.alt}
          src={logo.src}
          className={logo.className}
        />
      ))}
    </div>
  );
}

type FooterLogoItemProps = {
  alt: string;
  src: string;
  className: string;
};

function FooterLogoItem({ alt, src, className }: FooterLogoItemProps) {
  return (
    <div className="flex items-center justify-center">
      <Image
        alt={alt}
        src={src}
        width={1000}
        height={1000}
        className={cn("h-auto max-h-28 w-auto xl:max-w-64", className)}
      />
    </div>
  );
}

function FooterLinkGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}

function FooterLink({
  url,
  content,
}: {
  url: string;
  content: string | ReactNode;
}) {
  return (
    <Button asChild variant="link-footer" size="none">
      <Link href={url}>{content}</Link>
    </Button>
  );
}

export default function Footer() {
  return (
    <footer className="flex w-screen flex-col divide-y divide-wma-teal bg-wma-footer px-4 text-white sm:px-8 xl:px-20">
      <FooterGroup className="pb-8">
        <FooterLogos />
        <div className="flex flex-col gap-4 sm:basis-full">
          <Image
            src="/wma-logo.png"
            width={1000}
            height={1000}
            className="h-auto w-full max-w-[30rem]"
            alt="WMA logo"
          />
          <p className="sm:text-sm md:text-base">
            West Migration Agency LLC (“WMA”) is the parent company of West
            Migration Consultancy Inc.,(“WMC”) based in the Philippines. WMC and
            its state affiliates advance the corporation&apos;s interest to
            engage in immigration consultancy by providing expert advice to
            prospective clients for the USA through qualification assistance,
            processing of applications, and other related documents.
          </p>
        </div>
      </FooterGroup>

      <FooterGroup className="py-8 sm:gap-16">
        <FooterLinkGroup>
          <FooterLink url="/news" content="News" />
          <FooterLink url="/services" content="Services" />
          <FooterLink url="/about-us" content="About Us" />
          <FooterLink url="#" content="Administrator" />
        </FooterLinkGroup>
        <FooterLinkGroup>
          <FooterLink url="/services/family-based" content="Family Based" />
          <FooterLink
            url="/services/study-and-exchange"
            content="Study And Exchange"
          />
          <FooterLink
            url="/services/temporary-employment"
            content="Temporary Employment"
          />
        </FooterLinkGroup>
        <FooterLinkGroup className="flex-row gap-6">
          <FooterLink
            url="#"
            content={
              <Facebook className="size-8 fill-white hover:fill-wma-gold active:fill-wma-darkGold" />
            }
          />
          <FooterLink
            url="#"
            content={
              <Instagram className="size-8 fill-white hover:fill-wma-gold active:fill-wma-darkGold" />
            }
          />
        </FooterLinkGroup>
      </FooterGroup>

      <FooterGroup className="items-center justify-center py-8">
        <p className="text-center text-sm">
          West Migration Agency LLC © {new Date().getFullYear()}. All Rights
          Reserved. Design & Development by OrbWeaver
        </p>
      </FooterGroup>
    </footer>
  );
}
