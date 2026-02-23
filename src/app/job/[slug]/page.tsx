import { notFound } from "next/navigation";

import JobTemplate from "@/components/Templates/Job/JobTemplate";
import { getSingleJob } from "@/components/Templates/Job/job.data";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SingleJobPage({ params }: Props) {
  const { slug } = await params;

  try {
    const item = await getSingleJob(slug);

    if (!item) {
      return notFound();
    }

    return <JobTemplate item={item} />;
  } catch (error) {
    console.error("Error fetching job:", error);

    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error Loading Job</h1>
        <p>There was an error loading this job.</p>
      </div>
    );
  }
}
