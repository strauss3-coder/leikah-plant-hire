import type { LegalContent } from "@/lib/cms/types";
import { business } from "./business";

/* ============================================================================
   LEGAL CONTENT

   Privacy, cookies and terms, written against what this website actually does
   rather than against a generic template. Three facts shape all three documents
   and none of them should be edited without checking the code first:

     1. The site loads no third-party tracking. Typefaces are self-hosted by
        next/font at build time, so no request reaches Google at run time. There
        is no embedded map, no video embed and no tag manager.
     2. The only cookie set today is the consent record itself, which is stored
        in the browser rather than in a cookie and never leaves the device.
     3. Personal information is collected only through the three enquiry forms,
        each of which requires explicit consent before it will submit.

   If analytics is switched on later, the analytics category in the consent
   banner already governs it, and the wording below already accounts for it.

   POPIA (Act 4 of 2013) is the governing statute. Data subject rights and the
   Information Regulator's contact details are reproduced as published.
   ========================================================================= */

const UPDATED = "2026-09-15";

const contactLine = `${business.email} or ${business.phone}`;
const postal = `${business.address.street}, ${business.address.suburb}, ${business.address.city}, ${business.address.province}, ${business.address.postalCode}`;

export const legal: LegalContent = {
  informationOfficer: {
    name: "The Information Officer",
    email: business.email,
    phone: business.phone,
  },

  consentStatement: `I consent to ${business.tradingName} securely storing my information in order to respond to my enquiry.`,

  cookieCategories: [
    {
      id: "essential",
      name: "Essential",
      description:
        "Required for the site to work. These remember your cookie choice, keep enquiry forms secure while you complete them, protect against automated abuse, and note within a single browsing session that you have already seen the opening sequence so it is not replayed on every page. They cannot be switched off.",
      required: true,
    },
    {
      id: "analytics",
      name: "Analytics",
      description:
        "Would let us count visits and see which pages are read, so we can improve the site. No analytics is running at present. If it is added later, it will only load once you have allowed this category.",
      required: false,
    },
    {
      id: "functional",
      name: "Functional",
      description:
        "Would remember preferences between visits, such as a filter you last applied, so the site behaves the way you left it. None is in use at present.",
      required: false,
    },
  ],

  /* ------------------------------------------------------------------------
     PRIVACY POLICY
     --------------------------------------------------------------------- */
  privacy: {
    key: "privacy",
    title: "Privacy Policy",
    eyebrow: "Legal",
    headline: "How we handle your information",
    lead: `${business.tradingName} collects only what is needed to answer your enquiry, holds it securely, and does not sell or trade it. This policy explains what we collect, why, and the rights you hold under POPIA.`,
    updated: UPDATED,
    seo: {
      title: "Privacy Policy",
      description: `How ${business.tradingName} collects, uses, stores and protects personal information, and your rights under the Protection of Personal Information Act.`,
    },
    sections: [
      {
        id: "who-we-are",
        heading: "Who we are",
        body: [
          `${business.legalName} is the responsible party for the personal information described in this policy. We operate from ${postal}, and serve clients across Mpumalanga and the surrounding provinces.`,
          `Questions about this policy, or any request concerning your personal information, can be sent to our Information Officer at ${contactLine}.`,
        ],
      },
      {
        id: "what-we-collect",
        heading: "Information we collect",
        body: [
          "We collect personal information in two ways: what you give us directly through a form, and limited technical information your browser sends automatically when you load a page.",
        ],
        points: [
          "Quotation requests: your name, company, role, email address, telephone number, the services you need, the site location and province, your preferred start date, duration and budget band where you choose to give them, your description of the work, and any files you attach.",
          "Contact messages: your name, email address, telephone number where given, company where given, the department you selected, your subject line and your message.",
          "Job applications: your name, email address, telephone number, the role you are applying for, your experience and competencies, and your CV if you attach one.",
          "Technical information: your IP address, browser type and version, device and screen characteristics, the pages you visited and the page that referred you. This is generated automatically by web infrastructure and is used for security and to keep the site working.",
        ],
      },
      {
        id: "why-we-collect",
        heading: "Why we collect it, and on what basis",
        body: [
          "We process personal information for clearly defined purposes and no others. Under POPIA, our lawful basis is your consent where you submit a form, and our legitimate interest in operating a secure website for the limited technical information described above.",
        ],
        points: [
          "To prepare and send you a quotation, and to ask any questions needed to price the work correctly.",
          "To answer an enquiry and route it to the department that can deal with it.",
          "To assess a job application and contact you about it.",
          "To keep a record of the enquiry so that a later query about the same job can be answered.",
          "To protect the site against automated abuse, spam and fraudulent submissions.",
          "To meet any legal, tax or regulatory obligation that applies to work we carry out for you.",
        ],
      },
      {
        id: "consent",
        heading: "Consent, and withdrawing it",
        body: [
          "Every form on this site requires you to tick a consent box before it will submit. Consent is given freely and can be withdrawn at any time by contacting us. Withdrawing consent does not affect processing that already took place while consent was in force.",
          "If you withdraw consent while we are in the middle of quoting or carrying out work for you, we may be unable to continue, and we may still need to retain records where law or a contract requires it.",
        ],
      },
      {
        id: "forms",
        heading: "Enquiry form submissions",
        body: [
          "Form submissions are validated in your browser and again on our server before anything is stored. We collect only the fields shown on the form and never ask for financial details, identity numbers or passwords through this website.",
          "Each submission is given a reference number so that you and we can refer to the same enquiry. Attachments are stored alongside the enquiry and are accessible only to authorised staff.",
          "We limit how many submissions can be made from the same connection in a short period, and every form carries a hidden field that automated scripts fill in and people do not. Both measures exist to keep unsolicited and fraudulent traffic out of our records.",
        ],
      },
      {
        id: "cookies",
        heading: "Cookies and similar technologies",
        body: [
          "This site does not set advertising or tracking cookies. The only information stored in your browser today is your cookie preference itself, so that you are not asked again on every visit.",
          "Our Cookie Policy sets out each category, what it is for, and how to change your choice or clear it entirely.",
        ],
      },
      {
        id: "analytics",
        heading: "Analytics",
        body: [
          "No analytics or measurement service is running on this website at present, and no behavioural profile of you is built.",
          "If we introduce analytics in future it will load only where you have allowed the analytics category in the cookie banner, it will be configured to avoid collecting more than is needed to understand which pages are useful, and this policy will be updated before it goes live.",
        ],
      },
      {
        id: "device",
        heading: "Device and connection information",
        body: [
          "Like every website, ours receives certain information automatically so that pages can be delivered and kept secure. This includes your IP address, the browser and operating system you are using, and the size of your screen so the correct image is sent.",
          "We use this to serve the site, to diagnose faults, and to identify abusive traffic. We do not use it to identify you personally, and we do not combine it with your enquiry unless it is needed to investigate a security incident.",
        ],
      },
      {
        id: "storage",
        heading: "How your information is stored",
        body: [
          "Enquiries are stored in a managed database with access controls that limit each record to authorised staff. Data is encrypted in transit using HTTPS and encrypted at rest by the hosting platform.",
          "Records are retained for as long as is needed for the purpose they were collected for, and then removed. As a guide, quotation and contact records are kept for up to five years so that a later query about the same job can be answered and so that we can meet tax and contractual record-keeping obligations. Unsuccessful job applications are kept for up to twelve months unless you ask us to remove them sooner.",
          "Some of the infrastructure that hosts this website and its records may process data outside South Africa. Where that happens, we use providers that are contractually bound to protection substantially similar to POPIA, as section 72 of the Act requires.",
        ],
      },
      {
        id: "sharing",
        heading: "Who we share it with",
        body: [
          "We do not sell, rent or trade your personal information, and we do not share it for anyone else's marketing.",
        ],
        points: [
          "Our own staff, limited to those who need the record to answer your enquiry or carry out the work.",
          "Service providers who host this website and its database, who process data on our instruction only and may not use it for their own purposes.",
          "Professional advisers, auditors or insurers, where they are bound by confidentiality and it is necessary.",
          "A law enforcement agency, regulator or court, where we are legally obliged to disclose.",
        ],
      },
      {
        id: "third-parties",
        heading: "Third-party services on this site",
        body: [
          "We have deliberately kept third-party code off this website. Typefaces are downloaded at build time and served from our own domain, so no request is made to an outside font service when you load a page. There is no embedded map, no embedded video and no tag manager.",
          "Some links do take you to other services, such as WhatsApp when you tap the WhatsApp button, or your own maps application when you open our location. These are ordinary links. Once you follow one, that service's own privacy policy governs what it collects, and we have no control over it.",
        ],
      },
      {
        id: "children",
        heading: "Children",
        body: [
          "This is a business-to-business industrial website and is not directed at children. We do not knowingly collect personal information from anyone under 18. If you believe a child has submitted information to us, contact us and we will remove it.",
        ],
      },
      {
        id: "rights",
        heading: "Your rights under POPIA",
        body: [
          "The Protection of Personal Information Act, 4 of 2013, gives you the following rights in respect of the information we hold about you. We do not charge for a reasonable request and we will respond within a reasonable period.",
        ],
        points: [
          "To be told whether we hold personal information about you, and to be given a copy of it.",
          "To ask us to correct or complete information that is inaccurate, irrelevant, excessive, out of date, misleading or obtained unlawfully.",
          "To ask us to delete or destroy information we are no longer entitled to keep.",
          "To object, on reasonable grounds, to our processing of your information.",
          "To withdraw a consent you previously gave.",
          "To not be subject to a decision based solely on automated processing. We do not make automated decisions about you.",
          "To complain to the Information Regulator, and to seek civil relief through a court.",
        ],
      },
      {
        id: "requests",
        heading: "Making a request",
        body: [
          `Send any request about your personal information to our Information Officer at ${contactLine}, or in writing to ${postal}. Please tell us what you would like us to do and include enough detail for us to find your record, such as the reference number on your enquiry.`,
          "We may need to verify your identity before we act on a request, so that we do not disclose your information to someone else.",
        ],
      },
      {
        id: "regulator",
        heading: "Complaints to the Information Regulator",
        body: [
          "If you are not satisfied with how we have handled your information or your request, you may lodge a complaint with the Information Regulator of South Africa.",
          "Information Regulator (South Africa), JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001. Complaints: complaints.IR@justice.gov.za. General enquiries: enquiries.IR@justice.gov.za. Website: inforegulator.org.za",
        ],
      },
      {
        id: "changes",
        heading: "Changes to this policy",
        body: [
          "We may update this policy as the site or the law changes. The date at the top of this page shows when it was last revised. Where a change materially affects how we handle your information, we will make that clear rather than change the page quietly.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------
     COOKIE POLICY
     --------------------------------------------------------------------- */
  cookies: {
    key: "cookies",
    title: "Cookie Policy",
    eyebrow: "Legal",
    headline: "What we store in your browser, and why",
    lead: "This site sets no advertising or tracking cookies. What little we store is listed here in full, along with how to change or clear your choice at any time.",
    updated: UPDATED,
    seo: {
      title: "Cookie Policy",
      description: `Which cookies and browser storage ${business.tradingName} uses, what each category does, and how to change or disable them.`,
    },
    sections: [
      {
        id: "what-are-cookies",
        heading: "What cookies are",
        body: [
          "A cookie is a small text file a website asks your browser to keep, so that something can be remembered between pages or between visits. Related technologies such as local storage do the same job and are covered by this policy as well.",
          "Cookies can be set by the site you are visiting, or by another company whose code runs on that site. We use none of the second kind.",
        ],
      },
      {
        id: "what-we-use",
        heading: "What this site uses today",
        body: [
          "One item, stored in your browser's local storage rather than as a cookie: your cookie preference. It records which categories you allowed and the date you chose, so we do not ask again on every page.",
          "This record stays on your device. It is never sent to us, never shared, and is removed the moment you clear your browser's site data.",
        ],
      },
      {
        id: "essential",
        heading: "Essential cookies",
        body: [
          "These keep the site working and secure. They remember your cookie choice, protect enquiry forms while you are completing them, help block automated abuse, and note for the length of one browsing session that you have already seen the opening animation so it is not replayed on every page.",
          "Essential cookies cannot be switched off, because the site cannot function correctly without them. They hold no advertising identifier and build no profile of you.",
        ],
      },
      {
        id: "analytics-cookies",
        heading: "Analytics cookies",
        body: [
          "Analytics cookies would let us count visits and see which pages are actually read, so we can improve what is useful and remove what is not.",
          "No analytics is running on this site at present, so no analytics cookie is set today. If we add one, it will load only where you have allowed this category, and this page will be updated first.",
        ],
      },
      {
        id: "functional",
        heading: "Functional cookies",
        body: [
          "Functional cookies would remember choices that make the site more convenient between visits, such as a filter you last applied on the services page.",
          "None is in use at present. Nothing is lost if you decline this category, and if we add anything to it later it will load only where you have allowed it.",
        ],
      },
      {
        id: "optional",
        heading: "Optional cookies and your choice",
        body: [
          "Analytics and functional cookies are optional. When you first arrive you are asked to choose, and nothing optional is stored until you do.",
          "You can accept all categories, reject everything optional, or open the preferences panel and decide category by category. Your choice is remembered so the banner does not reappear on every page.",
          "You can change your mind at any time using the cookie preferences link in the footer.",
        ],
      },
      {
        id: "disable",
        heading: "Disabling cookies in your browser",
        body: [
          "Every major browser lets you block or delete cookies and site data independently of the controls on this site. The setting is usually found under Privacy or Site settings.",
          "In Chrome, open Settings, then Privacy and security, then Third-party cookies and Site data. In Safari, open Settings, then Privacy. In Firefox, open Settings, then Privacy and Security. On a phone, the same settings appear in the browser app's own settings rather than in the operating system.",
          "Blocking all cookies and site data will stop this site from remembering your cookie choice, so you will be asked again on your next visit. Nothing else on the site will stop working.",
        ],
      },
      {
        id: "more",
        heading: "More information",
        body: [
          `Our Privacy Policy explains everything else we collect and the rights you hold under POPIA. If anything here is unclear, contact us at ${contactLine}.`,
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------
     TERMS AND CONDITIONS
     --------------------------------------------------------------------- */
  terms: {
    key: "terms",
    title: "Terms & Conditions",
    eyebrow: "Legal",
    headline: "Terms of use for this website",
    lead: "These terms govern your use of this website. They do not govern work we carry out for you, which is dealt with in the written quotation and contract for that job.",
    updated: UPDATED,
    seo: {
      title: "Terms & Conditions",
      description: `The terms governing use of the ${business.tradingName} website, including intellectual property, quotations, liability and acceptable use.`,
    },
    sections: [
      {
        id: "acceptance",
        heading: "Website usage",
        body: [
          `This website is operated by ${business.legalName}. By browsing it you accept these terms. If you do not accept them, please do not use the site.`,
          "You may view, download and print pages for your own business purposes, such as assessing us as a supplier or preparing an enquiry. You may not use the site in any way that damages it, interferes with anyone else's use of it, or breaks any law.",
          "We may change, suspend or withdraw any part of the site at any time. We aim to keep it available but we do not promise uninterrupted access.",
        ],
      },
      {
        id: "ip",
        heading: "Intellectual property",
        body: [
          `All content on this site, including the ${business.tradingName} name, the logo and wordmark, the written text, the photography, the drawings and icons, the layout and the underlying code, is owned by us or used with permission. It is protected by copyright and trade mark law.`,
          "You may not copy, reproduce, republish or adapt any of it for commercial purposes without our written permission. Quoting a short extract with a clear credit and a link back is acceptable.",
          "The photography on this site shows our own plant, our own workshop and work we have carried out. It may not be used to represent anyone else's capability.",
        ],
      },
      {
        id: "quotations",
        heading: "Quotations and enquiries",
        body: [
          "Nothing on this website is an offer to contract. Service descriptions, machine specifications, method statements and any figures shown are provided for general guidance and to help you frame an enquiry.",
          "A quotation becomes binding only when we issue it to you in writing for your specific scope, and only on the terms stated in that document. Where a quotation and this website differ, the quotation prevails.",
          "Quotations are valid for the period stated on them and are based on the information available at the time. Where site conditions, volumes, ground conditions or the condition of a component turn out to differ materially from what was described, we will tell you and re-quote rather than proceed on a figure that no longer reflects the work.",
          "Plant availability shown or described anywhere on this site is indicative. Availability is confirmed only at the point of booking.",
        ],
      },
      {
        id: "limitations",
        heading: "Service limitations",
        body: [
          "We take care to keep this site accurate, but specifications, capabilities and availability change. We do not warrant that every page is complete, current or free of error at the moment you read it.",
          "Nothing on this site is engineering, safety, legal or financial advice, and it should not be relied on as a substitute for a professional assessment of your own site and circumstances. Any decision to select a machine, a method or a repair approach should be confirmed with us in writing for your specific application.",
          "Our services are offered in the areas listed on this site. Work outside those areas is by arrangement and may carry different terms.",
        ],
      },
      {
        id: "liability",
        heading: "Liability",
        body: [
          "To the fullest extent the law allows, we are not liable for any indirect or consequential loss arising from your use of this website, including loss of profit, loss of production, loss of contracts or loss of data.",
          "Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited, including liability for death or personal injury caused by negligence, or for fraud.",
          "Our liability for work we actually carry out for you is governed by the contract for that work, not by these terms.",
          "Nothing in these terms limits any right you have under the Consumer Protection Act, 68 of 2008, where that Act applies to you.",
        ],
      },
      {
        id: "external",
        heading: "External links",
        body: [
          "This site links to outside services, such as WhatsApp for messaging and mapping applications for directions to our yard. Those links are provided for convenience.",
          "We do not control those services and we are not responsible for their content, their availability or their handling of your information. Following an external link is at your own discretion, and that service's own terms and privacy policy will apply.",
        ],
      },
      {
        id: "responsibilities",
        heading: "Your responsibilities",
        body: [
          "When you use this site, and in particular when you submit an enquiry, you agree to the following.",
        ],
        points: [
          "To give accurate information, and to have authority to submit it on behalf of the company you name.",
          "To send only files that are relevant to the enquiry and that you are entitled to share with us.",
          "Not to submit anything unlawful, defamatory, misleading or infringing, and not to upload anything containing malicious code.",
          "Not to use any automated system to scrape, harvest or overload the site, and not to attempt to gain access to any part of it you have not been given access to.",
          "Not to use our contact details or any address on this site to send unsolicited marketing.",
        ],
      },
      {
        id: "privacy-link",
        heading: "Privacy and cookies",
        body: [
          "Our handling of personal information is set out in the Privacy Policy, and our use of browser storage in the Cookie Policy. Both form part of these terms.",
        ],
      },
      {
        id: "law",
        heading: "Governing law",
        body: [
          "These terms are governed by the law of the Republic of South Africa, and the South African courts have jurisdiction over any dispute arising from them or from your use of this site.",
          "If any provision of these terms is found unenforceable, the rest continues to apply.",
        ],
      },
      {
        id: "contact",
        heading: "Contact information",
        body: [
          `${business.legalName}, ${postal}.`,
          `Telephone ${business.phone}. Email ${business.email}. Questions about these terms can be sent to either.`,
        ],
      },
    ],
  },
};
