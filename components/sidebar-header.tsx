"use client"

import { PanelLeft } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarHeaderContent() {
  const { toggleSidebar } = useSidebar()
  
  return (
    <SidebarMenu className="border-0 bg-transparent">
      <SidebarMenuItem className="border-0 bg-transparent p-0 m-0">
        <SidebarMenuButton 
          size="lg" 
          className="md:h-8 md:p-2 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-md hover:bg-sidebar-primary hover:text-sidebar-primary-foreground focus:bg-sidebar-primary focus:text-sidebar-primary-foreground active:bg-sidebar-primary active:text-sidebar-primary-foreground"
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-4 w-4" />
          <span className="truncate ml-2">arena.report</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}