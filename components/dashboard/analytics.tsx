"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"

const LOCATIONS = ["Farm", "Armory", "TV Station", "Northridge"]

export default function Analytics({ keys }: { keys: any[] }) {
  const calculateROI = (key: any) => {
    if (key.totalRuns === 0) return 0
    const totalInvestment = key.cost
    const netProfit = key.totalProfit - totalInvestment
    return (netProfit / totalInvestment) * 100
  }

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
}