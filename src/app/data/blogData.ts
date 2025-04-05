export type BlogPost = {
  url: string;
  title: string;
  image: { src: string; position?: string; alt: string };
  date: string;
  text: string[];
};

export type BlogCategory = {
  category: string;
  posts: BlogPost[];
};

export const blogData: BlogCategory[] = [
  {
    category: "all",
    posts: [], // Will be populated with all posts
  },
  {
    category: "updates",
    posts: [
      {
        url: "important-i129f-form-updates-2025",
        title: "Important Updates to Form I-129F: What Fiancé(e) Visa Applicants Need to Know",
        image: {
          src: "/i129f-form.png",
          position: "object-[center_center]",
          alt: "USCIS I-129F Fiancé(e) form",
        },
        date: "April 01, 2025",
        text: [
          "<h3>Critical Update: New USCIS Form Edition</h3>",
          "<p>Starting <strong>May 1, 2025</strong>, USCIS will exclusively accept the <strong>01/20/25 edition</strong> of Form I-129F (Petition for Alien Fiancé(e)). Using an outdated form after this deadline will result in automatic rejection.</p>",
          "<h3>What is Form I-129F?</h3>",
          "<p>This petition serves two primary purposes:</p>",
          "<ul><li>Bringing your fiancé(e) (K-1) and their children (K-2) to the U.S. for marriage</li><li>Bringing your spouse (K-3) and their children (K-4) while awaiting I-130 approval</li></ul>",
          "<h3>West Migration Agency: Your Immigration Partner</h3>",
          "<p>At <strong>West Migration Agency</strong>, we provide expert guidance to ensure your forms are correctly completed and submitted on time. Our services include:</p>",
          "<ul><li><strong>Form Reviews</strong> – Ensure compliance with USCIS requirements.</li><li><strong>Deadline Management</strong> – Avoid costly delays or rejections.</li><li><strong>Complete Application Support</strong> – Hassle-free assistance from start to finish.</li></ul>",
          "<h3>Proper Form Submission</h3>",
          "<p>USCIS strictly requires all pages to be from the same form edition, with edition dates visible at the bottom of each page.</p>",
          "<h3>Supporting Documentation Essentials</h3>",
          "<p>Strengthen your petition with properly organized evidence:</p>",
          "<ul><li>Proof of U.S. citizenship</li><li>Evidence of genuine relationship</li><li>Meeting documentation within the past two years</li></ul>",
          "<h3>Avoid Common Pitfalls</h3>",
          "<p>❌ Outdated Form Editions ❌ Incomplete Applications ❌ Mixed Edition Pages</p>",
          "<p>✅ Professional Review ✅ Comprehensive Support ✅ Stress-Free Process</p>",
          "<p>Don't wait until the deadline! Contact us today at admin@westmigrationagency.us to ensure a smooth and stress-free fiancé(e) visa process.</p>",
        ],
      },
      {
        url: "navigating-i-485-supplement-j",
        title:
          "Navigating I-485 Supplement J: What Every Immigrant Worker Needs to Know",
        image: {
          src: "/i-485.png",
          position: "object-[center_center]",
          alt: "USCIS immigration forms",
        },
        date: "March 05, 2025",
        text: [
          "<h3>Critical Update: New USCIS Form Edition</h3>",
          "<p>As of <strong>March 3, 2025</strong>, USCIS is strictly enforcing the <strong>01/20/25 edition</strong> of Form I-485 Supplement J. Submitting an outdated form could derail your entire immigration process.</p>",
          "<h3>What is Supplement J?</h3>",
          "<p>This form serves two crucial purposes:</p>",
          "<ul><li>Confirm your original job offer</li><li>Request job portability for new employment opportunities</li></ul>",
          "<h3>West Migration Agency: Your Immigration Partner</h3>",
          "<p>At <strong>West Migration Agency</strong>, we provide expert guidance to ensure your forms are correctly completed and submitted on time. Our services include:</p>",
          "<ul><li><strong>Form Reviews</strong> – Ensure compliance with USCIS requirements.</li><li><strong>Deadline Management</strong> – Avoid costly delays or rejections.</li><li><strong>Complete Application Support</strong> – Hassle-free assistance from start to finish.</li></ul>",
          "<h3>Job Offer Confirmation</h3>",
          "<p>Prove your commitment to the job offered in your I-140 petition with our guided assistance.</p>",
          "<h3>Job Portability Simplified</h3>",
          "<p>Explore new job opportunities while maintaining your immigration path:</p>",
          "<ul><li>Full-time, permanent positions</li><li>Same or similar occupational classifications</li><li>Expert guidance through complex USCIS requirements</li></ul>",
          "<h3>Avoid Common Pitfalls</h3>",
          "<p>❌ Outdated Form Editions ❌ Incomplete Applications ❌ Missed Deadlines</p>",
          "<p>✅ Professional Review ✅ Comprehensive Support ✅ Stress-Free Process</p>",
          "<p>Don't wait until the deadline! Contact us today at admin@westmigrationagency.us to ensure a smooth and stress-free immigration process.</p>",
        ],
      },
      {
        url: "uscis-form-editions-2025",
        title: "USCIS New Form Editions – Form G-325A & Form I-134",
        image: {
          src: "/uscis-form-editions-2025.png",
          position: "object-[center_center]",
          alt: "USCIS forms",
        },
        date: "March 05, 2025",
        text: [
          "<h3>The <strong>USCIS</strong> has released updated editions of two important forms, effective <strong>March 3, 2025</strong>:</h3>",
          "<ul><li><strong>Form G-325A (Biographic Information)</strong> – Required for certain deferred action requests, including military and non-military cases.</li><li><strong>Form I-134 (Declaration of Financial Support)</strong> – Used to sponsor a beneficiary financially during their temporary stay in the U.S.</li></ul>",
          "<p>Starting <strong>March 3, 2025</strong>, only the <strong>01/20/25 edition</strong> will be accepted. Submitting an outdated version could result in delays or rejection.</p>",
          "<h3>At <strong>West Migration Agency</strong>, we provide expert guidance to ensure your forms are correctly completed and submitted on time. Our services include:</h3>",
          "<ul><li><strong>Form Reviews</strong> – Ensure compliance with USCIS requirements.</li><li><strong>Deadline Management</strong> – Avoid costly delays or rejections.</li><li><strong>Complete Application Support</strong> – Hassle-free assistance from start to finish.</li></ul>",
          "<p>Don't wait until the deadline! Contact us today at admin@westmigrationagency.us to ensure a smooth and stress-free immigration process.</p>",
        ],
      },
      {
        url: "fy-2026-h1b-registration",
        title: "USCIS Announces FY 2026 H-1B Registration Details",
        image: {
          src: "/h1b.jpg",
          position: "object-[center_center]",
          alt: "H-1B visa registration",
        },
        date: "February 5, 2025",
        text: [
          "<h3>USCIS has announced the opening of the FY 2026 H-1B cap initial registration period, running from March 7 to March 24, 2025.</h3>",
          "<p>This year brings several important updates and enhancements to the registration process that employers and immigration practitioners should know about.</p>",
          "<p>Key updates include a $215 registration fee per beneficiary and an increased daily credit card transaction limit from $24,999.99 to $99,999.99. The selection process will continue to use the beneficiary-centric approach introduced in FY 2025, where registrations are selected by unique beneficiary rather than by registration.</p>",
          "<p>USCIS has implemented several organizational account enhancements for FY 2026, including new features allowing paralegals to work with multiple legal representatives, simplified processes for adding paralegals to company clients, auto-population of certain Form I-129 fields, and new bulk upload capabilities for H-1B beneficiary data.</p>",
          "<p>First-time registrants can create their accounts at any time before the registration period begins. While representatives can add clients to their accounts now, the actual beneficiary information submission and fee payment must wait until the March 7 opening date. For transactions exceeding $99,999.99, employers can use Automated Clearing House (ACH) payments.</p>",
          "<p>At West Migration Agency, we understand the complexity of the H-1B registration process and are ready to assist employers with all aspects of their H-1B petitions. For more information or assistance with your H-1B registrations, please contact us at admin@westmigrationagency.us.</p>",
        ],
      },
      {
        url: "uscis-waives-COVID-19-vaccination-requirement-for-adjustment-of-status-applicants",
        title: "USCIS Waives COVID-19 Vaccination Requirement",
        image: {
          src: "/uscis-covid-19-vaccination.png",
          position: "object-center",
          alt: "USCIS news update",
        },
        date: "January 26, 2025",
        text: [
          "<h3>As your trusted immigration partner, West Migration Agency wants to keep you informed about the latest USCIS changes:</h3>",
          "<p>Effective Jan. 22, 2025, USCIS is waiving any and all requirements that applicants for adjustment of status to that of a lawful permanent resident present documentation on their Form I-693, Report of Immigration Medical Examination and Vaccination Record, that they received the COVID-19 vaccination. USCIS will not issue any Request for Evidence or Notice of Intent to Deny related to proving a COVID-19 vaccination. USCIS will not deny any adjustment of status application based on the applicant's failure to present documentation that they received the COVID-19 vaccination.</p>",
        ],
      },
      {
        url: "uscis-form-updates-2025",
        title: "USCIS Form Updates 2025: What You Need to Know",
        image: {
          src: "/forms.png",
          position: "object-[center_center]",
          alt: "USCIS forms",
        },
        date: "January 8, 2025",
        text: [
          "<h3>USCIS has announced important updates to two key immigration forms:</h3>",
          "<p>Form G-1055 (Fee Schedule) - New edition released January 6, 2025, and Form G-325A (Biographic Information) - New edition from October 24, 2024.</p>",
          "<p>These updates directly impact anyone planning to file new immigration applications, submit fee waiver requests, apply for travel documents or permanent residence, or complete biographic information forms for deferred action. Most importantly, starting February 5, 2025, USCIS will only accept the new edition of Form G-325A (10/24/24 version).</p>",
          "<p>At West Migration Agency, our experienced team is ready to guide you through these changes. We offer expert review of your forms before submission, verification of correct fee payments, deadline management to avoid rejections, and complete application preparation services.</p>",
          "<p>We encourage you to take action now by contacting us for a consultation, getting your applications reviewed, and ensuring compliance with new requirements. At West Migration Agency, we turn immigration updates into immigration success stories.</p>",
          "<p>For more information or to schedule a consultation, please contact us at admin@westmigrationagency.us. Our team is ready to help you navigate these important changes and ensure your immigration journey stays on track.</p>",
        ],
      },
    ],
  },
  {
    category: "news",
    posts: [
      // Will include some USCIS updates as well
      {
        url: "fy-2026-h1b-registration-full",
        title: "Full Details: USCIS FY 2026 H-1B Registration Process Unveiled",
        image: {
          src: "/h1b.jpg",
          position: "object-[center_center]",
          alt: "H-1B visa registration",
        },
        date: "February 5, 2025",
        text: [
          "<h3>USCIS has announced the opening of the FY 2026 H-1B cap initial registration period, running from March 7 to March 24, 2025.</h3>",
          "<p>This year brings several important updates and enhancements to the registration process that employers and immigration practitioners should know about.</p>",
          "<p>Key updates include a $215 registration fee per beneficiary and an increased daily credit card transaction limit from $24,999.99 to $99,999.99. The selection process will continue to use the beneficiary-centric approach introduced in FY 2025, where registrations are selected by unique beneficiary rather than by registration.</p>",
          "<p>USCIS has implemented several organizational account enhancements for FY 2026, including new features allowing paralegals to work with multiple legal representatives, simplified processes for adding paralegals to company clients, auto-population of certain Form I-129 fields, and new bulk upload capabilities for H-1B beneficiary data.</p>",
          "<p>First-time registrants can create their accounts at any time before the registration period begins. While representatives can add clients to their accounts now, the actual beneficiary information submission and fee payment must wait until the March 7 opening date. For transactions exceeding $99,999.99, employers can use Automated Clearing House (ACH) payments.</p>",
          "<p>At West Migration Agency, we understand the complexity of the H-1B registration process and are ready to assist employers with all aspects of their H-1B petitions. For more information or assistance with your H-1B registrations, please contact us at admin@westmigrationagency.us.</p>",
        ],
      },
      {
        url: "uscis-announces-new-form-editions",
        title: "USCIS Announces New Form Editions – What You Need to Know",
        image: {
          src: "/uscis-form-editions-2025.png",
          position: "object-[center_center]",
          alt: "USCIS forms",
        },
        date: "February 1, 2025",
        text: [
          "<h3>The <strong>USCIS</strong> has released updated editions of two important forms, effective <strong>March 3, 2025</strong>:</h3>",
          "<ul><li><strong>Form G-325A (Biographic Information)</strong> – Required for certain deferred action requests, including military and non-military cases.</li><li><strong>Form I-134 (Declaration of Financial Support)</strong> – Used to sponsor a beneficiary financially during their temporary stay in the U.S.</li></ul>",
          "<p>Starting <strong>March 3, 2025</strong>, only the <strong>01/20/25 edition</strong> will be accepted. Submitting an outdated version could result in delays or rejection.</p>",
          "<h3>At <strong>West Migration Agency</strong>, we provide expert guidance to ensure your forms are correctly completed and submitted on time. Our services include:</h3>",
          "<ul><li><strong>Form Reviews</strong> – Ensure compliance with USCIS requirements.</li><li><strong>Deadline Management</strong> – Avoid costly delays or rejections.</li><li><strong>Complete Application Support</strong> – Hassle-free assistance from start to finish.</li></ul>",
          "<p>Don't wait until the deadline! Contact us today at admin@westmigrationagency.us to ensure a smooth and stress-free immigration process.</p>",
        ],
      },
    ],
  },
  {
    category: "posts",
    posts: [
      {
        url: "record-high-international-students",
        title:
          "Open Doors Report: A Record High Number of International Students",
        image: {
          src: "/students.jpg",
          position: "object-[center_center]",
          alt: "international students",
        },
        date: "December 15, 2023",
        text: [
          "<h3>The Institute of International Education (IIE) released its annual Open Doors Report showing a record high 1.1 million international students studied in the United States during the 2023-2024 academic year, marking a 7 percent increase from the previous year.</h3>",
          "<p>These students contributed over $50 billion to the U.S. economy, supporting both academic campuses and their surrounding communities.</p>",
          "<p>In a notable shift, India became the top country of origin for the first time since 2009, with a 35 percent increase in Indian students. While China saw a 4 percent decline, it maintains its position as the second-largest source of international students, particularly at the undergraduate level. The report highlighted significant growth from various regions, with eight of the top 25 countries, including Bangladesh, Colombia, Ghana, and Nepal, achieving record-high numbers. Sub-Saharan Africa demonstrated remarkable growth with a 13 percent increase.</p>",
          "<p>The report revealed several key trends in international education. Graduate student enrollments increased by 8 percent, while undergraduate enrollment showed a slight 1 percent decline. STEM fields continue to dominate, with 56 percent of international students enrolled in science, technology, engineering, and mathematics programs. Computer Science, Engineering, and Data Analytics remain the most popular choices among international students.</p>",
          "<p>Geographic distribution of international students shows concentration in specific states, with California, New York, and Texas hosting the largest international student populations. These concentrations significantly boost local economies through various forms of spending and economic activity. The comprehensive report is based on a survey of approximately 3,000 accredited, Student and Exchange Visitor Program-certified post-secondary institutions in the United States.</p>",
          "<p>West Migration Agency recognizes the significance of this growth in international education and its impact on the U.S. education sector. The increasing diversity in student populations presents both opportunities and challenges for educational institutions. Our agency works to support institutions in managing these demographic shifts and ensuring successful integration of international students.</p>",
          "<p>For educational institutions seeking guidance on international student recruitment and support services, or for more information about our specialized consulting services, please contact us at admin@westmigrationagency.us. Our team of experts is ready to assist in developing strategies that align with these emerging trends in international education.</p>",
        ],
      },
      {
        url: "addressing-us-teacher-shortage",
        title: "Addressing US Teacher Shortage: A Call to Action",
        image: {
          src: "/teacher.jpg",
          position: "object-[center_-3.5rem]",
          alt: "teacher",
        },
        date: "November 11, 2023",
        text: [
          "<h3>The teacher shortage in the United States has been a significant concern, with various factors contributing to the situation.</h3>",
          "<p>The U.S. Department of Education is actively working to address this issue through a comprehensive policy agenda aimed at recruiting, preparing, retaining, and supporting a diverse and well-prepared educator workforce.</p>",
          '<p>This initiative, "Raise the Bar: Lead the World," involves collaboration with states, tribes, local educational agencies, and educator preparation programs, including minority-serving institutions, to eliminate educator shortages and diversify the education profession. The shortage has been exacerbated by the COVID-19 pandemic, with factors such as low wages, high costs of educator preparation, poor working conditions, and inequitable funding practices contributing to a decline in new educators entering the field and high rates of attrition. Particularly impacted areas include special education, STEM education, career and technical education, and bilingual education programs. To combat this, the Department of Education has outlined five key policy levers: increasing compensation, improving working conditions, expanding access to quality and affordable educator preparation, promoting career advancement opportunities, providing high-quality new teacher induction and ongoing professional learning, and increasing educator diversity.</p>',
          "<p>The teacher shortage is not only a policy issue but also a matter of growing concern among educators themselves. According to the National Center for Education Statistics, 42% of all school principals in the U.S. expressed heightened concern about educators leaving the profession in the previous academic year. Moreover, 45% of U.S. public schools had at least one teacher vacancy by the end of October 2022. Factors contributing to these shortages include low salaries, tough working conditions, higher retirement rates, and a declining interest in teaching as a profession.</p>",
          '<p>Statistics from "We Are Teachers" highlight the severity of the problem: 44% of teachers reported burnout, 55% indicated they were ready to leave the profession earlier than planned, and 35% stated they were likely to quit within the next two years. Furthermore, 78% of educators see low pay as a serious issue, and 84% spend their own money on basic classroom supplies. The lack of respect from the public, as perceived by 45% of teachers, adds to the challenges. Addressing this crisis requires a multifaceted approach, including competitive compensation, improved working conditions, simplified and enhanced teacher preparation programs, reduced administrative burden, and effective mentorship and support. These measures aim not only to fill the current vacancies but also to create a more sustainable and appealing teaching profession for future generations.</p>',
          "<p>In addressing the teacher shortage crisis in the United States, West Migration Agency plays a pivotal role. We work directly with schools that are in urgent need of qualified educators. For those interested in pursuing teaching opportunities in these schools, we provide detailed information about eligibility and qualification requirements on our website. Understanding the challenges faced by schools and educators, our goal is to facilitate the placement of capable and motivated teachers in environments where they are most needed.</p>",
          "<p>If you have any questions or concerns regarding the process, eligibility, or other related matters, please do not hesitate to reach out to us. We are committed to providing support and guidance throughout your journey. For more personalized assistance or to start the application process, contact us at admin@westmigrationagency.us. Our team is dedicated to helping alleviate the teacher shortage by connecting skilled educators with schools where they can make a significant impact.</p>",
        ],
      },
    ],
  },
];

// Prepare the 'all' category with sorted posts
export const preparedBlogData = blogData.map((category, index) => {
  if (index === 0) {
    // 'all' category
    return {
      ...category,
      posts: [
        ...blogData[1].posts, // updates
        ...blogData[2].posts, // news
        ...blogData[3].posts, // posts
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  }
  return category;
});
