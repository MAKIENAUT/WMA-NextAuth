import ClientImage from "@/components/atoms/ui/client-image";
import { orelega_one } from "@/lib/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | WMA",
};

const ABOUT_US_CONTENT = {
  paragraphs: [
    "Welcome to our employment agency! (West Migration Agency 'WMA').",
    "We are dedicated to providing high-quality services to help individuals achieve their career goals and reunite with loved ones.Our agency offers various services, including study and exchange programs, family-based petitions, and temporary employment.",
    "At West Migration Agency, we believe in providing exceptional service and personalized support to help our clients achieve their goals. We understand that each individual has unique needs and circumstances and are committed to delivering tailored solutions to meet those needs. Contact us today to learn how we can help you with your study and exchange program, family-based petition, or temporary employment needs.",
  ],
  image: {
    src: "/about-us-image.jpg",
    alt: "Woman at West Migration Agency",
  },
};

function AboutUsImage() {
  return (
    <div className="flex w-full justify-center">
      <div className="relative aspect-[16/9] w-[90%] sm:w-[80%] xl:w-[70%]">
        <div className="absolute left-0 top-0 ml-2 mt-2 aspect-[16/9] size-full rounded-sm bg-gradient-to-r from-wma-darkTeal to-wma-teal" />
        <ClientImage
          src={ABOUT_US_CONTENT.image.src}
          alt={ABOUT_US_CONTENT.image.alt}
          width={2000}
          height={2000}
          priority
          className="relative z-10 aspect-[16/9] rounded-sm object-cover object-center"
        />
      </div>
    </div>
  );
}

export default function AboutUsPage() {
  return (
    <section className="px-4 pt-10 sm:px-8 md:pt-12 xl:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 rounded-t-xl bg-white px-4 py-8 pb-32 sm:px-8 md:gap-10 md:pb-40 lg:px-14 lg:py-10 lg:pb-44 xl:px-16 xl:py-12 xl:pb-60">
        <AboutUsImage />
        <div className="flex flex-col gap-4">
          <h1
            className={`${orelega_one.className} text-4xl text-black md:text-5xl xl:text-6xl`}
          >
            About Us
          </h1>
          {ABOUT_US_CONTENT.paragraphs.map((text, i) => (
            <p key={i} className="xl:text-lg">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
