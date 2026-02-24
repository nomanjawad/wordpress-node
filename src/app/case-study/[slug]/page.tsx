import { notFound } from "next/navigation";

import CaseStudyTemplate from "@/components/Templates/CaseStudy/CaseStudyTemplate";
import { getSingleCaseStudy } from "@/wordpress/functions/caseStudy";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SingleCaseStudyPage({ params }: Props) {
  const { slug } = await params;

  try {
    const item = await getSingleCaseStudy(slug);

    if (!item) {
      return notFound();
    }

    return <CaseStudyTemplate item={item} />;
  } catch (error) {
    console.error("Error fetching case study:", error);

    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error Loading Case Study</h1>
        <p>There was an error loading this case study.</p>
      </div>
    );
  }
}
