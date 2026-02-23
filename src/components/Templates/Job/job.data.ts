import { print } from "graphql/language/printer";

import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { JobArchiveQuery } from "@/queries/job/JobArchiveQuery";
import { SingleJobQuery } from "@/queries/job/SingleJobQuery";

export type JobNode = {
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
  terms?: {
    nodes: Array<{
      __typename?: string;
      id?: string | null;
      name?: string | null;
    }>;
  } | null;
};

export async function getJobArchiveItems(): Promise<JobNode[]> {
  const { jobs } = await fetchGraphQL<{ jobs: { nodes: JobNode[] } }>(
    print(JobArchiveQuery)
  );

  return jobs?.nodes || [];
}

export async function getSingleJob(slug: string): Promise<JobNode | null> {
  const { job } = await fetchGraphQL<{ job: JobNode | null }>(
    print(SingleJobQuery),
    { slug }
  );

  return job;
}
