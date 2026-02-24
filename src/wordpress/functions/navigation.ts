import { print } from "graphql/language/printer";

import { RootQueryToMenuItemConnection } from "@/gql/graphql";
import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";
import { MenuQuery } from "@/wordpress/queries/navigation/MenuQuery";

export async function getNavigationMenuItems(): Promise<RootQueryToMenuItemConnection | { nodes: [] }> {
  try {
    const { menuItems } = await fetchGraphQL<{
      menuItems: RootQueryToMenuItemConnection;
    }>(print(MenuQuery));

    if (menuItems === null) {
      return { nodes: [] };
    }

    return menuItems;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return { nodes: [] };
  }
}
