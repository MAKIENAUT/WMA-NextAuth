import Image from "next/image";
import ContentWrapper from "../../components/organisms/content-wrapper";
import SectionWrapper from "../../components/organisms/section-wrapper";
import HeroTemplate from "../../components/templates/hero-template";
import ServiceTemplate from "../../components/templates/service-template";
import PromiseSection from "../../components/organisms/promise-section";
import EasyApplySection from "../../components/organisms/easy-apply-section";


function StatementSection() {
  return (
    <SectionWrapper>
      <ContentWrapper className="gap-6 rounded-xl bg-white sm:flex-row md:gap-8">
        <StatementImage />
        <p className="font-semibold text-wma-darkTeal sm:w-full md:text-lg xl:text-2xl">
          Welcome to our employment agency! (West Migration Agency “ WMA”). We
          are dedicated to providing high-quality services to help individuals
          achieve their career goals and reunite with loved ones. Our agency
          offers various services, including study and exchange programs,
          family-based petitions, and temporary employment.
        </p>
      </ContentWrapper>
    </SectionWrapper>
  );
}

function StatementImage() {
  return (
    <div className="relative w-9/12 max-w-[260px] sm:order-last sm:w-full sm:max-w-[400px]">
      <div className="absolute left-0 top-0 ml-2 mt-2 aspect-[1/1] w-full rounded-sm bg-gradient-to-r from-wma-darkTeal to-wma-teal" />
      <div className="relative z-10 aspect-[1/1] w-full">
        <Image
          alt="Image of a woman"
          src="/Page-Images/statement-image.jpg"
          fill
          className="rounded-sm object-cover object-[70%_0]"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px): 33vw"
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <HeroTemplate route="home" />
      <StatementSection />
      <ServiceTemplate type="section" />
      <PromiseSection />
      <EasyApplySection />
    </>
  );
}
