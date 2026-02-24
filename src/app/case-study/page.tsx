import type { Metadata } from "next";

import CaseStudyArchiveTemplate from "@/components/Templates/CaseStudy/CaseStudyArchiveTemplate";
import { getCaseStudyArchiveItems } from "@/wordpress/functions/caseStudy";

export const metadata: Metadata = {
  title: "Case Study Archive",
  description: "All case studies",
};

export default async function CaseStudyArchivePage() {
  const items = await getCaseStudyArchiveItems();

  return <CaseStudyArchiveTemplate items={items} />;
}
