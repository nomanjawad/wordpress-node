import { notFound } from "next/navigation";

import JobTemplate from "@/components/Templates/Job/JobTemplate";
import { getSingleJob } from "@/components/Templates/Job/job.data";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    ff_submit?: string;
    ff_code?: string;
    ff_error?: string;
  }>;
};

export default async function SingleJobPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;

  try {
    const item = await getSingleJob(slug);

    if (!item) {
      return notFound();
    }

    return (
      <JobTemplate
        item={item}
        submitStatus={query.ff_submit}
        submitCode={query.ff_code}
        submitError={query.ff_error}
      />
    );
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
