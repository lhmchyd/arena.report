"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import html2canvas from "html2canvas"
import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  KeyRound,
  TrendingUp,
  DollarSign,
  Target,
  Edit,
  Trash2,
  Info,
  Home,
  BarChart3,
  Settings,
  Menu,
  X,
  TrendingDown,
  User,
  Crown,
  Shield,
  Star,
  Zap,
  Trophy,
  Crosshair,
  Skull,
  Heart,
  Diamond,
  Flame,
  Rocket,
  Camera,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Upload,
  FileText,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, CartesianGrid } from "recharts"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KeyData {
  id: string
  name: string
  location: string
  cost: number
  currentUses: number
  totalRuns: number
  totalProfit: number
  runs: Array<{ runNumber: number; profit: number; date: string }>
}

interface Profile {
  id: string
  name: string
  icon: string
  createdAt: string
  keys: KeyData[]
  armors: ArmorData[]
}

interface ArmorData {
  id: string
  name: string
  armorClass: number
  protectedAreas: string[]
  material: string
  movementSpeed: string
  ergonomics: string
  weight: string
  newDurability: number
  likeNewDurability: number
  wornDurability: number
  condition: "Body Armor" | "Armored Rig"
  repairCost: number
  purchaseDate: string
  repairHistory: Array<{ date: string; cost: number; durabilityRestored: number }>
  repairDeductions: {
    low: number
    medium: number
    high: number
  }
  currentDurability?: number
}

const PROFILE_ICONS = [
  "User",
  "UserCircle",
  "Crown",
  "Shield",
  "Star",
  "Zap",
  "Target",
  "Trophy",
  "Gamepad2",
  "Sword",
  "Crosshair",
  "Skull",
  "Heart",
  "Diamond",
  "Flame",
  "Rocket",
]

const LOCATIONS = ["Farm", "Armory", "TV Station", "Northridge"]

const ARMOR_CONDITIONS = ["Body Armor", "Armored Rig"] as const

const ARMOR_MATERIALS = [
  "Aramid",
  "Hardened Steel",
  "Polyethylene",
  "Aluminum",
  "Composite",
  "Titanium",
  "Ceramic",
] as const

const PROTECTED_AREAS = ["Chest", "Shoulder", "Upper Abdomen", "Lower Abdomen"] as const

const REPAIR_NPCS = [
  { id: "low", name: "Joel Garrison", color: "text-red-600", defaultDeduction: 8.1 },
  { id: "medium", name: "Deke Vinson", color: "text-gray-600", defaultDeduction: 6.1 },
  { id: "high", name: "Randall Fisher", color: "text-green-600", defaultDeduction: 4.5 },
] as const

