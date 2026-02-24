import { print } from "graphql/language/printer";

import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";
import { CaseStudyArchiveQuery } from "@/wordpress/queries/caseStudy/CaseStudyArchiveQuery";
import { SingleCaseStudyQuery } from "@/wordpress/queries/caseStudy/SingleCaseStudyQuery";

export type CaseStudyNode = {
  id: string;
  databaseId: number;
  title?: string | null;
  content?: string | null;
  slug?: string | null;
  date?: string | null;
  modified?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
      mediaDetails?: {
        width?: number | null;
        height?: number | null;
      } | null;
    } | null;
  } | null;
  categories?: {
    nodes: Array<{
      name?: string | null;
      slug?: string | null;
    }>;
  } | null;
};

export async function getCaseStudyArchiveItems(): Promise<CaseStudyNode[]> {
  const { caseStudies } = await fetchGraphQL<{ caseStudies: { nodes: CaseStudyNode[] } }>(
    print(CaseStudyArchiveQuery)
  );

  return caseStudies?.nodes || [];
}

export async function getSingleCaseStudy(
  slug: string
): Promise<CaseStudyNode | null> {
  const { caseStudy } = await fetchGraphQL<{ caseStudy: CaseStudyNode | null }>(
    print(SingleCaseStudyQuery),
    { slug }
  );

  return caseStudy;
}
