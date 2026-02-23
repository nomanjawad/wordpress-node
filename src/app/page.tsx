import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Archives",
  description: "Archive index page",
};

const archiveLinks = [
  { href: "/blog", label: "Blog Archive" },
  { href: "/case-study", label: "Case Study Archive" },
  { href: "/job", label: "Job Archive" },
];

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Archives</h1>
      <p>Select an archive page:</p>

      <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
        {archiveLinks.map((item) => (
          <li key={item.href} style={{ marginBottom: "0.75rem" }}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