// Chart colors
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export default function KeyTracker() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<KeyData | null>(null)
  const [infoKey, setInfoKey] = useState<KeyData | null>(null)
  const [runProfit, setRunProfit] = useState(0)
  const [keys, setKeys] = useState<KeyData[]>([])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<KeyData | null>(null)
  const [newKey, setNewKey] = useState({
    name: "",
    location: "",
    cost: 0,
  })

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfileId, setCurrentProfileId] = useState<string>("")
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isCreateProfileDialogOpen, setIsCreateProfileDialogOpen] = useState(false)
  const [newProfile, setNewProfile] = useState({ name: "", icon: "User" })
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    location: "",
    cost: "",
  })

  const [editingRun, setEditingRun] = useState<{ keyId: string; runNumber: number; profit: number } | null>(null)
  const [isEditRunDialogOpen, setIsEditRunDialogOpen] = useState(false)

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: "key" | "run" | "profile" | "armor"
    id: string
    name: string
    runNumber?: number
  } | null>(null)

  const [mainTab, setMainTab] = useState("keys")
  const [armors, setArmors] = useState<ArmorData[]>([
    {
      id: "1",
      name: "926 Composite Body Armor",
      armorClass: 5,
      protectedAreas: ["Chest"],
      material: "Composite",
      movementSpeed: "-4%",
      ergonomics: "-3",
      weight: "6.20kg",
      newDurability: 70,
      likeNewDurability: 60,
      wornDurability: 49,
      condition: "Body Armor",
      repairCost: 0,
      purchaseDate: new Date().toISOString(),
      repairHistory: [],
      repairDeductions: {
        low: 8.1,
        medium: 6.1,
        high: 4.5,
      },
    },
    {
      id: "2",
      name: "BT101 Tactical Body Armor",
      armorClass: 6,
      protectedAreas: ["Chest", "Upper Abdomen"],
      material: "Ceramic",
      movementSpeed: "-5%",
      ergonomics: "-4",
      weight: "7.50kg",
      newDurability: 100,
      likeNewDurability: 85,
      wornDurability: 70,
      condition: "Armored Rig",
      repairCost: 25000,
      purchaseDate: new Date().toISOString(),
      repairHistory: [],
      repairDeductions: {
        low: 8.1,
        medium: 6.1,
        high: 4.5,
      },
    },
  ])

  // Armor-specific states
  const [armorSearchTerm, setArmorSearchTerm] = useState("")
  const [armorConditionFilter, setArmorConditionFilter] = useState<string>("")
  const [isAddArmorDialogOpen, setIsAddArmorDialogOpen] = useState(false)
  const [newArmor, setNewArmor] = useState({
    name: "",
    armorClass: 1,
    protectedAreas: [] as string[],
    material: "",
    movementSpeed: "",
    ergonomics: "",
    weight: "",
    newDurability: 70,
    likeNewDurability: 60,
    wornDurability: 49,
    condition: "Body Armor" as const,
    repairDeductions: {
      low: 8.1,
      medium: 6.1,
      high: 4.5,
    },
  })

  // Repair states
  const [isRepairDialogOpen, setIsRepairDialogOpen] = useState(false)
  const [repairingArmor, setRepairingArmor] = useState<ArmorData | null>(null)
  const [selectedRepairNPC, setSelectedRepairNPC] = useState<"low" | "medium" | "high" | "">("")

  // Current durability update states
  const [isUpdateDurabilityDialogOpen, setIsUpdateDurabilityDialogOpen] = useState(false)
  const [updatingArmor, setUpdatingArmor] = useState<ArmorData | null>(null)
  const [newCurrentDurability, setNewCurrentDurability] = useState("")

  // Export/Import states
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importData, setImportData] = useState("")
  const [importError, setImportError] = useState("")
  const [exportData, setExportData] = useState("")

  // Helper function to ensure armor has repair deductions
  const ensureRepairDeductions = (armor: ArmorData): ArmorData => {
    if (!armor.repairDeductions) {
      return {
        ...armor,
        repairDeductions: {
          low: 8.1,
          medium: 6.1,
          high: 4.5,
        },
      }
    }
    return armor
  }

  // Load profiles and current profile from localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem("arena-breakout-profiles")
    const savedCurrentProfileId = localStorage.getItem("arena-breakout-current-profile")

    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles)
      // Ensure all armors have repairDeductions
      const updatedProfiles = parsedProfiles.map((profile: Profile) => ({
        ...profile,
        armors: (profile.armors || []).map(ensureRepairDeductions),
      }))
      setProfiles(updatedProfiles)

      if (savedCurrentProfileId && updatedProfiles.find((p: Profile) => p.id === savedCurrentProfileId)) {
        setCurrentProfileId(savedCurrentProfileId)
        const currentProfile = updatedProfiles.find((p: Profile) => p.id === savedCurrentProfileId)
        if (currentProfile) {
          setKeys(currentProfile.keys || [])
          setArmors((currentProfile.armors || []).map(ensureRepairDeductions))
        }
      } else if (updatedProfiles.length > 0) {
        setCurrentProfileId(updatedProfiles[0].id)
        setKeys(updatedProfiles[0].keys || [])
        setArmors((updatedProfiles[0].armors || []).map(ensureRepairDeductions))
      }
    } else {
      // Create default profile with repairDeductions
      const defaultProfile: Profile = {
        id: "default",
        name: "Default Profile",
        icon: "User",
        createdAt: new Date().toISOString(),
        keys: [],
        armors: [
          {
            id: "1",
            name: "926 Composite Body Armor",
            armorClass: 5,
            protectedAreas: ["Chest"],
            material: "Composite",
            movementSpeed: "-4%",
            ergonomics: "-3",
            weight: "6.20kg",
            newDurability: 70,
            likeNewDurability: 60,
            wornDurability: 49,
            currentDurability: 70,
            condition: "Body Armor",
            repairCost: 0,
            purchaseDate: new Date().toISOString(),
            repairHistory: [],
            repairDeductions: {
              low: 8.1,
              medium: 6.1,
              high: 4.5,
            },
          },
        ],
      }
      setProfiles([defaultProfile])
      setCurrentProfileId(defaultProfile.id)
      setKeys(defaultProfile.keys)
      setArmors(defaultProfile.armors)
    }
  }, [])

  useEffect(() => {
    // Set loading to false after a short delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [profiles, currentProfileId])

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem("arena-breakout-profiles", JSON.stringify(profiles))
    }
  }, [profiles])

  // Save current profile ID
  useEffect(() => {
    if (currentProfileId) {
      localStorage.setItem("arena-breakout-current-profile", currentProfileId)
    }
  }, [currentProfileId])

  // Update current profile's keys and armors when they change
  useEffect(() => {
    if (currentProfileId && profiles.length > 0) {
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === currentProfileId ? { ...profile, keys: keys, armors: armors } : profile,
        ),
      )
    }
  }, [keys, armors, currentProfileId])

  const calculateROI = (key: KeyData) => {
    if (key.totalRuns === 0) return 0
    const totalInvestment = key.cost
    const netProfit = key.totalProfit - totalInvestment
    return (netProfit / totalInvestment) * 100
  }

  const openRunDialog = (key: KeyData) => {
    setSelectedKey(key)
    setRunProfit(0)
    setIsRunDialogOpen(true)
  }

  const openInfoDialog = (key: KeyData) => {
    setInfoKey(key)
    setIsInfoDialogOpen(true)
  }

  const submitRun = () => {
    if (!selectedKey) return

    const newRun = {
      runNumber: selectedKey.totalRuns + 1,
      profit: runProfit,
      date: new Date().toISOString(),
    }

    setKeys((prevKeys) =>
      prevKeys.map((key) => {
        if (key.id === selectedKey.id) {
          return {
            ...key,
            currentUses: key.currentUses + 1,
            totalRuns: key.totalRuns + 1,
            totalProfit: key.totalProfit + runProfit,
            runs: [...key.runs, newRun],
          }
        }
        return key
      }),
    )

    setIsRunDialogOpen(false)
    setSelectedKey(null)
    setRunProfit(0)
  }

  const addKey = () => {
    const errors = {
      name: "",
      location: "",
      cost: "",
    }

    // Validation checks
    if (!newKey.name.trim()) {
      errors.name = "Key name is required"
    }

    if (!newKey.location) {
      errors.location = "Please select a location"
    }

    if (newKey.cost <= 0) {
      errors.cost = "Key cost must be greater than 0"
    }

    setValidationErrors(errors)

    // If there are any errors, don't proceed
    if (Object.values(errors).some((error) => error !== "")) {
      return
    }

    const key: KeyData = {
      id: Date.now().toString(),
      name: newKey.name.trim(),
      location: newKey.location,
      cost: newKey.cost,
      currentUses: 0,
      totalRuns: 0,
      totalProfit: 0,
      runs: [],
    }

    setKeys([...keys, key])
    setNewKey({ name: "", location: "", cost: 0 })
    setValidationErrors({ name: "", location: "", cost: "" })
    setIsAddDialogOpen(false)
  }

  const addArmor = () => {
    const armor: ArmorData = {
      id: Date.now().toString(),
      name: newArmor.name,
      armorClass: newArmor.armorClass,
      protectedAreas: newArmor.protectedAreas,
      material: newArmor.material,
      movementSpeed: newArmor.movementSpeed,
      ergonomics: newArmor.ergonomics,
      weight: newArmor.weight,
      newDurability: newArmor.newDurability,
      likeNewDurability: newArmor.likeNewDurability,
      wornDurability: newArmor.wornDurability,
      currentDurability: newArmor.newDurability, // Start with new durability
      condition: newArmor.condition,
      repairCost: 0,
      purchaseDate: new Date().toISOString(),
      repairHistory: [],
      repairDeductions: newArmor.repairDeductions,
    }

    setArmors([...armors, armor])
    setNewArmor({
      name: "",
      armorClass: 1,
      protectedAreas: [],
      material: "",
      movementSpeed: "",
      ergonomics: "",
      weight: "",
      newDurability: 70,
      likeNewDurability: 60,
      wornDurability: 49,
      condition: "Body Armor",
      repairDeductions: {
        low: 8.1,
        medium: 6.1,
        high: 4.5,
      },
    })
    setIsAddArmorDialogOpen(false)
  }

  const editKey = () => {
    if (!editingKey) return
    setKeys((prevKeys) => prevKeys.map((key) => (key.id === editingKey.id ? editingKey : key)))
    setIsEditDialogOpen(false)
    setEditingKey(null)
  }

  const deleteKey = (keyId: string) => {
    const key = keys.find((k) => k.id === keyId)
    if (key) {
      setDeleteConfirmation({
        type: "key",
        id: keyId,
        name: key.name,
      })
    }
  }

  const deleteArmor = (armorId: string) => {
    const armor = armors.find((a) => a.id === armorId)
    if (armor) {
      setDeleteConfirmation({
        type: "armor",
        id: armorId,
        name: armor.name,
      })
    }
  }

  const confirmDeleteKey = () => {
    if (deleteConfirmation && deleteConfirmation.type === "key") {
      setKeys((prevKeys) => prevKeys.filter((key) => key.id !== deleteConfirmation.id))
      setDeleteConfirmation(null)
    }
  }

  const confirmDeleteArmor = () => {
    if (deleteConfirmation && deleteConfirmation.type === "armor") {
      setArmors((prevArmors) => prevArmors.filter((armor) => armor.id !== deleteConfirmation.id))
      setDeleteConfirmation(null)
    }
  }

  const resetKeyUses = (keyId: string) => {
    setKeys((prevKeys) => prevKeys.map((key) => (key.id === keyId ? { ...key, currentUses: 0 } : key)))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getAverageProfit = (key: KeyData) => {
    if (key.runs.length === 0) return 0
    return key.totalProfit / key.runs.length
  }

  const totalInvestment = keys.reduce((sum, key) => sum + (key.cost || 0), 0)
  const totalProfit = keys.reduce((sum, key) => sum + (key.totalProfit || 0), 0)
  const totalRuns = keys.reduce((sum, key) => sum + (key.totalRuns || 0), 0)

  // Chart data preparation
  const locationData = LOCATIONS.map((location, index) => {
    const locationKeys = keys.filter((key) => key.location === location)
    const profit = locationKeys.reduce((sum, key) => sum + key.totalProfit, 0)
    const runs = locationKeys.reduce((sum, key) => sum + key.totalRuns, 0)
    return {
      location,
      profit,
      runs,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }
  }).filter((item) => item.profit > 0 || item.runs > 0)

  // Calendar data preparation
  const getCalendarData = () => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    // Get all runs for the current month
    const monthRuns = keys.flatMap((key) =>
      key.runs
        .filter((run) => {
          const runDate = new Date(run.date)
          return runDate.getFullYear() === year && runDate.getMonth() === month
        })
        .map((run) => ({
          ...run,
          keyName: key.name,
          keyLocation: key.location,
          date: new Date(run.date),
        })),
    )

    // Group runs by day
    const dailyData: {
      [key: number]: {
        profit: number
        runs: Array<{ runNumber: number; profit: number; keyName: string; keyLocation: string }>
      }
    } = {}

    monthRuns.forEach((run) => {
      const day = run.date.getDate()
      if (!dailyData[day]) {
        dailyData[day] = { profit: 0, runs: [] }
      }
      dailyData[day].profit += run.profit
      dailyData[day].runs.push({
        runNumber: run.runNumber,
        profit: run.profit,
        keyName: run.keyName,
        keyLocation: run.keyLocation,
      })
    })

    return {
      daysInMonth,
      startingDayOfWeek,
      dailyData,
      monthName: firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    }
  }

  const calendarData = getCalendarData()

  // Enhanced profit trend data with cumulative profits
  const profitTrendData = keys
    .flatMap((key) => key.runs.map((run) => ({ ...run, keyName: key.name })))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, run, index) => {
      const cumulativeProfit = acc.length > 0 ? acc[acc.length - 1].cumulative + run.profit : run.profit
      acc.push({
        day: new Date(run.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        profit: run.profit,
        cumulative: cumulativeProfit,
        date: new Date(run.date).toLocaleDateString(),
      })
      return acc
    }, [] as any[])
    .slice(-14) // Last 14 data points

  // Calculate trend percentages for metric cards
  const calculateTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "keys", label: "Key Management", icon: KeyRound }, // Changed from Key to KeyRound
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const mainTabs = [
    { id: "keys", label: "Key Tracker", icon: KeyRound }, // Changed from Key to KeyRound
    { id: "armor", label: "Armor Durability", icon: Shield },
  ]

  const getCurrentProfile = () => {
    return profiles.find((p) => p.id === currentProfileId)
  }

  const switchProfile = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      setCurrentProfileId(profileId)
      setKeys(profile.keys || [])
      setArmors(profile.armors || [])
      setIsProfileDialogOpen(false)
    }
  }

  const createProfile = () => {
    const profile: Profile = {
      id: Date.now().toString(),
      name: newProfile.name,
      icon: newProfile.icon,
      createdAt: new Date().toISOString(),
      keys: [],
      armors: [],
    }
    setProfiles([...profiles, profile])
    setNewProfile({ name: "", icon: "User" })
    setIsCreateProfileDialogOpen(false)
  }

  const updateProfile = () => {
    if (!editingProfile) return
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) => (profile.id === editingProfile.id ? editingProfile : profile)),
    )
    setIsEditProfileDialogOpen(false)
    setEditingProfile(null)
  }

  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return // Don't delete the last profile

    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      setDeleteConfirmation({
        type: "profile",
        id: profileId,
        name: profile.name,
      })
    }
  }

  const confirmDeleteProfile = () => {
    if (deleteConfirmation && deleteConfirmation.type === "profile") {
      const newProfiles = profiles.filter((p) => p.id !== deleteConfirmation.id)
      setProfiles(newProfiles)

      if (currentProfileId === deleteConfirmation.id) {
        const newCurrentProfile = newProfiles[0]
        setCurrentProfileId(newCurrentProfile.id)
        setKeys(newCurrentProfile.keys || [])
        setArmors(newCurrentProfile.armors || [])
      }

      setDeleteConfirmation(null)
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      User,
      UserCircle: () => (
        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-xs">U</div>
      ),
      Crown,
      Shield,
      Star,
      Zap,
      Target,
      Trophy,
      Gamepad2: () => <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center text-xs">G</div>,
      Sword: () => <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center text-xs">S</div>,
      Crosshair,
      Skull,
      Heart,
      Diamond,
      Flame,
      Rocket,
    }

    const IconComponent = iconMap[iconName] || User
    return <IconComponent className="h-4 w-4" />
  }

  // Filter armors based on search and condition
  const filteredArmors = armors.filter((armor) => {
    const matchesSearch = armor.name.toLowerCase().includes(armorSearchTerm.toLowerCase())
    const matchesCondition = !armorConditionFilter || armor.condition === armorConditionFilter
    return matchesSearch && matchesCondition
  })

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Body Armor":
        return "text-blue-600"
      case "Armored Rig":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  // Helper function to get max durability based on condition
  const getMaxDurabilityForCondition = (armor: ArmorData) => {
    switch (armor.condition) {
      case "Body Armor":
        return armor.newDurability
      case "Armored Rig":
        return armor.likeNewDurability
      default:
        return armor.newDurability
    }
  }

  // Helper functions for protected areas
  const addProtectedArea = (area: string) => {
    if (!newArmor.protectedAreas.includes(area)) {
      setNewArmor({
        ...newArmor,
        protectedAreas: [...newArmor.protectedAreas, area],
      })
    }
  }

  const removeProtectedArea = (area: string) => {
    setNewArmor({
      ...newArmor,
      protectedAreas: newArmor.protectedAreas.filter((a) => a !== area),
    })
  }

  // Repair functions
  const openRepairDialog = (armor: ArmorData) => {
    setRepairingArmor(armor)
    setSelectedRepairNPC("")
    setIsRepairDialogOpen(true)
  }

  const repairArmor = () => {
    if (!repairingArmor || !selectedRepairNPC) return

    const armorWithDeductions = ensureRepairDeductions(repairingArmor)
    const deduction = armorWithDeductions.repairDeductions[selectedRepairNPC]
    const maxDurability = getMaxDurabilityForCondition(repairingArmor)
    const newDurability = Math.max(0, maxDurability - deduction)

    setArmors((prevArmors) =>
      prevArmors.map((armor) =>
        armor.id === repairingArmor.id
          ? {
              ...ensureRepairDeductions(armor),
              currentDurability: newDurability,
              repairHistory: [
                ...armor.repairHistory,
                {
                  date: new Date().toISOString(),
                  cost: 0,
                  durabilityRestored: armor.currentDurability - newDurability,
                },
              ],
            }
          : ensureRepairDeductions(armor),
      ),
    )

    setIsRepairDialogOpen(false)
    setRepairingArmor(null)
    setSelectedRepairNPC("")
  }

  // Export/Import functions
  const exportArmors = () => {
    const exportPayload = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      profileName: getCurrentProfile()?.name || "Unknown Profile",
      armors: armors.map((armor) => ({
        name: armor.name,
        armorClass: armor.armorClass,
        protectedAreas: armor.protectedAreas,
        material: armor.material,
        movementSpeed: armor.movementSpeed,
        ergonomics: armor.ergonomics,
        weight: armor.weight,
        newDurability: armor.newDurability,
        likeNewDurability: armor.likeNewDurability,
        wornDurability: armor.wornDurability,
        currentDurability: armor.currentDurability,
        armorType: armor.condition, // Changed from condition to armorType
        repairDeductions: armor.repairDeductions,
      })),
    }

    const jsonString = JSON.stringify(exportPayload, null, 2)
    setExportData(jsonString)
    setIsExportDialogOpen(true)
  }

  const copyExportData = async () => {
    try {
      await navigator.clipboard.writeText(exportData)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
    }
  }

  const downloadExportData = () => {
    const blob = new Blob([exportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `arena-breakout-armors-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importArmors = () => {
    setImportError("")

    if (!importData.trim()) {
      setImportError("Please paste the armor data to import")
      return
    }

    try {
      const parsed = JSON.parse(importData)

      // Validate the structure
      if (!parsed.armors || !Array.isArray(parsed.armors)) {
        setImportError("Invalid data format. Please make sure you're importing armor data.")
        return
      }

      // Validate each armor entry
      const validArmors: ArmorData[] = []
      for (const armor of parsed.armors) {
        if (!armor.name || !armor.material || typeof armor.armorClass !== "number") {
          setImportError("Invalid armor data structure. Some required fields are missing.")
          return
        }

        // Create a new armor entry with fresh ID and current date
        const newArmor: ArmorData = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: armor.name,
          armorClass: armor.armorClass,
          protectedAreas: Array.isArray(armor.protectedAreas) ? armor.protectedAreas : [],
          material: armor.material,
          movementSpeed: armor.movementSpeed || "",
          ergonomics: armor.ergonomics || "",
          weight: armor.weight || "",
          newDurability: armor.newDurability || 70,
          likeNewDurability: armor.likeNewDurability || 60,
          wornDurability: armor.wornDurability || 49,
          currentDurability: armor.currentDurability || armor.newDurability || 70,
          condition:
            armor.armorType === "Body Armor" || armor.armorType === "Armored Rig" ? armor.armorType : "Body Armor", // Handle armorType field
          repairCost: 0, // Reset repair cost
          purchaseDate: new Date().toISOString(),
          repairHistory: [], // Reset repair history
          repairDeductions: armor.repairDeductions || {
            low: 8.1,
            medium: 6.1,
            high: 4.5,
          },
        }

        validArmors.push(newArmor)
      }

      // Add imported armors to current collection
      setArmors((prevArmors) => [...prevArmors, ...validArmors])
      setImportData("")
      setIsImportDialogOpen(false)

      // You could add a success toast notification here
      console.log(`Successfully imported ${validArmors.length} armor entries`)
    } catch (error) {
      setImportError("Invalid JSON format. Please check your data and try again.")
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-50">Dashboard Overview</h2>
              <p className="text-muted-foreground">Track your key performance and profitability</p>
            </div>

            {/* Enhanced Stats Cards with Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(totalInvestment || 0).toLocaleString()}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>Total spent on keys</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${(totalProfit || 0).toLocaleString()}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span>Revenue from all runs</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {keys.reduce((total, key) => total + (key.runs?.length || 0), 0)}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span>Completed key runs</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  {(totalProfit || 0) - (totalInvestment || 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${(totalProfit || 0) - (totalInvestment || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ${((totalProfit || 0) - (totalInvestment || 0)).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {(totalProfit || 0) - (totalInvestment || 0) >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span>Profit after investment</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Area Chart */}
            {!isLoading && profitTrendData.length > 0 && (
              <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Profit Performance</CardTitle>
                    <CardDescription>Cumulative profit over time from all key runs</CardDescription>
                  </div>
                  <div className="flex">
                    <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm bg-transparent">
                      <TrendingUp className="h-4 w-4" />
                      Trending up
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                  <ChartContainer
                    config={{
                      cumulative: {
                        label: "Cumulative Profit",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <AreaChart data={profitTrendData}>
                      <defs>
                        <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-cumulative)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-cumulative)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => value}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => value}
                            formatter={(value, name, props) => (
                              <>
                                <div
                                  className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                  style={
                                    {
                                      "--color-bg": `var(--color-${name})`,
                                    } as React.CSSProperties
                                  }
                                />
                                {name === "cumulative" ? "Cumulative Profit" : name}
                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                  ${(Number(value) || 0).toLocaleString()}
                                </div>
                              </>
                            )}
                          />
                        }
                      />
                      <AreaChart
                        dataKey="cumulative"
                        type="natural"
                        fill="url(#fillCumulative)"
                        stroke="var(--color-cumulative)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* Charts Section */}
            {!isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Location Performance Pie Chart */}
                {locationData.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Profit by Location</CardTitle>
                      <CardDescription>Distribution of profits across different locations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          profit: {
                            label: "Profit",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={locationData}
                              dataKey="profit"
                              nameKey="location"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ location, profit }) => `${location}: $${(profit || 0).toLocaleString()}`}
                            >
                              {locationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload
                                  return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                                            Location
                                          </span>
                                          <span className="font-bold text-muted-foreground">{data.location}</span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[0.70rem] uppercase text-muted-foreground">Profit</span>
                                          <span className="font-bold">${(data.profit || 0).toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Profit by Location</CardTitle>
                      <CardDescription>Distribution of profits across different locations</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No location data available</p>
                        <p className="text-sm">Complete some key runs to see location performance</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Calendar View */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Daily Performance Calendar</CardTitle>
                        <CardDescription>Hover over days to see profits and key usage</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[120px] text-center">{calendarData.monthName}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] p-2">
                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: calendarData.startingDayOfWeek }).map((_, index) => (
                          <div key={`empty-${index}`} className="h-8" />
                        ))}

                        {/* Calendar days */}
                        {Array.from({ length: calendarData.daysInMonth }).map((_, index) => {
                          const day = index + 1
                          const dayData = calendarData.dailyData[day]
                          const hasData = dayData && dayData.runs.length > 0

                          return (
                            <div
                              key={day}
                              className={`h-8 border rounded flex items-center justify-center text-xs relative cursor-pointer transition-all hover:border-primary group ${
                                hasData ? "bg-primary/10 border-primary/30 hover:bg-primary/20" : "hover:bg-accent"
                              }`}
                            >
                              <span className="font-medium">{day}</span>
                              {hasData && (
                                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
                              )}

                              {/* Tooltip */}
                              {hasData && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                  <div className="bg-popover border rounded-lg shadow-lg p-3 min-w-[200px]">
                                    <div className="text-sm font-medium mb-2">
                                      {new Date(
                                        calendarMonth.getFullYear(),
                                        calendarMonth.getMonth(),
                                        day,
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">Total Profit:</span>
                                        <span
                                          className={`text-xs font-medium ${(dayData.profit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                                        >
                                          ${(dayData.profit || 0).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">Runs:</span>
                                        <span className="text-xs font-medium">{dayData.runs.length}</span>
                                      </div>
                                      <div className="border-t pt-2 mt-2">
                                        <div className="text-xs text-muted-foreground mb-1">Keys Used:</div>
                                        {dayData.runs.slice(0, 3).map((run, idx) => (
                                          <div key={idx} className="flex justify-between items-center text-xs">
                                            <span className="truncate max-w-[100px]">{run.keyName}</span>
                                            <span
                                              className={`font-medium ${(run.profit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                                            >
                                              ${(run.profit || 0).toLocaleString()}
                                            </span>
                                          </div>
                                        ))}
                                        {dayData.runs.length > 3 && (
                                          <div className="text-xs text-muted-foreground mt-1">
                                            +{dayData.runs.length - 3} more runs
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profit by Location</CardTitle>
                    <CardDescription>Distribution of profits across different locations</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading charts...</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Keys</CardTitle>
                    <CardDescription>ROI percentage for your best keys</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading charts...</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest key runs and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keys.slice(0, 3).map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <KeyRound className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{key.name}</p>
                          <p className="text-sm text-muted-foreground">{key.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(key.totalProfit || 0).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{key.totalRuns || 0} runs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "keys":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-50">Key Management</h2>
                <p className="text-muted-foreground">Manage your keys and track their usage</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Key</DialogTitle>
                    <DialogDescription>Enter the details for your new key</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Key Name</Label>
                      <Input
                        id="name"
                        value={newKey.name}
                        onChange={(e) => {
                          setNewKey({ ...newKey, name: e.target.value })
                          if (validationErrors.name) {
                            setValidationErrors({ ...validationErrors, name: "" })
                          }
                        }}
                        placeholder="e.g., Key Name"
                        className={validationErrors.name ? "border-red-500" : ""}
                      />
                      {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={newKey.location}
                        onValueChange={(value) => {
                          setNewKey({ ...newKey, location: value })
                          if (validationErrors.location) {
                            setValidationErrors({ ...validationErrors, location: "" })
                          }
                        }}
                      >
                        <SelectTrigger className={validationErrors.location ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATIONS.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validationErrors.location && <p className="text-sm text-red-500">{validationErrors.location}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="cost">Key Cost</Label>
                      <Input
                        id="cost"
                        type="text"
                        value={newKey.cost ? newKey.cost.toLocaleString() : ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, "")
                          if (!isNaN(Number(value)) || value === "") {
                            setNewKey({ ...newKey, cost: value === "" ? 0 : Number(value) })
                            if (validationErrors.cost) {
                              setValidationErrors({ ...validationErrors, cost: "" })
                            }
                          }
                        }}
                        placeholder="501,000"
                        className={validationErrors.cost ? "border-red-500" : ""}
                      />
                      {validationErrors.cost && <p className="text-sm text-red-500">{validationErrors.cost}</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addKey}>Add Key</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Key Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Key Uses</TableHead>
                        <TableHead>Total Profit</TableHead>
                        <TableHead>ROI</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {keys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell>{key.location}</TableCell>
                          <TableCell>${(key.cost || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="default">{key.currentUses || 0}</Badge>
                          </TableCell>
                          <TableCell className="text-green-600">${(key.totalProfit || 0).toLocaleString()}</TableCell>
                          <TableCell className={calculateROI(key) >= 0 ? "text-green-600" : "text-red-600"}>
                            {calculateROI(key).toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => openRunDialog(key)}>
                                Run
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => openInfoDialog(key)}>
                                <Info className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingKey(key)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteKey(key.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-50">Analytics</h2>
              <p className="text-muted-foreground">Detailed insights into your key performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Keys</CardTitle>
                  <CardDescription>Keys with highest ROI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {keys
                      .sort((a, b) => calculateROI(b) - calculateROI(a))
                      .slice(0, 5)
                      .map((key) => (
                        <div key={key.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{key.name}</p>
                            <p className="text-sm text-muted-foreground">{key.location}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${calculateROI(key) >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {calculateROI(key).toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground">{key.totalRuns} runs</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Performance</CardTitle>
                  <CardDescription>Profit by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {LOCATIONS.map((location) => {
                      const locationKeys = keys.filter((key) => key.location === location)
                      const locationProfit = locationKeys.reduce((sum, key) => sum + (key.totalProfit || 0), 0)
                      const locationRuns = locationKeys.reduce((sum, key) => sum + (key.totalRuns || 0), 0)

                      return (
                        <div key={location} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{location}</p>
                            <p className="text-sm text-muted-foreground">{locationKeys.length} keys</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${(locationProfit || 0).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{locationRuns} runs</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-50">Settings</h2>
              <p className="text-muted-foreground">Manage your application preferences</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your key tracking data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">Download your key data as JSON</p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Clear All Data</p>
                    <p className="text-sm text-muted-foreground">Remove all keys and run history</p>
                  </div>
                  <Button variant="destructive">Clear Data</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>Manage your profiles and switch between different key sets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Create New Profile</p>
                    <p className="text-sm text-muted-foreground">Start fresh with a new set of keys</p>
                  </div>
                  <Button onClick={() => setIsCreateProfileDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Profile
                  </Button>
                </div>
                <Separator />
                <div>
                  <p className="font-medium mb-3">Existing Profiles</p>
                  <div className="space-y-2">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">{getIconComponent(profile.icon)}</div>
                          <div>
                            <p className="font-medium">{profile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {profile.keys?.length || 0} keys • Created{" "}
                              {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {profile.id === currentProfileId && (
                            <Badge variant="default" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProfile(profile)
                              setIsEditProfileDialogOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {profiles.length > 1 && (
                            <Button size="sm" variant="destructive" onClick={() => deleteProfile(profile.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  const renderArmorContent = () => {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-50">Armor Durability Management</h2>
              <p className="text-muted-foreground">Track and manage your body armor collection</p>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" onClick={exportArmors}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Armors</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" onClick={() => setIsImportDialogOpen(true)}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import Armors</p>
                </TooltipContent>
              </Tooltip>

              <Dialog open={isAddArmorDialogOpen} onOpenChange={setIsAddArmorDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Armor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Armor</DialogTitle>
                    <DialogDescription>Enter the details for your new body armor</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="armor-name">Armor Name</Label>
                        <Input
                          id="armor-name"
                          value={newArmor.name}
                          onChange={(e) => setNewArmor({ ...newArmor, name: e.target.value })}
                          placeholder="e.g., 926 Composite Body Armor"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="armor-class">Armor Class</Label>
                        <Select
                          value={newArmor.armorClass.toString()}
                          onValueChange={(value) => setNewArmor({ ...newArmor, armorClass: Number(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select armor class" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((classLevel) => (
                              <SelectItem key={classLevel} value={classLevel.toString()}>
                                Class {classLevel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Protected Areas</Label>
                      <div className="space-y-2">
                        {/* Selected Areas */}
                        {newArmor.protectedAreas.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {newArmor.protectedAreas.map((area) => (
                              <Badge key={area} variant="default" className="flex items-center gap-1">
                                {area}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 hover:bg-transparent"
                                  onClick={() => removeProtectedArea(area)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Add Area Dropdown */}
                        <Select
                          onValueChange={(value) => {
                            if (newArmor.protectedAreas.includes(value)) {
                              removeProtectedArea(value)
                            } else {
                              addProtectedArea(value)
                            }
                          }}
                        >
                          <SelectTrigger className="w-full bg-background text-foreground border-border">
                            <SelectValue placeholder="Add protected area" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            {PROTECTED_AREAS.map((area) => (
                              <SelectItem
                                key={area}
                                value={area}
                                className="text-foreground hover:bg-accent flex items-center relative [&_[data-radix-select-item-indicator]]:opacity-0"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span>{area}</span>
                                  {newArmor.protectedAreas.includes(area) && (
                                    <div className="ml-2 h-4 w-4 flex items-center justify-center text-primary">○</div>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="material">Material</Label>
                        <Select
                          value={newArmor.material}
                          onValueChange={(value) => setNewArmor({ ...newArmor, material: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {ARMOR_MATERIALS.map((material) => (
                              <SelectItem key={material} value={material}>
                                {material}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="armor-type">Armor Type</Label>
                        <Select
                          value={newArmor.condition}
                          onValueChange={(value: "Body Armor" | "Armored Rig") =>
                            setNewArmor({ ...newArmor, condition: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ARMOR_CONDITIONS.map((condition) => (
                              <SelectItem key={condition} value={condition}>
                                {condition}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="movement-speed">Movement Speed</Label>
                        <Input
                          id="movement-speed"
                          value={newArmor.movementSpeed}
                          onChange={(e) => setNewArmor({ ...newArmor, movementSpeed: e.target.value })}
                          placeholder="e.g., -4%"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="ergonomics">Ergonomics</Label>
                        <Input
                          id="ergonomics"
                          value={newArmor.ergonomics}
                          onChange={(e) => setNewArmor({ ...newArmor, ergonomics: e.target.value })}
                          placeholder="e.g., -3"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={newArmor.weight}
                          onChange={(e) => setNewArmor({ ...newArmor, weight: e.target.value })}
                          placeholder="e.g., 6.20kg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-durability">New Durability</Label>
                        <Input
                          id="new-durability"
                          type="number"
                          value={newArmor.newDurability}
                          onChange={(e) => setNewArmor({ ...newArmor, newDurability: Number(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="like-new-durability">Like New Durability</Label>
                        <Input
                          id="like-new-durability"
                          type="number"
                          value={newArmor.likeNewDurability}
                          onChange={(e) => setNewArmor({ ...newArmor, likeNewDurability: Number(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="worn-durability">Worn Durability</Label>
                        <Input
                          id="worn-durability"
                          type="number"
                          value={newArmor.wornDurability}
                          onChange={(e) => setNewArmor({ ...newArmor, wornDurability: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* Repair Deductions Section */}
                    <div className="grid gap-2">
                      <Label>Repair Deductions</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {REPAIR_NPCS.map((npc) => (
                          <div key={npc.id} className="grid gap-2">
                            <Label htmlFor={`repair-${npc.id}`} className={`text-xs ${npc.color}`}>
                              {npc.name} ({npc.id})
                            </Label>
                            <Input
                              id={`repair-${npc.id}`}
                              type="number"
                              step="0.1"
                              value={newArmor.repairDeductions[npc.id as keyof typeof newArmor.repairDeductions]}
                              onChange={(e) =>
                                setNewArmor({
                                  ...newArmor,
                                  repairDeductions: {
                                    ...newArmor.repairDeductions,
                                    [npc.id]: Number(e.target.value),
                                  },
                                })
                              }
                              placeholder={npc.defaultDeduction.toString()}
                              className="text-right"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addArmor}>Add Armor</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search armor..."
                value={armorSearchTerm}
                onChange={(e) => setArmorSearchTerm(e.target.value)}
                className="pl-8 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={armorConditionFilter} onValueChange={setArmorConditionFilter}>
              <SelectTrigger className="w-[180px] text-foreground">
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {ARMOR_CONDITIONS.map((condition) => (
                  <SelectItem key={condition} value={condition} className="text-foreground hover:bg-accent">
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Armor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredArmors.map((armor) => {
              return (
                <Card key={armor.id} className="relative overflow-hidden border bg-card shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <CardTitle className="text-sm font-semibold text-foreground leading-tight">
                          {armor.name}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5 border-primary/20 bg-primary/10 text-primary"
                          >
                            Class {armor.armorClass}
                          </Badge>
                          <Badge
                            variant="default"
                            className="text-xs px-1.5 py-0.5 bg-secondary text-secondary-foreground"
                          >
                            {armor.condition}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openRepairDialog(armor)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Repair Calculator
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteArmor(armor.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 px-3 pb-3">
                    {/* Durability Section - Compact */}
                    <div className="bg-muted/20 rounded-md p-2">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Durability</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-1.5 rounded bg-green-500/10">
                          <div className="text-xs text-green-600 font-medium">New</div>
                          <div className="text-sm font-bold text-green-600">{armor.newDurability}</div>
                        </div>
                        <div className="text-center p-1.5 rounded bg-yellow-500/10">
                          <div className="text-xs text-yellow-600 font-medium">Like New</div>
                          <div className="text-sm font-bold text-yellow-600">{armor.likeNewDurability}</div>
                        </div>
                        <div className="text-center p-1.5 rounded bg-red-500/10">
                          <div className="text-xs text-red-600 font-medium">Worn</div>
                          <div className="text-sm font-bold text-red-600">{armor.wornDurability}</div>
                        </div>
                      </div>
                    </div>

                    {/* Protected Areas - Compact */}
                    <div className="bg-accent/20 rounded-md p-2">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Protected Areas</div>
                      <div className="flex flex-wrap gap-1">
                        {armor.protectedAreas.map((area) => (
                          <Badge
                            key={area}
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats Grid - Compact */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Material:</span>
                          <span className="font-medium">{armor.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium">{armor.weight}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Speed:</span>
                          <span className="font-medium text-red-600">{armor.movementSpeed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ergo:</span>
                          <span className="font-medium text-red-600">{armor.ergonomics}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredArmors.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No armor found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {armorSearchTerm || armorConditionFilter !== "All"
                    ? "Try adjusting your search or filter criteria"
                    : "Add your first piece of body armor to get started"}
                </p>
                <Button onClick={() => setIsAddArmorDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Armor
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </TooltipProvider>
    )
  }

  const openAddDialog = () => {
    setValidationErrors({ name: "", location: "", cost: "" })
    setIsAddDialogOpen(true)
  }

  const editRun = () => {
    if (!editingRun) return

    setKeys((prevKeys) =>
      prevKeys.map((key) => {
        if (key.id === editingRun.keyId) {
          const updatedRuns = key.runs.map((run) =>
            run.runNumber === editingRun.runNumber ? { ...run, profit: editingRun.profit } : run,
          )
          const newTotalProfit = updatedRuns.reduce((sum, run) => sum + run.profit, 0)
          return {
            ...key,
            runs: updatedRuns,
            totalProfit: newTotalProfit,
          }
        }
        return key
      }),
    )

    setIsEditRunDialogOpen(false)
    setEditingRun(null)

    // Update the info dialog if it's showing the same key
    if (infoKey && infoKey.id === editingRun.keyId) {
      const updatedKey = keys.find((k) => k.id === editingRun.keyId)
      if (updatedKey) {
        setInfoKey(updatedKey)
      }
    }
  }

  const deleteRun = (keyId: string, runNumber: number) => {
    const key = keys.find((k) => k.id === keyId)
    const run = key?.runs.find((r) => r.runNumber === runNumber)
    if (key && run) {
      setDeleteConfirmation({
        type: "run",
        id: keyId,
        name: key.name,
        runNumber: runNumber,
      })
    }
  }

  const confirmDeleteRun = () => {
    if (deleteConfirmation && deleteConfirmation.type === "run") {
      const { id: keyId, runNumber } = deleteConfirmation

      setKeys((prevKeys) =>
        prevKeys.map((key) => {
          if (key.id === keyId) {
            const updatedRuns = key.runs.filter((run) => run.runNumber !== runNumber)
            const newTotalProfit = updatedRuns.reduce((sum, run) => sum + run.profit, 0)
            const newTotalRuns = updatedRuns.length

            // Renumber the remaining runs
            const renumberedRuns = updatedRuns.map((run, index) => ({
              ...run,
              runNumber: index + 1,
            }))

            return {
              ...key,
              runs: renumberedRuns,
              totalProfit: newTotalProfit,
              totalRuns: newTotalRuns,
              currentUses: key.currentUses + 1, // Restore one use
            }
          }
          return key
        }),
      )

      // Update the info dialog if it's showing the same key
      if (infoKey && infoKey.id === keyId) {
        const updatedKey = keys.find((k) => k.id === keyId)
        if (updatedKey) {
          setInfoKey(updatedKey)
        }
      }

      setDeleteConfirmation(null)
    }
  }

  const openEditRunDialog = (keyId: string, run: { runNumber: number; profit: number }) => {
    setEditingRun({ keyId, runNumber: run.runNumber, profit: run.profit })
    setIsEditRunDialogOpen(true)
  }

  // Generates a compact off-screen "run sheet" so many runs fit in one image.
  async function takeRunSheetScreenshot() {
    if (!infoKey) return

    const container = document.createElement("div")
    container.id = "run-sheet-capture"
    container.style.position = "fixed"
    container.style.left = "-10000px"
    container.style.top = "0"
    container.style.background = "#ffffff"
    container.style.color = "#0f172a"
    container.style.fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
    container.style.padding = "24px"
    container.style.lineHeight = "1.25"

    const MAX_ROWS_PER_COL = 18
    const COL_WIDTH = 520
    const runs = [...infoKey.runs].sort((a, b) => a.runNumber - b.runNumber)

    const columns = Math.max(1, Math.ceil(runs.length / MAX_ROWS_PER_COL))
    container.style.width = `${Math.min(columns * COL_WIDTH, 2000)}px`

    function chunk<T>(arr: T[], size: number) {
      const out: T[][] = []
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
      return out
    }

    const chunks = chunk(runs, MAX_ROWS_PER_COL)

    const makeRowsHtml = (slice: typeof runs) =>
      slice
        .map(
          (run) => `
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:6px 8px; text-align:right; width:56px;">#${run.runNumber}</td>
            <td style="padding:6px 8px; font-weight:700; color:${(run.profit || 0) >= 0 ? "#16a34a" : "#dc2626"};">$${(run.profit || 0).toLocaleString()}</td>
            <td style="padding:6px 8px; color:#64748b;">${new Date(run.date).toLocaleDateString()} ${new Date(run.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
          </tr>`,
        )
        .join("")

    const colsHtml = chunks
      .map(
        (slice) => `
        <table style="width:100%; border-collapse:collapse; font-size:12px;">
          <thead>
            <tr style="text-align:left; background:#f8fafc; border-bottom:1px solid #e5e7eb;">
              <th style="padding:6px 8px; text-align:right; width:56px;">Run</th>
              <th style="padding:6px 8px; width:140px;">Profit</th>
              <th style="padding:6px 8px;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${makeRowsHtml(slice)}
          </tbody>
        </table>
      `,
      )
      .join("")

    const roi =
      infoKey.totalRuns === 0 || infoKey.cost === 0 ? 0 : ((infoKey.totalProfit - infoKey.cost) / infoKey.cost) * 100
    const roiColor = roi >= 0 ? "#16a34a" : "#dc2626"

    container.innerHTML = `
        <div>
          <div style="text-align:center; margin-bottom:12px;">
            <div style="font-weight:800; font-size:28px;">${infoKey.name}</div>
            <div style="color:#64748b; font-size:14px;">${infoKey.location} • ${new Date().toLocaleDateString()}</div>
          </div>

          <div style="display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px; margin-bottom:14px;">
            <div style="border:1px solid #e5e7eb; border-radius:8px; padding:12px;">
              <div style="font-size:12px; color:#64748b;">Investment</div>
              <div style="font-size:20px; font-weight:800;">$${(infoKey.cost || 0).toLocaleString()}</div>
            </div>
            <div style="border:1px solid #e5e7eb; border-radius:8px; padding:12px;">
              <div style="font-size:12px; color:#64748b;">Total Profit</div>
              <div style="font-size:20px; font-weight:800; color:#16a34a;">$${(infoKey.totalProfit || 0).toLocaleString()}</div>
            </div>
            <div style="border:1px solid #e5e7eb; border-radius:8px; padding:12px;">
              <div style="font-size:12px; color:#64748b;">ROI</div>
              <div style="font-size:20px; font-weight:800; color:${roiColor};">${roi.toFixed(1)}%</div>
            </div>
          </div>

          <div style="font-weight:700; margin:6px 0 8px 0;">Run History (${infoKey.runs.length} runs)</div>

          <div style="display:grid; grid-template-columns: repeat(${columns}, minmax(0,1fr)); gap:16px;">
            ${colsHtml}
          </div>
        </div>
      `

    document.body.appendChild(container)

    try {
      const canvas = await html2canvas(container, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: container.offsetWidth,
        height: container.offsetHeight,
        logging: false,
      })

      const link = document.createElement("a")
      link.download = `${infoKey.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_run_sheet.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (err) {
      console.error("Run sheet screenshot failed:", err)
    } finally {
      container.remove()
    }
  }

  // Captures the currently visible screen (dialog + backdrop) in one image.
  async function takeFullScreenScreenshot() {
    try {
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      const canvas = await html2canvas(document.body, {
        backgroundColor: "#111111",
        windowWidth: width,
        windowHeight: height,
        scale: 2,
        logging: false,
      })
      const link = document.createElement("a")
      link.download = "shrimple-arena-tracker_fullscreen.png"
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (error) {
      console.error("Full screen screenshot failed:", error)
    }
  }

  const renderMainContent = () => {
    if (mainTab === "armor") {
      return renderArmorContent()
    }
    return renderContent() // Existing key tracker content
  }

  return (
    <div className="dark min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 bg-sidebar ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <KeyRound className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Shrimple Tracker</h1>
                <p className="text-xs text-muted-foreground">Key & Armor Tracker</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {/* Main Tab Selection */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-2">MODE</p>
              {mainTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={mainTab === tab.id ? "default" : "ghost"}
                  className={`w-full justify-start mb-1 ${
                    mainTab === tab.id ? "" : "text-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    setMainTab(tab.id)
                    setActiveTab("overview") // Reset to overview when switching main tabs
                    setSidebarOpen(false)
                  }}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>

            <Separator />

            {/* Sub Navigation - Only show for Key Tracker */}
            {mainTab === "keys" && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">KEY TRACKER</p>
                {sidebarItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === item.id ? "" : "text-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Profile section */}
            <div className="mt-auto pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-foreground hover:bg-accent"
                onClick={() => setIsProfileDialogOpen(true)}
              >
                <div className="flex items-center space-x-2 w-full">
                  <div className="p-1 bg-primary/10 rounded">
                    {getCurrentProfile() && getIconComponent(getCurrentProfile()!.icon)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{getCurrentProfile()?.name || "No Profile"}</p>
                    <p className="text-xs text-muted-foreground">Switch Profile</p>
                  </div>
                </div>
              </Button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          

          {/* Content */}
          <main className="p-4 lg:p-6">{renderMainContent()}</main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background/50 border-t backdrop-blur-sm mt-auto">
        
      </footer>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Repair Armor Dialog */}
      <Dialog open={isRepairDialogOpen} onOpenChange={setIsRepairDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Repair Calculator
            </DialogTitle>
            <DialogDescription>Calculate repair results based on your current durability</DialogDescription>
          </DialogHeader>
          {repairingArmor && (
            <div className="space-y-4">
              {/* Armor Info */}
              <div className="bg-muted/50 p-3 rounded-lg space-y-3">
                <div>
                  <h4 className="font-medium">{repairingArmor.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    Class {repairingArmor.armorClass} {repairingArmor.condition}
                  </div>
                </div>

                {/* Durability Thresholds */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground">New</div>
                    <div className="font-medium text-green-500">{repairingArmor.newDurability}</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground">Like New</div>
                    <div className="font-medium text-yellow-500">{repairingArmor.likeNewDurability}</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground">Worn</div>
                    <div className="font-medium text-red-500">{repairingArmor.wornDurability}</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium">Tip:</span> Consider repairing when durability falls below{" "}
                  {repairingArmor.wornDurability} points
                </div>
              </div>

              {/* Current Durability Input */}
              <div className="space-y-2">
                <Label htmlFor="current-durability">Enter Current Durability</Label>
                <Input
                  id="current-durability"
                  type="number"
                  value={newCurrentDurability}
                  onChange={(e) => setNewCurrentDurability(e.target.value)}
                  placeholder="Enter current durability"
                  className="text-center text-lg"
                />
              </div>

              {/* Repair Deductions Display */}
              <div className="space-y-2">
                <Label>Available Repair Options</Label>
                <div className="grid gap-2">
                  {REPAIR_NPCS.map((npc) => {
                    const armorWithDeductions = ensureRepairDeductions(repairingArmor)
                    const deduction =
                      armorWithDeductions.repairDeductions[npc.id as keyof typeof armorWithDeductions.repairDeductions]
                    const afterRepair = Math.max(0, Number(newCurrentDurability) - deduction)

                    // Determine repair quality based on thresholds
                    let recommendationText = ""
                    if (Number(newCurrentDurability) > 0) {
                      if (afterRepair >= repairingArmor.likeNewDurability) {
                        recommendationText = "Excellent repair choice"
                      } else if (afterRepair >= repairingArmor.wornDurability) {
                        recommendationText = "Decent repair option"
                      } else {
                        recommendationText = "Not recommended"
                      }
                    }

                    return (
                      <div
                        key={npc.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                          selectedRepairNPC === npc.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50",
                          "border",
                        )}
                        onClick={() => setSelectedRepairNPC(npc.id as "low" | "medium" | "high")}
                      >
                        <div>
                          <span className={`font-medium ${npc.color}`}>{npc.name}</span>
                          <div className="text-xs text-muted-foreground capitalize">({npc.id} quality)</div>
                        </div>
                        <div className="text-right">
                          {Number(newCurrentDurability) > 0 ? (
                            <div>
                              <div className={`font-medium ${npc.color}`}>{Math.round(afterRepair * 10) / 10}</div>
                              <div className="text-xs text-muted-foreground">{recommendationText}</div>
                            </div>
                          ) : (
                            <div className={`text-sm ${npc.color}`}>-{deduction}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Armor Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Armor Data
            </DialogTitle>
            <DialogDescription>
              Share your armor collection with other players. Copy the data below or download as a file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="export-data">Armor Data (JSON)</Label>
              <Textarea
                id="export-data"
                value={exportData}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="Armor data will appear here..."
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {armors.length} armor entries • {exportData.length} characters
              </span>
              <span>Compatible with Arena Breakout Tracker v1.0+</span>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={copyExportData}>
              <FileText className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button onClick={downloadExportData}>
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Armor Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Armor Data
            </DialogTitle>
            <DialogDescription>
              Import armor data shared by other players. Paste the JSON data below and click import.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="import-data">Armor Data (JSON)</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => {
                  setImportData(e.target.value)
                  setImportError("")
                }}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Paste the armor data JSON here..."
              />
              {importError && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <X className="h-4 w-4" />
                  {importError}
                </p>
              )}
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Import Notes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Imported armors will be added to your current collection</li>
                <li>• Each armor will get a new ID and current purchase date</li>
                <li>• Repair history will be reset for imported armors</li>
                <li>• Only valid armor data will be imported</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={importArmors} disabled={!importData.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Import Armors
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All existing dialogs remain the same */}
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Key</DialogTitle>
            <DialogDescription>Update the details for this key</DialogDescription>
          </DialogHeader>
          {editingKey && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Key Name</Label>
                <Input
                  id="edit-name"
                  value={editingKey.name}
                  onChange={(e) => setEditingKey({ ...editingKey, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Select
                  value={editingKey.location}
                  onValueChange={(value) => setEditingKey({ ...editingKey, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-cost">Key Cost</Label>
                <Input
                  id="edit-cost"
                  type="text"
                  value={editingKey.cost ? editingKey.cost.toLocaleString() : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, "")
                    if (!isNaN(Number(value)) || value === "") {
                      setEditingKey({ ...editingKey, cost: value === "" ? 0 : Number(value) })
                    }
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={editKey}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Profit Input Drawer */}
      <Drawer open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Record Run Profit</DrawerTitle>
              <DrawerDescription>Enter the profit you made from this run with {selectedKey?.name}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="run-profit">Profit Amount</Label>
                <Input
                  id="run-profit"
                  type="text"
                  value={runProfit ? runProfit.toLocaleString() : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, "")
                    if (!isNaN(Number(value)) || value === "") {
                      setRunProfit(value === "" ? 0 : Number(value))
                    }
                  }}
                  placeholder="Enter profit amount..."
                  autoFocus
                  className="text-center text-lg"
                />
              </div>
              <div className="text-sm text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Key:</span>
                  <span className="font-medium">{selectedKey?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">{selectedKey?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Key Uses:</span>
                  <span className="font-medium">{selectedKey?.currentUses}</span>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={submitRun} className="w-full">
                Record Run
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Key Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {infoKey?.name} - Run Details
                </DialogTitle>
                <DialogDescription>Complete breakdown of all runs and profitability</DialogDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" onClick={takeRunSheetScreenshot}>
                  <Camera className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsInfoDialogOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          {infoKey && (
            <div id="run-info-content" className="grid grid-cols-2 gap-6 py-4 bg-background">
              {/* Left Column - Stats */}
              <div className="space-y-4">
                {/* Header for screenshot */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold">{infoKey.name}</h2>
                  <p className="text-muted-foreground">
                    {infoKey.location} • {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Key Summary */}
                <div className="grid grid-cols-1 gap-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Total Investment</div>
                      <div className="text-2xl font-bold">${(infoKey.cost || 0).toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Total Profit</div>
                      <div className="text-2xl font-bold text-green-600">
                        ${(infoKey.totalProfit || 0).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">ROI</div>
                      <div
                        className={`text-2xl font-bold ${calculateROI(infoKey) >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {calculateROI(infoKey).toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Average per Run</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${(getAverageProfit(infoKey) || 0).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column - Run History */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Run History ({infoKey.runs.length} runs)</h3>
                  </div>
                  {infoKey.runs.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      <Table className="text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Run #</TableHead>
                            <TableHead>Profit</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {infoKey.runs.map((run) => (
                            <TableRow key={run.runNumber}>
                              <TableCell>#{run.runNumber}</TableCell>
                              <TableCell className="text-green-600">${(run.profit || 0).toLocaleString()}</TableCell>
                              <TableCell className="text-muted-foreground">{formatDate(run.date)}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditRunDialog(infoKey.id, run)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteRun(infoKey.id, run.runNumber)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No runs recorded yet</p>
                      <p className="text-sm">Start using this key to see run history</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Selector Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Profile</DialogTitle>
            <DialogDescription>Choose which profile to use for tracking your keys</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent ${
                  profile.id === currentProfileId ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => switchProfile(profile.id)}
              >
                <div className="p-2 bg-primary/10 rounded-lg">{getIconComponent(profile.icon)}</div>
                <div className="flex-1">
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.keys?.length || 0} keys • {profile.keys?.reduce((sum, key) => sum + key.totalRuns, 0) || 0}{" "}
                    total runs
                  </p>
                </div>
                {profile.id === currentProfileId && <Badge variant="default">Current</Badge>}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateProfileDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Profile Dialog */}
      <Dialog open={isCreateProfileDialogOpen} onOpenChange={setIsCreateProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>Set up a new profile for tracking different key sets</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Profile Name</Label>
              <Input
                id="profile-name"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                placeholder="e.g., Main Account, Alt Character"
              />
            </div>
            <div className="grid gap-2">
              <Label>Profile Icon</Label>
              <div className="grid grid-cols-8 gap-2">
                {PROFILE_ICONS.map((icon) => (
                  <Button
                    key={icon}
                    variant={newProfile.icon === icon ? "default" : "outline"}
                    size="sm"
                    className="aspect-square p-2"
                    onClick={() => setNewProfile({ ...newProfile, icon })}
                  >
                    {getIconComponent(icon)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createProfile}>Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          {editingProfile && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="profile-name">Profile Name</Label>
                <Input
                  id="profile-name"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  placeholder="e.g., Main Account, Alt Character"
                />
              </div>
              <div className="grid gap-2">
                <Label>Profile Icon</Label>
                <div className="grid grid-cols-8 gap-2">
                  {PROFILE_ICONS.map((icon) => (
                    <Button
                      key={icon}
                      variant={editingProfile.icon === icon ? "default" : "outline"}
                      size="sm"
                      className="aspect-square p-2"
                      onClick={() => setEditingProfile({ ...editingProfile, icon })}
                    >
                      {getIconComponent(icon)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={updateProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Run Dialog */}
      <Dialog open={isEditRunDialogOpen} onOpenChange={setIsEditRunDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Run</DialogTitle>
            <DialogDescription>Update the profit amount for this run</DialogDescription>
          </DialogHeader>
          {editingRun && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-run-profit">Profit Amount</Label>
                <Input
                  id="edit-run-profit"
                  type="text"
                  value={editingRun.profit ? editingRun.profit.toLocaleString() : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, "")
                    if (!isNaN(Number(value)) || value === "") {
                      setEditingRun({
                        ...editingRun,
                        profit: value === "" ? 0 : Number(value),
                      })
                    }
                  }}
                  placeholder="Enter profit amount..."
                  className="text-center text-lg"
                />
              </div>
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Run Number:</span>
                  <span className="font-medium">#{editingRun.runNumber}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRunDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editRun}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {deleteConfirmation?.type === "key" && (
                <>
                  Are you sure you want to delete the key <strong>"{deleteConfirmation.name}"</strong>? This will
                  permanently remove all run history and cannot be undone.
                </>
              )}
              {deleteConfirmation?.type === "run" && (
                <>
                  Are you sure you want to delete run #{deleteConfirmation.runNumber} from{" "}
                  <strong>"{deleteConfirmation.name}"</strong>? This will restore one use to the key and cannot be
                  undone.
                </>
              )}
              {deleteConfirmation?.type === "profile" && (
                <>
                  Are you sure you want to delete the profile <strong>"{deleteConfirmation.name}"</strong>? This will
                  permanently remove all keys and run history in this profile and cannot be undone.
                </>
              )}
              {deleteConfirmation?.type === "armor" && (
                <>
                  Are you sure you want to delete the armor <strong>"{deleteConfirmation.name}"</strong>? This action
                  cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmation?.type === "key") confirmDeleteKey()
                else if (deleteConfirmation?.type === "run") confirmDeleteRun()
                else if (deleteConfirmation?.type === "profile") confirmDeleteProfile()
                else if (deleteConfirmation?.type === "armor") confirmDeleteArmor()
              }}
            >
              Delete{" "}
              {deleteConfirmation?.type === "key"
                ? "Key"
                : deleteConfirmation?.type === "run"
                  ? "Run"
                  : deleteConfirmation?.type === "profile"
                    ? "Profile"
                    : "Armor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
