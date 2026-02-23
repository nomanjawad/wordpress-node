import type { Metadata } from "next";

import JobArchiveTemplate from "@/components/Templates/Job/JobArchiveTemplate";
import { getJobArchiveItems } from "@/components/Templates/Job/job.data";

export const metadata: Metadata = {
  title: "Job Archive",
  description: "All jobs",
};

export default async function JobArchivePage() {
  const items = await getJobArchiveItems();

  return <JobArchiveTemplate items={items} />;
}
