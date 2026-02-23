import Link from "next/link";
import { print } from "graphql/language/printer";

import styles from "./Navigation.module.css";

import { MenuItem, RootQueryToMenuItemConnection } from "@/gql/graphql";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import gql from "graphql-tag";

async function getData() {
  try {
    const menuQuery = gql`
      query MenuQuery {
        menuItems(first: 10) {
          nodes {
            uri
            target
            label
          }
        }
      }
    `;

    const { menuItems } = await fetchGraphQL<{
      menuItems: RootQueryToMenuItemConnection;
    }>(print(menuQuery));

    if (menuItems === null) {
      return { nodes: [] };
    }

    return menuItems;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return { nodes: [] };
  }
}

export default async function Navigation() {
  const menuItems = await getData();

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
