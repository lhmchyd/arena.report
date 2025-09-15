"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  TrendingUp,
  DollarSign,
  Target,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  KeyRound,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"

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

const LOCATIONS = ["Farm", "Armory", "TV Station", "Northridge", "Valley"]

// Chart colors
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export default function Dashboard({ keys }: { keys: KeyData[] }) {
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [timePeriod, setTimePeriod] = useState<number>(7) // Default to 7 days

  const calculateROI = (key: KeyData) => {
    if (key.totalRuns === 0) return 0
    const totalInvestment = key.cost
    const netProfit = key.totalProfit - totalInvestment
    return (netProfit / totalInvestment) * 100
  }

  // Calculate current period data
  const totalInvestment = keys.reduce((sum, key) => sum + (key.cost || 0), 0)
  const totalProfit = keys.reduce((sum, key) => sum + (key.totalProfit || 0), 0)
  const totalRuns = keys.reduce((sum, key) => sum + (key.totalRuns || 0), 0)
  const netProfit = totalProfit - totalInvestment

  // Calculate previous period data (last 30 days vs previous 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
  
  // Filter runs for current period (last 30 days) and calculate metrics
  let currentPeriodInvestment = 0
  let currentPeriodProfit = 0
  let currentPeriodRunsCount = 0
  
  keys.forEach(key => {
    key.runs.forEach(run => {
      const runDate = new Date(run.date)
      const today = new Date()
      if (runDate >= thirtyDaysAgo && runDate <= today) {
        currentPeriodInvestment += key.cost
        currentPeriodProfit += run.profit
        currentPeriodRunsCount += 1
      }
    })
  })
  
  const currentPeriodNetProfit = currentPeriodProfit - currentPeriodInvestment
  
  // Filter runs for previous period (30-60 days ago) and calculate metrics
  let previousPeriodInvestment = 0
  let previousPeriodProfit = 0
  let previousPeriodRunsCount = 0
  
  keys.forEach(key => {
    key.runs.forEach(run => {
      const runDate = new Date(run.date)
      if (runDate >= sixtyDaysAgo && runDate <= thirtyDaysAgo) {
        previousPeriodInvestment += key.cost
        previousPeriodProfit += run.profit
        previousPeriodRunsCount += 1
      }
    })
  })
  
  const previousPeriodNetProfit = previousPeriodProfit - previousPeriodInvestment
  
  // Calculate trend percentages
  const investmentTrend = previousPeriodInvestment !== 0 
    ? ((currentPeriodInvestment - previousPeriodInvestment) / previousPeriodInvestment) * 100 
    : 0
    
  const profitTrend = previousPeriodProfit !== 0 
    ? ((currentPeriodProfit - previousPeriodProfit) / previousPeriodProfit) * 100 
    : 0
    
  const runsTrend = previousPeriodRunsCount !== 0 
    ? ((currentPeriodRunsCount - previousPeriodRunsCount) / previousPeriodRunsCount) * 100 
    : 0
    
  const netProfitTrend = previousPeriodNetProfit !== 0 
    ? ((currentPeriodNetProfit - previousPeriodNetProfit) / previousPeriodNetProfit) * 100 
    : 0

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
  })

  // Find the maximum profit to calculate percentages
  const maxProfit = Math.max(...locationData.map(item => item.profit), 1)
  
  // Add percentage and display values to location data
  const locationDataWithPercentages = locationData.map(item => ({
    ...item,
    percentage: (item.profit / maxProfit) * 100,
    // Base shape is 200, percentage-based expansion up to 800
    displayProfit: 200 + ((item.profit / maxProfit) * 800)
  }))

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

  // Generate date range based on actual calendar dates
  const generateCalendarDateRange = (days: number) => {
    const dates = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to start of day
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date)
    }
    return dates
  }

  // Enhanced profit trend data with cumulative profits based on selected time period
  const profitTrendData = (() => {
    // Get all runs within the selected time period
    const filteredRuns = keys
      .flatMap((key) => key.runs.map((run) => ({ ...run, keyName: key.name })))
      .filter((run) => {
        const runDate = new Date(run.date)
        runDate.setHours(0, 0, 0, 0) // Normalize to start of day
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - timePeriod)
        cutoffDate.setHours(0, 0, 0, 0) // Normalize to start of day
        return runDate >= cutoffDate
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Generate accurate date range based on calendar
    const dateRange = generateCalendarDateRange(timePeriod)
    
    // Create a map of dates to profits
    const dateProfitMap: { [key: string]: number } = {}
    filteredRuns.forEach(run => {
      const runDate = new Date(run.date)
      runDate.setHours(0, 0, 0, 0) // Normalize to start of day
      const dateKey = runDate.toISOString().split('T')[0]
      if (!dateProfitMap[dateKey]) {
        dateProfitMap[dateKey] = 0
      }
      dateProfitMap[dateKey] += run.profit
    })

    // Build the final data array with all dates in range
    let cumulativeProfit = 0
    return dateRange.map(date => {
      const dateKey = date.toISOString().split('T')[0]
      const dailyProfit = dateProfitMap[dateKey] || 0
      cumulativeProfit += dailyProfit
      
      return {
        day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        profit: dailyProfit,
        cumulative: cumulativeProfit,
        date: date.toLocaleDateString(),
      }
    })
  })()

  const calculateTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

    return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Track your key performance and analytics</p>
      </div>
      {/* Stats Cards with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvestment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Spent on keys</p>
            {investmentTrend !== 0 && (
              <div className={`text-xs flex items-center mt-1 ${investmentTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {investmentTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(investmentTrend).toFixed(1)}% from last period
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Revenue from all runs</p>
            {profitTrend !== 0 && (
              <div className={`text-xs flex items-center mt-1 ${profitTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {profitTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(profitTrend).toFixed(1)}% from last period
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRuns}</div>
            <p className="text-xs text-muted-foreground">Completed key runs</p>
            {runsTrend !== 0 && (
              <div className={`text-xs flex items-center mt-1 ${runsTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {runsTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(runsTrend).toFixed(1)}% from last period
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            {netProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Profit after investment</p>
            {netProfitTrend !== 0 && (
              <div className={`text-xs flex items-center mt-1 ${netProfitTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {netProfitTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(netProfitTrend).toFixed(1)}% from last period
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Area Chart */}
      {profitTrendData.length > 0 && (
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Profit Performance</CardTitle>
              <CardDescription>Cumulative profit over time from all key runs</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border bg-background">
                <Button 
                  variant={timePeriod === 7 ? "default" : "ghost"} 
                  size="sm" 
                  className="h-7 rounded-none rounded-l-md px-3 text-xs font-medium first:rounded-l-md last:rounded-r-md"
                  onClick={() => setTimePeriod(7)}
                >
                  7
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button 
                  variant={timePeriod === 14 ? "default" : "ghost"} 
                  size="sm" 
                  className="h-7 rounded-none px-3 text-xs font-medium first:rounded-l-md last:rounded-r-md"
                  onClick={() => setTimePeriod(14)}
                >
                  14
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button 
                  variant={timePeriod === 30 ? "default" : "ghost"} 
                  size="sm" 
                  className="h-7 rounded-none rounded-r-md px-3 text-xs font-medium first:rounded-l-md last:rounded-r-md"
                  onClick={() => setTimePeriod(30)}
                >
                  30
                </Button>
              </div>
              <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-xs h-7 rounded-md px-2">
                <TrendingUp className="h-3 w-3" />
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
                <Area
                  dataKey="cumulative"
                  type="natural"
                  fill="url(#fillCumulative)"
                  stroke="var(--color-cumulative)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Performance Radar Chart - Lines Only */}
        {locationData.some(item => item.profit > 0 || item.runs > 0) ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Profit by Location</CardTitle>
              <CardDescription>Distribution of profits across different locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  profit: {
                    label: "Profit",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <RadarChart data={locationDataWithPercentages}>
                  <ChartTooltip
                    cursor={false}
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
                  <PolarAngleAxis dataKey="location" />
                  <PolarGrid radialLines={false} />
                  <Radar
                    dataKey="displayProfit"
                    fill="transparent"
                    fillOpacity={0}
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ 
                      r: 4,
                      fill: "hsl(var(--chart-1))",
                      stroke: "#fff",
                      strokeWidth: 2
                    }}
                    activeDot={{ 
                      r: 6,
                      fill: "hsl(var(--chart-1))",
                      stroke: "#fff",
                      strokeWidth: 2
                    }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    tick={false}
                    axisLine={false}
                  />
                </RadarChart>
              </ChartContainer>
              {/* Summary below the chart */}
              <div className="mt-4 text-center">
                {(() => {
                  // Find the location with the highest profit
                  const maxProfitLocation = locationData.reduce((max, current) => 
                    (current.profit || 0) > (max.profit || 0) ? current : max
                  , locationData[0]);
                  
                  // Calculate average profit per run for that location
                  const avgProfit = maxProfitLocation.runs > 0 
                    ? (maxProfitLocation.profit || 0) / maxProfitLocation.runs 
                    : 0;
                  
                  return (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Most Profit By Location: <span className="font-bold text-foreground">{maxProfitLocation.location}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Avg run ${(avgProfit || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} of that location
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        ) : (
                    <Card>
            <CardHeader className="text-center">
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
          <CardHeader className="text-center">
            <CardTitle>Daily Performance Calendar</CardTitle>
            <CardDescription>Hover over days to see profits and key usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-2">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium mx-4">{calendarData.monthName}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-1 max-w-[300px] mx-auto">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1 aspect-square flex items-center justify-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 max-w-[300px] mx-auto">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: calendarData.startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {Array.from({ length: calendarData.daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const dayData = calendarData.dailyData[day]
                  const hasData = dayData && dayData.runs.length > 0
                  
                  // Check if this is the current day
                  const today = new Date()
                  const isCurrentDay = 
                    calendarMonth.getFullYear() === today.getFullYear() &&
                    calendarMonth.getMonth() === today.getMonth() &&
                    day === today.getDate()

                  return (
                    <div
                      key={`${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${day}`}
                      className={`aspect-square border rounded flex items-center justify-center text-xs relative cursor-pointer transition-all hover:border-primary group ${
                        hasData 
                          ? "bg-primary/10 border-primary/30 hover:bg-primary/20" 
                          : "hover:bg-accent"
                      } ${
                        isCurrentDay 
                          ? "bg-primary/10 border-primary/30" 
                          : ""
                      }`}
                    >
                      <span className="font-medium">{day}</span>
                      {hasData && !isCurrentDay && (
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
                                {(() => {
                                  // Group runs by key name and accumulate profits
                                  const keyProfits: { [key: string]: { profit: number; count: number } } = {};
                                  dayData.runs.forEach((run) => {
                                    if (!keyProfits[run.keyName]) {
                                      keyProfits[run.keyName] = { profit: 0, count: 0 };
                                    }
                                    keyProfits[run.keyName].profit += run.profit;
                                    keyProfits[run.keyName].count += 1;
                                  });

                                  // Convert to array and sort by profit (descending)
                                  const sortedKeys = Object.entries(keyProfits).sort(
                                    (a, b) => b[1].profit - a[1].profit
                                  );

                                  return sortedKeys.slice(0, 3).map(([keyName, data], idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                      <span className="truncate max-w-[100px]">
                                        {keyName} {data.count > 1 ? `(${data.count})` : ''}
                                      </span>
                                      <span
                                        className={`font-medium ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                                      >
                                        ${data.profit.toLocaleString()}
                                      </span>
                                    </div>
                                  ));
                                })()}
                                {(() => {
                                  // Group runs by key name and accumulate profits
                                  const keyProfits: { [key: string]: { profit: number; count: number } } = {};
                                  dayData.runs.forEach((run) => {
                                    if (!keyProfits[run.keyName]) {
                                      keyProfits[run.keyName] = { profit: 0, count: 0 };
                                    }
                                    keyProfits[run.keyName].profit += run.profit;
                                    keyProfits[run.keyName].count += 1;
                                  });

                                  const uniqueKeyCount = Object.keys(keyProfits).length;
                                  if (uniqueKeyCount > 3) {
                                    return (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        +{uniqueKeyCount - 3} more keys
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
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

    </div>
  )
}