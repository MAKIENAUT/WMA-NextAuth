import Image from "next/image";
import SectionWrapper from "./section-wrapper";

function PromiseStatement() {
  return (
    <div className="relative z-10 rounded-xl bg-gradient-to-r from-wma-darkTeal to-wma-teal p-6 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)] sm:w-2/3 md:w-1/2 md:p-8 xl:p-12">
      <p className="font-medium text-white md:text-lg md:font-semibold xl:text-2xl">
        At West Migration Agency, we believe in providing exceptional service
        and personalized support to help our clients achieve their goals. We
        understand that each individual has unique needs and circumstances and
        are committed to delivering tailored solutions to meet those needs.
        Contact us today to learn how we can help you with your study and
        exchange program, family-based petition, or temporary employment needs.
      </p>
    </div>
  );
}

function PromiseImage() {
  return (
    <div className="absolute left-[-4rem] top-[-8rem] mr-2 max-w-[2000px] sm:left-[-20rem] sm:top-auto sm:mr-8 md:left-[-30rem] lg:mr-12 xl:mr-20">
      <Image
        src="/promise-plane.png"
        alt="airplane"
        width={2000}
        height={2000}
      />
    </div>
  );
}

export default function PromiseSection() {
  return (
    <SectionWrapper className="relative">
      <div className="mx-auto max-w-[1280px] items-center sm:flex">
        <PromiseStatement />
        <PromiseImage />
      </div>
    </SectionWrapper>
  );
}
