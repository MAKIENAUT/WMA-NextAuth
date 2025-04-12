import { Metadata } from "next";
import HeroTemplate, { hero_items } from "@/components/templates/hero-template";
import { notFound } from "next/navigation";
import IndividualServiceTemplate from "@/components/templates/individual-service-template";

const individual_services = {
  "study-and-exchange": {
    id: "study-and-exchange",
    title: "Study and Exchange Visas (J1)",

    description:
      "Comprehensive guidance for international students and exchange visitors seeking to study or participate in exchange programs.",
    processSteps: [
      {
        step: "01",
        title: "Find a J1 Program Sponsor",
        description:
          "The first step in obtaining a J1 visa is to identify a J1 program sponsor. The program sponsor is responsible for issuing the DS-2019 form, which is required to apply for the J1 visa.",
      },
      {
        step: "02",
        title: "Submit an Application",
        description:
          "Once you have identified a J1 program sponsor, you will need to submit an application to participate in the program. The application process will vary depending on the specific program, but typically involves submitting personal information, academic transcripts, and a statement of purpose.",
      },
      {
        step: "03",
        title: "Receive the DS-2019 Form",
        description:
          "After your application has been approved, the program sponsor will issue the DS-2019 form. This form is required to apply for the J1 visa.",
      },
      {
        step: "04",
        title: "Pay the SEVIS Fee",
        description:
          "Before you can apply for the J1 visa, you must pay the SEVIS fee. This fee supports the Student and Exchange Visitor Program, which manages student and exchange visitor information in the United States.",
      },
      {
        step: "05",
        title: "Apply for the J1 Visa",
        description:
          "Once you have received the DS-2019 form and paid the SEVIS fee, you can apply for the J1 visa at a U.S. embassy or consulate in your home country. The application process typically involves submitting the DS-2019 form, a completed visa application form, and any other required documents.",
      },
      {
        step: "06",
        title: "Attend a Visa Interview",
        description:
          "After submitting your application, you will be required to attend a visa interview at the U.S. embassy or consulate. During the interview, a consular officer will ask you questions about your program, your background, and your intentions for visiting the United States.",
      },
      {
        step: "07",
        title: "Receive the J1 Visa",
        description:
          "If your visa application is approved, you will receive the J1 visa in your passport. The visa will specify the duration of your stay in the United States, which will be determined by the length of your J1 program.",
      },
    ],
  },
  "web-development": {
    id: "web-development",
    title: "Work Visa for Web Development",
    description:
      "Specialized visa support for web development professionals seeking international employment opportunities.",
    processSteps: [
      {
        step: "01",
        title: "Skills Assessment",
        description:
          "Complete a professional skills assessment to verify your web development expertise and qualifications. This may include reviewing your portfolio, technical certifications, and work experience.",
      },
      {
        step: "02",
        title: "Secure Job Offer",
        description:
          "Obtain a formal job offer from a qualifying employer who is willing to sponsor your work visa. The employer must demonstrate that they cannot find qualified local candidates for the position.",
      },
      {
        step: "03",
        title: "Labor Certification",
        description:
          "Your employer must obtain labor certification from the Department of Labor, proving that hiring a foreign worker will not adversely affect U.S. workers' wages and working conditions.",
      },
      {
        step: "04",
        title: "Visa Petition",
        description:
          "Your employer files a petition with USCIS on your behalf. This includes detailed documentation about the job position, your qualifications, and the company's ability to pay the prevailing wage.",
      },
      {
        step: "05",
        title: "Visa Application",
        description:
          "Once the petition is approved, submit your visa application along with supporting documents to the U.S. embassy or consulate in your home country.",
      },
      {
        step: "06",
        title: "Visa Interview",
        description:
          "Attend an interview at the U.S. embassy or consulate where you'll discuss your job offer, qualifications, and intentions for working in the United States.",
      },
      {
        step: "07",
        title: "Pre-Employment Verification",
        description:
          "Complete any required background checks and employment verification processes before starting your work in the United States.",
      },
    ],
  },
  "family-based": {
    id: "family-based",
    title: "Family-Based Immigration",

    description:
      "Comprehensive support for family reunification and family-based immigration processes.",
    processSteps: [
      {
        step: "01",
        title: "Determine Eligibility",
        description:
          "The first step in the family-based immigration process is to determine if you are eligible to apply. Generally, U.S. citizens and lawful permanent residents can petition for certain family members to immigrate to the United States.",
      },
      {
        step: "02",
        title: "File Form I-130",
        description:
          "Once you have determined your eligibility, the next step is to file Form I-130, Petition for Alien Relative, with U.S. Citizenship and Immigration Services (USCIS). This form establishes the relationship between the petitioner and the intending immigrant.",
      },
      {
        step: "03",
        title: "Wait for Processing",
        description:
          "After submitting the Form I-130, you will need to wait for USCIS to process the petition. The processing time can vary depending on the complexity of the case and the volume of petitions being processed.",
      },
      {
        step: "04",
        title: "File Form I-485",
        description:
          "Once the Form I-130 is approved, the intending immigrant can file Form I-485, Application to Register Permanent Residence or Adjust Status, if they are already in the United States.",
      },
      {
        step: "05",
        title: "Attend a Visa Interview",
        description:
          "If the intending immigrant is applying for an immigrant visa at a U.S. embassy or consulate, they will be required to attend a visa interview. During the interview, a consular officer will ask questions about the relationship between the petitioner and the intending immigrant.",
      },
      {
        step: "06",
        title: "Receive a Green Card",
        description:
          "If the immigrant visa application is approved, the intending immigrant will receive a green card, which grants them permanent residence in the United States.",
      },
    ],
  },
  "temporary-employment": {
    id: "temporary-employment",
    title: "Temporary Employment Visa",
    description:
      "Assistance with temporary work visas for short-term international employment opportunities.",
    category: [
      {
        title: "h2a",
        description:
          "The H-2A visa is a temporary work visa for foreign agricultural workers who will perform seasonal or temporary agricultural work in the United States. Here is an overview of the general process of obtaining an H-2A visa:",
        processSteps: [
          {
            step: "01",
            title: "Employer Recruitment",
            description:
              "The U.S. employer must first demonstrate that there are not enough U.S. workers who are able, willing, qualified, and available to do the temporary work, and that hiring foreign workers will not adversely affect the wages and working conditions of U.S. workers similarly employed.",
          },
          {
            step: "02",
            title: "File A Labor Certification Application",
            description:
              "The U.S. employer must file a labor certification application with the U.S. Department of Labor (DOL) to demonstrate that they have met the recruitment requirements and that the job offer meets the minimum requirements set by the DOL.",
          },
          {
            step: "03",
            title: "Submit Form I-129",
            description:
              "The U.S. employer must file a Form I-129, Petition for Nonimmigrant Worker, with U.S. Citizenship and Immigration Services (USCIS), along with supporting documentation and the approved labor certification.",
          },
          {
            step: "04",
            title: "Consular Processing",
            description:
              "Once the petition is approved, the foreign worker must apply for a visa at a U.S. consulate or embassy abroad.",
          },
          {
            step: "05",
            title: "Admissibility",
            description:
              "The foreign worker must demonstrate that they are admissible to the United States and not subject to any grounds of inadmissibility such as criminal history, health concerns, or prior immigration violations.",
          },
          {
            step: "06",
            title: "Arrival In The United States",
            description:
              "If the visa is approved, the foreign worker can enter the United States and begin work for the U.S. employer.",
          },
        ],
      },
      {
        title: "eb3",
        description:
          "Here is a general process for obtaining temporary employment in the United States, such as through the EB3 visa category:",
        processSteps: [
          {
            step: "01",
            title: "Find An Employer",
            description:
              "The first step in obtaining temporary employment in the United States is to find an employer who is willing to sponsor you for a temporary work visa. The employer must demonstrate that there are no qualified U.S. workers available for the position and that your employment will not adversely affect the wages and working conditions of U.S. workers in similar positions.",
          },
          {
            step: "02",
            title: "Obtain Labor Certification",
            description:
              "Once you have found an employer, they will need to obtain a labor certification from the U.S. Department of Labor. This certification confirms that there are no qualified U.S. workers available for the position and that your employment will not adversely affect the wages and working conditions of U.S. workers in similar positions.",
          },
          {
            step: "03",
            title: "Submit Form I-140",
            description:
              "After obtaining the labor certification, the employer will need to file Form I-140, Petition for Alien Worker, with U.S. Citizenship and Immigration Services (USCIS). This form confirms that you meet the qualifications for the temporary work visa and that the employer has met all the necessary requirements.",
          },
          {
            step: "04",
            title: "Apply For A Temporary Work Visa",
            description:
              "I-140 is approved, you can apply for a temporary work visa, such as the EB3 visa. The application process will vary depending on the specific visa category, but typically involves submitting the Form I-129, Petition for Nonimmigrant Worker, along with supporting documents such as your passport, educational transcripts, and evidence of qualifications for the position.",
          },
          {
            step: "05",
            title: "Attend The Visa Interview",
            description:
              "After submitting your visa application, you will be required to attend a visa interview at the U.S. embassy or consulate in your home country. During the interview, a consular officer will ask you questions about your qualifications, your employment, and your intentions for visiting the United States.",
          },
          {
            step: "06",
            title: "Receive The Temporary Visa",
            description:
              "If your visa application is approved, you will receive the temporary work visa in your passport. The visa will specify the duration of your stay in the United States, which will be determined by the terms of your employment.",
          },
        ],
      },
    ],
  },
};

// Adjusting the Params and SearchParams to be Promises
type Props = {
  params: Promise<{
    serviceName:
      | "study-and-exchange"
      | "web-development"
      | "family-based"
      | "temporary-employment";
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const service = individual_services[resolvedParams.serviceName];

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const resolvedParams = await params;
  const { serviceName } = resolvedParams;

  // Check if service exists
  if (!individual_services[serviceName]) {
    notFound();
  }

  // Type guard for valid hero route
  const isValidHeroRoute = (
    route: string
  ): route is keyof typeof hero_items => {
    return route in hero_items;
  };

  // Set the hero route, defaulting to 'home' if not found
  const heroRoute = isValidHeroRoute(serviceName) ? serviceName : "home";

  return (
    <>
      <HeroTemplate route={heroRoute} />
      <IndividualServiceTemplate serviceName={serviceName} />
    </>
  );
}

// Generate static paths for all known services
export async function generateStaticParams() {
  return Object.keys(individual_services).map((service) => ({
    serviceName: service,
  }));
}
