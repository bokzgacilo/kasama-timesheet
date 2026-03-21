"use client";

import { Flex, Link as ChakraLink, Stack, Text, IconButton, Icon, Center, Spinner } from "@chakra-ui/react"
import { LuCalendar, LuChartCandlestick, LuClipboard, LuClock, LuLayoutDashboard, LuRocket, LuStar, LuUsers } from "react-icons/lu"
import NextLink from "next/link"
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRight, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export const Sidebar = ({ collapsed, onCollapsedChange }: { collapsed: boolean, onCollapsedChange: (collapsed: boolean) => void }) => {
  const supabase = createClient();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("");
  const [loadingRole, setLoadingRole] = useState<boolean>(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserRole(user.user_metadata.role);
        setLoadingRole(false)
      }
    }
    fetchUserRole();
  }, [])

  const changeView = (path: string) => {
    router.push(path);
  }

  return <Stack
    p={2}
    gap={0}
    borderRight="1px solid"
    borderColor="border"
  >
    {
      loadingRole ?
        <Center mt={4}>
          <Spinner />
        </Center> :
        <>
          <Flex justifyContent="flex-end">
            <IconButton
              size="md"
              variant="ghost"
              onClick={() => onCollapsedChange(!collapsed)}
            >
              <Icon as={!collapsed ? TbLayoutSidebarLeftCollapse : TbLayoutSidebarRightCollapse} />
            </IconButton>
          </Flex>
          <Text hidden={collapsed} color="fg.muted" fontWeight="semibold" fontSize="12px" mb={2}>TRACK</Text>
          <IconButton
            size="md"
            variant="ghost"
            justifyContent={collapsed ? "center" : "flex-start"}
            px={collapsed ? 0 : 2}
            onClick={() => changeView("/dashboard/")}
            gap={4}
            title="Dashboard"
          >
            <LuLayoutDashboard />
            <Text fontSize="14px" hidden={collapsed}>Dashboard</Text>
          </IconButton>
          <IconButton
            size="md"
            variant="ghost"
            justifyContent={collapsed ? "center" : "flex-start"}
            px={collapsed ? 0 : 2}
            gap={4}
            onClick={() => changeView("/dashboard/calendar")}
          >
            <LuCalendar />
            <Text fontSize="14px" hidden={collapsed}>Calendar</Text>
          </IconButton>
          <IconButton
            size="md"
            variant="ghost"
            justifyContent={collapsed ? "center" : "flex-start"}
            px={collapsed ? 0 : 2}
            onClick={() => changeView("/dashboard/time-logs")}
            gap={4}
          >
            <LuClock />
            <Text fontSize="14px" hidden={collapsed}>Time Logs</Text>
          </IconButton>
          <IconButton
            size="md"
            variant="ghost"
            justifyContent={collapsed ? "center" : "flex-start"}
            px={collapsed ? 0 : 2}
            onClick={() => changeView("/dashboard/time-reports")}
            gap={4}
          >
            <LuChartCandlestick />
            <Text fontSize="14px" hidden={collapsed}>Reports</Text>
          </IconButton>

          <Text hidden={collapsed} mt={4} color="fg.muted" fontWeight="semibold" fontSize="12px" mb={2}>LEAVE</Text>
          <IconButton
            size="md"
            variant="ghost"
            justifyContent={collapsed ? "center" : "flex-start"}
            px={collapsed ? 0 : 2}
            onClick={() => changeView("/dashboard/leave-request")}
            gap={4}
          >
            <LuCalendar />
            <Text fontSize="14px" hidden={collapsed}>Leave Request</Text>
          </IconButton>
          <IconButton
            size="md"
            variant="ghost"
            justifyContent={collapsed ? "center" : "flex-start"}
            px={collapsed ? 0 : 2}
            onClick={() => changeView("/dashboard/holidays-events")}
            gap={4}
          >
            <LuStar />
            <Text fontSize="14px" hidden={collapsed}>Holidays & Events</Text>
          </IconButton>

          {
            userRole === "manager" && <>
              <Text hidden={collapsed} mt={4} color="fg.muted" fontWeight="semibold" fontSize="12px" mb={2}>MANAGE</Text>
              <IconButton
                size="md"
                variant="ghost"
                justifyContent={collapsed ? "center" : "flex-start"}
                px={collapsed ? 0 : 2}
                onClick={() => changeView("/dashboard/leave-request")}
                gap={4}
              >
                <LuUsers />
                <Text fontSize="14px" hidden={collapsed}>Team Members</Text>
              </IconButton>
              <IconButton
                size="md"
                variant="ghost"
                justifyContent={collapsed ? "center" : "flex-start"}
                px={collapsed ? 0 : 2}
                onClick={() => changeView("/dashboard/leave-request")}
                gap={4}
              >
                <LuRocket />
                <Text fontSize="14px" hidden={collapsed}>Projects/Tasks</Text>
              </IconButton>
              <IconButton
                size="md"
                variant="ghost"
                justifyContent={collapsed ? "center" : "flex-start"}
                px={collapsed ? 0 : 2}
                onClick={() => changeView("/dashboard/holidays-events")}
                gap={4}
              >
                <LuClipboard />
                <Text fontSize="14px" hidden={collapsed}>Invoices</Text>
              </IconButton>
            </>
          }
        </>
    }

  </Stack>
} 