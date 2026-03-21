"use client";

import { SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { Sidebar } from "../Sidebar";

export default function DashboardGrid({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  return (
    <SimpleGrid
      flex={1}
      templateColumns={isCollapsed ? "auto 1fr" : "300px 1fr"}
      overflow="hidden"
    >
      <Sidebar
        collapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
      />
      {children}
    </SimpleGrid>
  )
}