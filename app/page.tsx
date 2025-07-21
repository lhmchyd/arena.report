"use client"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Key,
  TrendingUp,
  DollarSign,
  Target,
  Edit,
  Trash2,
  Info,
  RotateCcw,
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
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface KeyData {
  id: string
  name: string
  location: string
  cost: number
  currentUses: number
  maxUses: number
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
  const [keys, setKeys] = useState<KeyData[]>([
    {
      id: "1",
      name: "Motel 201",
      location: "Farm",
      cost: 501000,
      currentUses: 15,
      maxUses: 15,
      totalRuns: 0,
      totalProfit: 0,
      runs: [],
    },
    {
      id: "2",
      name: "Office 104",
      location: "TV Station",
      cost: 750000,
      currentUses: 10,
      maxUses: 10,
      totalRuns: 0,
      totalProfit: 0,
      runs: [],
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<KeyData | null>(null)
  const [newKey, setNewKey] = useState({
    name: "",
    location: "",
    cost: 0,
    maxUses: 15,
  })

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfileId, setCurrentProfileId] = useState<string>("")
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isCreateProfileDialogOpen, setIsCreateProfileDialogOpen] = useState(false)
  const [newProfile, setNewProfile] = useState({ name: "", icon: "User" })
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    location: "",
    cost: "",
    maxUses: "",
  })

  // Load profiles and current profile from localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem("arena-breakout-profiles")
    const savedCurrentProfileId = localStorage.getItem("arena-breakout-current-profile")

    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles)
      setProfiles(parsedProfiles)

      if (savedCurrentProfileId && parsedProfiles.find((p: Profile) => p.id === savedCurrentProfileId)) {
        setCurrentProfileId(savedCurrentProfileId)
        const currentProfile = parsedProfiles.find((p: Profile) => p.id === savedCurrentProfileId)
        if (currentProfile) {
          setKeys(currentProfile.keys || [])
        }
      } else if (parsedProfiles.length > 0) {
        setCurrentProfileId(parsedProfiles[0].id)
        setKeys(parsedProfiles[0].keys || [])
      }
    } else {
      // Create default profile
      const defaultProfile: Profile = {
        id: "default",
        name: "Default Profile",
        icon: "User",
        createdAt: new Date().toISOString(),
        keys: [
          {
            id: "1",
            name: "Motel 201",
            location: "Farm",
            cost: 501000,
            currentUses: 15,
            maxUses: 15,
            totalRuns: 0,
            totalProfit: 0,
            runs: [],
          },
          {
            id: "2",
            name: "Office 104",
            location: "TV Station",
            cost: 750000,
            currentUses: 10,
            maxUses: 10,
            totalRuns: 0,
            totalProfit: 0,
            runs: [],
          },
        ],
      }
      setProfiles([defaultProfile])
      setCurrentProfileId(defaultProfile.id)
      setKeys(defaultProfile.keys)
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

  // Update current profile's keys when keys change
  useEffect(() => {
    if (currentProfileId && profiles.length > 0) {
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) => (profile.id === currentProfileId ? { ...profile, keys: keys } : profile)),
      )
    }
  }, [keys, currentProfileId])

  const calculateROI = (key: KeyData) => {
    if (key.totalRuns === 0) return 0
    const totalInvestment = key.cost
    const netProfit = key.totalProfit - totalInvestment
    return (netProfit / totalInvestment) * 100
  }

  const openRunDialog = (key: KeyData) => {
    if (key.currentUses > 0) {
      setSelectedKey(key)
      setRunProfit(0)
      setIsRunDialogOpen(true)
    }
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
            currentUses: key.currentUses - 1,
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
      maxUses: "",
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

    if (newKey.maxUses <= 0) {
      errors.maxUses = "Max uses must be greater than 0"
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
      currentUses: newKey.maxUses,
      maxUses: newKey.maxUses,
      totalRuns: 0,
      totalProfit: 0,
      runs: [],
    }

    setKeys([...keys, key])
    setNewKey({ name: "", location: "", cost: 0, maxUses: 15 })
    setValidationErrors({ name: "", location: "", cost: "", maxUses: "" })
    setIsAddDialogOpen(false)
  }

  const editKey = () => {
    if (!editingKey) return
    setKeys((prevKeys) => prevKeys.map((key) => (key.id === editingKey.id ? editingKey : key)))
    setIsEditDialogOpen(false)
    setEditingKey(null)
  }

  const deleteKey = (keyId: string) => {
    setKeys((prevKeys) => prevKeys.filter((key) => key.id !== keyId))
  }

  const resetKeyUses = (keyId: string) => {
    setKeys((prevKeys) => prevKeys.map((key) => (key.id === keyId ? { ...key, currentUses: key.maxUses } : key)))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getAverageProfit = (key: KeyData) => {
    if (key.runs.length === 0) return 0
    return key.totalProfit / key.runs.length
  }

  const totalInvestment = keys.reduce((sum, key) => sum + key.cost, 0)
  const totalProfit = keys.reduce((sum, key) => sum + key.totalProfit, 0)
  const totalRuns = keys.reduce((sum, key) => sum + key.totalRuns, 0)

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

  const keyPerformanceData = keys
    .filter((key) => key.totalRuns > 0)
    .sort((a, b) => calculateROI(b) - calculateROI(a))
    .slice(0, 5)
    .map((key, index) => ({
      name: key.name.length > 10 ? key.name.substring(0, 10) + "..." : key.name,
      roi: calculateROI(key),
      profit: key.totalProfit,
      runs: key.totalRuns,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }))

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
    { id: "keys", label: "Key Management", icon: Key },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const getCurrentProfile = () => {
    return profiles.find((p) => p.id === currentProfileId)
  }

  const switchProfile = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      setCurrentProfileId(profileId)
      setKeys(profile.keys || [])
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

    const newProfiles = profiles.filter((p) => p.id !== profileId)
    setProfiles(newProfiles)

    if (currentProfileId === profileId) {
      const newCurrentProfile = newProfiles[0]
      setCurrentProfileId(newCurrentProfile.id)
      setKeys(newCurrentProfile.keys || [])
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
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
                  <div className="text-2xl font-bold">${totalInvestment.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold text-green-600">${totalProfit.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold">{totalRuns}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span>Completed key runs</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  {totalProfit - totalInvestment >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${totalProfit - totalInvestment >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ${(totalProfit - totalInvestment).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {totalProfit - totalInvestment >= 0 ? (
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
                                  ${Number(value).toLocaleString()}
                                </div>
                              </>
                            )}
                          />
                        }
                      />
                      <Area
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
                              label={({ location, profit }) => `${location}: $${profit.toLocaleString()}`}
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
                                          <span className="font-bold">${data.profit.toLocaleString()}</span>
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

                {/* Key Performance Bar Chart */}
                {keyPerformanceData.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Keys</CardTitle>
                      <CardDescription>ROI percentage for your best keys</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          roi: {
                            label: "ROI %",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={keyPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <ChartTooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload
                                  return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                      <div className="grid gap-2">
                                        <div className="flex flex-col">
                                          <span className="text-[0.70rem] uppercase text-muted-foreground">Key</span>
                                          <span className="font-bold text-muted-foreground">{label}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">ROI</span>
                                            <span className="font-bold">{data.roi.toFixed(1)}%</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                              Profit
                                            </span>
                                            <span className="font-bold">${data.profit.toLocaleString()}</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">Runs</span>
                                            <span className="font-bold">{data.runs}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Bar dataKey="roi" fill="var(--color-roi)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Keys</CardTitle>
                      <CardDescription>ROI percentage for your best keys</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No performance data available</p>
                        <p className="text-sm">Complete some key runs to see performance metrics</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                          <Key className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{key.name}</p>
                          <p className="text-sm text-muted-foreground">{key.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${key.totalProfit.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{key.totalRuns} runs</p>
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
                <h2 className="text-2xl font-bold tracking-tight">Key Management</h2>
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
                        placeholder="e.g., Motel 201"
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

                    <div className="grid gap-2">
                      <Label htmlFor="maxUses">Max Uses</Label>
                      <Input
                        id="maxUses"
                        type="number"
                        value={newKey.maxUses}
                        onChange={(e) => {
                          setNewKey({ ...newKey, maxUses: Number(e.target.value) })
                          if (validationErrors.maxUses) {
                            setValidationErrors({ ...validationErrors, maxUses: "" })
                          }
                        }}
                        placeholder="15"
                        className={validationErrors.maxUses ? "border-red-500" : ""}
                      />
                      {validationErrors.maxUses && <p className="text-sm text-red-500">{validationErrors.maxUses}</p>}
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
                        <TableHead>Uses</TableHead>
                        <TableHead>Total Runs</TableHead>
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
                          <TableCell>${key.cost.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={key.currentUses > 0 ? "default" : "destructive"}>
                              {key.currentUses}/{key.maxUses}
                            </Badge>
                          </TableCell>
                          <TableCell>{key.totalRuns}</TableCell>
                          <TableCell className="text-green-600">${key.totalProfit.toLocaleString()}</TableCell>
                          <TableCell className={calculateROI(key) >= 0 ? "text-green-600" : "text-red-600"}>
                            {calculateROI(key).toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => openRunDialog(key)} disabled={key.currentUses === 0}>
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
              <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
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
                      const locationProfit = locationKeys.reduce((sum, key) => sum + key.totalProfit, 0)
                      const locationRuns = locationKeys.reduce((sum, key) => sum + key.totalRuns, 0)

                      return (
                        <div key={location} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{location}</p>
                            <p className="text-sm text-muted-foreground">{locationKeys.length} keys</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${locationProfit.toLocaleString()}</p>
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
              <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
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

  const openAddDialog = () => {
    setValidationErrors({ name: "", location: "", cost: "", maxUses: "" })
    setIsAddDialogOpen(true)
  }

  return (
    <div className="dark min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Key className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Arena Breakout</h1>
                <p className="text-xs text-muted-foreground">Key Tracker</p>
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
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === item.id ? "" : "text-foreground hover:text-foreground hover:bg-accent"}`}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
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
          <header className="bg-background border-b p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-foreground"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {keys.length} keys • {totalRuns} runs • ${totalProfit.toLocaleString()} profit
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-4 lg:p-6">{renderContent()}</main>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

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
              <div className="grid gap-2">
                <Label htmlFor="edit-maxUses">Max Uses</Label>
                <Input
                  id="edit-maxUses"
                  type="number"
                  value={editingKey.maxUses}
                  onChange={(e) => setEditingKey({ ...editingKey, maxUses: Number(e.target.value) })}
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
                  <span>Uses remaining:</span>
                  <span className="font-medium">
                    {selectedKey?.currentUses}/{selectedKey?.maxUses}
                  </span>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {infoKey?.name} - Run Details
            </DialogTitle>
            <DialogDescription>Complete breakdown of all runs and profitability</DialogDescription>
          </DialogHeader>
          {infoKey && (
            <div className="grid gap-6 py-4">
              {/* Key Summary */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Total Investment</div>
                    <div className="text-xl font-bold">${infoKey.cost.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Total Profit</div>
                    <div className="text-xl font-bold text-green-600">${infoKey.totalProfit.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Average per Run</div>
                    <div className="text-xl font-bold text-blue-600">${getAverageProfit(infoKey).toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">ROI</div>
                    <div
                      className={`text-xl font-bold ${calculateROI(infoKey) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {calculateROI(infoKey).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Run History */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Run History</h3>
                {infoKey.runs.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Run #</TableHead>
                          <TableHead>Profit</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {infoKey.runs.map((run) => (
                          <TableRow key={run.runNumber}>
                            <TableCell>#{run.runNumber}</TableCell>
                            <TableCell className="text-green-600">${run.profit.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">{formatDate(run.date)}</TableCell>
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

              {/* Reset Option */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reset Key Uses</h4>
                    <p className="text-sm text-muted-foreground">
                      Restore uses to {infoKey.maxUses}/{infoKey.maxUses}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      resetKeyUses(infoKey.id)
                      setIsInfoDialogOpen(false)
                    }}
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Uses
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInfoDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
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
            <Button onClick={createProfile} disabled={!newProfile.name.trim()}>
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile name and icon</DialogDescription>
          </DialogHeader>
          {editingProfile && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-profile-name">Profile Name</Label>
                <Input
                  id="edit-profile-name"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
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
    </div>
  )
}
