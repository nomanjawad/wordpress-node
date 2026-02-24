import Link from "next/link";
import { print } from "graphql/language/printer";
import gql from "graphql-tag";

import styles from "./Navigation.module.css";

import { MenuItem, RootQueryToMenuItemConnection } from "@/gql/graphql";
import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";

const MENU_QUERY = gql`
  query MenuQuery {
    menuItems {
      nodes {
        id
        label
        uri
        target
      }
    }
  }
`;

export default async function Navigation() {
  const { menuItems } = await fetchGraphQL<{
    menuItems: RootQueryToMenuItemConnection;
  }>(print(MENU_QUERY));

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
