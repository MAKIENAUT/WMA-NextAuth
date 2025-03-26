import { Button } from "@/components/atoms/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { dm_sans } from "@/lib/fonts";
import { ReactNode } from "react";
import Image from "next/image";
import { orelega_one } from "@/lib/fonts";

const services = [
  {
    title: "Study And Exchange",
    description:
      "Our study and exchange programs offer excellent opportunities for those looking to further their education or gain international experience. We work with top universities and institutions worldwide to provide our clients with access to high-quality educational programs. In addition, we work with different school districts across the United States that partner with visa sponsors. Our team is committed to helping you find the program that best suits your needs and supports you throughout the application process.",
    imageUrl: "/student-services.jpg",
    buttonLabel: "Learn more",
    route: "/services/study-and-exchange",
  },
  {
    title: "Family Based",
    description:
      "Family is important to us, and we understand the challenges of family-based petitions. That's why we offer a personalized approach to help reunite families. Our experienced team will guide you through the process, from filing the petition to preparing for the interview. We understand the emotional, and legal complexities involved and are here to support you every step of the way.",
    imageUrl: "/family-services.jpg",
    buttonLabel: "Learn more",
    route: "/services/family-based",
  },
  {
    title: "Temporary Employment",
    description:
      "We also offer temporary employment services, which can be an excellent option for individuals looking to gain work experience, explore new industries, or earn extra income. Our team works with employers across various industries to provide opportunities for our clients. We take the time to understand your skills and career goals to match you with the right temporary job.",
    imageUrl: "/forklift-services.jpg",
    buttonLabel: "Learn more",
    route: "/services/temporary-employment",
  },
  {
    title: "Web Development",
    description:
      "Our web development services are tailored to bring your digital vision to life. Whether you need a simple website or a complex web application, our team of skilled developers specializes in creating responsive, user-friendly, and scalable solutions. We work closely with you to ensure the design and functionality align perfectly with your business goals.",
    imageUrl: "/web-development.jpg",
    buttonLabel: "Explore now",
    route: "/services/web-development",
  },
];

type ServicesHeadingProps = {
  children: ReactNode;
  level?: "h1" | "h2" | "h3";
  className?: string;
};

function ServicesHeading({
  children,
  level = "h2",
  className,
}: ServicesHeadingProps) {
  const Tag = level;
  return (
    <Tag
      className={cn(
        `text-2xl font-bold text-wma-darkTeal ${dm_sans.className} md:text-3xl xl:text-4xl`,
        className
      )}
    >
      {children}
    </Tag>
  );
}

type ServicesImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function ServicesImage({ src, alt, className }: ServicesImageProps) {
  return (
    <div
      className={cn(
        "aspect-[16/9] size-full max-h-[220px] rounded-sm p-2 pb-0 sm:aspect-[8/16] sm:max-h-[500px] sm:pb-2 sm:pr-0 md:aspect-[3/4] md:max-h-[420px] xl:aspect-[4/3] xl:w-9/12",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={2000}
        height={2000}
        className="size-full rounded-sm object-cover object-center"
      />
    </div>
  );
}

type ServicesDescriptionProps = {
  children: ReactNode;
  className?: string;
};

function ServicesDescription({
  children,
  className,
}: ServicesDescriptionProps) {
  return (
    <p
      className={cn(
        `${dm_sans.className} text-sm font-medium text-white sm:text-base lg:text-lg`,
        className
      )}
    >
      {children}
    </p>
  );
}

type ServiceCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  buttonLabel: string;
  route: string;
};

function ServiceCard({
  title,
  description,
  imageUrl,
  buttonLabel,
  route,
}: ServiceCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <ServicesHeading level="h2">{title}</ServicesHeading>
      <div className="flex flex-col rounded-lg bg-gradient-to-r from-wma-darkTeal to-wma-teal shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] sm:flex-row">
        <ServicesImage src={imageUrl} alt={title} />
        <div className="flex size-full flex-col gap-4 p-4 sm:gap-8 sm:overflow-y-auto lg:p-6">
          <ServicesDescription>{description}</ServicesDescription>
          <Button variant="default" className={`self-start`} asChild>
            <Link href={route}>{buttonLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

type ServiceSectionProps = {
  type: "section" | "page";
};

export default function ServiceTemplate({ type }: ServiceSectionProps) {
  return (
    <section
      className={
        type === "section"
          ? "mb-32 px-4 sm:px-8 xl:px-20"
          : "px-4 pt-10 sm:px-8 md:pt-12 xl:px-20"
      }
    >
      <div
        className={
          type === "section"
            ? "mx-auto flex max-w-[1280px] flex-col gap-6 rounded-xl bg-white px-4 py-8 sm:px-8 md:gap-10 lg:px-14 lg:py-10 xl:px-16 xl:py-12"
            : "mx-auto flex max-w-[1280px] flex-col gap-6 rounded-t-xl bg-white px-4 py-8 pb-32 sm:px-8 md:gap-10 md:pb-40 lg:px-14 lg:py-10 lg:pb-44 xl:px-16 xl:py-12 xl:pb-60"
        }
      >
        <h2
          className={`${orelega_one.className} text-4xl text-black md:text-5xl xl:text-6xl`}
        >
          Our Services
        </h2>
        <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              buttonLabel={service.buttonLabel}
              route={service.route}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
