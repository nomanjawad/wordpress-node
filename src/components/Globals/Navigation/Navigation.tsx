import Link from "next/link";

import styles from "./Navigation.module.css";

import { MenuItem } from "@/gql/graphql";
import { getNavigationMenuItems } from "@/wordpress/functions/navigation";

export default async function Navigation() {
  const menuItems = await getNavigationMenuItems();

  return (
    <nav
      className={styles.navigation}
      role="navigation"
      itemScope
      itemType="http://schema.org/SiteNavigationElement"
    >
      <Link
        itemProp="url"
        href="/blog"
        style={{
          marginRight: "1rem",
          fontWeight: "bold",
          color: "#0070f3",
        }}
      >
        <span itemProp="name">Blog Archive</span>
      </Link>
      
      {menuItems.nodes.map((item: MenuItem, index: number) => {
        if (!item.uri) return null;

        return (
          <Link
            itemProp="url"
            href={item.uri}
            key={index}
            target={item.target || "_self"}
          >
            <span itemProp="name">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
