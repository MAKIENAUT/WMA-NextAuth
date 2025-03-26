import { orelega_one } from "@/lib/fonts";
import ContentWrapper from "./content-wrapper";
import SectionWrapper from "./section-wrapper";
import EasyApplyFileUpload from "./easy-apply-file-upload";
import { cookies } from "next/headers";

export default async function EasyApplySection() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <SectionWrapper>
      <ContentWrapper className="gap-6 rounded-xl bg-wma-gold">
        <div className="inline-flex flex-col gap-2 text-center text-wma-footer">
          <h1 className={`${orelega_one.className} text-4xl`}>
            Want to easily apply?
          </h1>
          <p className="font-medium">
            Just send your resume, and we&apos;ll point you to the right
            direction.
          </p>
        </div>
        <EasyApplyFileUpload token={token} />
      </ContentWrapper>
    </SectionWrapper>
  );
}
