"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  KeyRound,
  Edit,
  Trash2,
  Info,
  DollarSign,
  TrendingUp,
  Target,
  TrendingDown,
  MoreHorizontal,
  Camera,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import html2canvas from "html2canvas"

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

interface RunSortConfig {
  key: 'runNumber' | 'profit';
  direction: 'ascending' | 'descending';
}

const LOCATIONS = ["Farm", "Armory", "TV Station", "Northridge"]

export default function KeyTracker({ keys, setKeysAction }: { keys: KeyData[], setKeysAction: (keys: KeyData[]) => void }) {
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<KeyData | null>(null)
  const [infoKey, setInfoKey] = useState<KeyData | null>(null)
  const [runProfit, setRunProfit] = useState(0)
  const [editingRun, setEditingRun] = useState<{ keyId: string; runNumber: number; profit: number } | null>(null)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<KeyData | null>(null)
  const [newKey, setNewKey] = useState({
    name: "",
    location: "",
    cost: 0,
  })

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<KeyData | null>(null)
  
  // State for run deletion confirmation dialog
  const [isRunDeleteDialogOpen, setIsRunDeleteDialogOpen] = useState(false)
  const [runToDelete, setRunToDelete] = useState<{ keyId: string; runNumber: number; profit: number } | null>(null)

  // State for run sorting
  const [runSortConfig, setRunSortConfig] = useState<{ key: 'runNumber' | 'profit'; direction: 'ascending' | 'descending' }>({ 
    key: 'runNumber', 
    direction: 'descending' 
  });

  const [isEditRunDialogOpen, setIsEditRunDialogOpen] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    location: "",
    cost: "",
  })
  
  // Ref for screenshot functionality
  const runHistoryRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (infoKey) {
      const updatedInfoKey = keys.find(key => key.id === infoKey.id)
      if (updatedInfoKey && JSON.stringify(updatedInfoKey) !== JSON.stringify(infoKey)) {
        setInfoKey(updatedInfoKey)
      }
    }
  }, [keys, infoKey])

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

    // Get the next run number based on existing runs
    const nextRunNumber = selectedKey.runs.length + 1

    const newRun = {
      runNumber: nextRunNumber,
      profit: runProfit,
      date: new Date().toISOString(),
    }

    setKeysAction(
      keys.map((key) => {
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

    setKeysAction([...keys, key])
    setNewKey({ name: "", location: "", cost: 0 })
    setValidationErrors({ name: "", location: "", cost: "" })
    setIsAddDialogOpen(false)
  }

  const editKey = () => {
    if (!editingKey) return
    setKeysAction(keys.map((key) => (key.id === editingKey.id ? editingKey : key)))
    setIsEditDialogOpen(false)
    setEditingKey(null)
  }

  const deleteKey = (keyId: string) => {
    setKeysAction(keys.filter((key) => key.id !== keyId))
  }

  const openDeleteDialog = (key: KeyData) => {
    setKeyToDelete(key)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteKey = () => {
    if (keyToDelete) {
      deleteKey(keyToDelete.id)
      setIsDeleteDialogOpen(false)
      setKeyToDelete(null)
    }
  }

  const openRunDeleteDialog = (keyId: string, runNumber: number, profit: number) => {
    setRunToDelete({ keyId, runNumber, profit })
    setIsRunDeleteDialogOpen(true)
  }

  const confirmDeleteRun = () => {
    if (runToDelete) {
      // Implement delete run functionality
      const updatedKeys = keys.map((key: KeyData) => {
        if (key.id === runToDelete.keyId) {
          // Filter out the deleted run
          const updatedRuns = key.runs.filter((runItem: { runNumber: number; profit: number; date: string }) => 
            runItem.runNumber !== runToDelete.runNumber
          )
          
          // Renumber the remaining runs sequentially
          const renumberedRuns = updatedRuns
            .sort((a, b) => a.runNumber - b.runNumber) // Sort by run number
            .map((run, index) => ({
              ...run,
              runNumber: index + 1 // Renumber starting from 1
            }))
          
          const newTotalProfit = renumberedRuns.reduce((sum: number, runItem: { runNumber: number; profit: number; date: string }) => sum + (runItem.profit || 0), 0)
          const newTotalRuns = renumberedRuns.length
          return { 
            ...key, 
            runs: renumberedRuns, 
            totalProfit: newTotalProfit,
            totalRuns: newTotalRuns,
            currentUses: newTotalRuns  // Update currentUses to match actual runs
          }
        }
        return key
      })
      setKeysAction(updatedKeys)
      setIsRunDeleteDialogOpen(false)
      setRunToDelete(null)
    }
  }

  const resetKeyUses = (keyId: string) => {
    setKeysAction(keys.map((key) => (key.id === keyId ? { ...key, currentUses: 0 } : key)))
  }

  const getAverageProfit = (key: KeyData) => {
    if (key.runs.length === 0) return 0
    return key.totalProfit / key.runs.length
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const openAddDialog = () => {
    setValidationErrors({ name: "", location: "", cost: "" })
    setIsAddDialogOpen(true)
  }

  // Function to handle sorting
  const handleSort = (key: 'runNumber' | 'profit') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (runSortConfig.key === key && runSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setRunSortConfig({ key, direction });
  };

  // Function to sort runs based on current sort config
  const getSortedRuns = (runs: KeyData['runs']) => {
    const sortedRuns = [...runs];
    sortedRuns.sort((a, b) => {
      if (runSortConfig.key === 'runNumber') {
        return runSortConfig.direction === 'ascending' 
          ? a.runNumber - b.runNumber 
          : b.runNumber - a.runNumber;
      } else { // profit
        return runSortConfig.direction === 'ascending' 
          ? (a.profit || 0) - (b.profit || 0) 
          : (b.profit || 0) - (a.profit || 0);
      }
    });
    return sortedRuns;
  };

  const takeScreenshot = async () => {
    if (runHistoryRef.current) {
      try {
        // Create a full-screen overlay to hide the scrolling
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.innerHTML = `
          <div style="text-align: center; color: white;">
            <div style="border: 4px solid rgba(255, 255, 255, 0.3); border-top: 4px solid white; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
            <p style="font-size: 18px; font-weight: 500; margin: 0;">Taking screenshot...</p>
            <p style="font-size: 14px; opacity: 0.8; margin: 4px 0 0;">Please wait</p>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
        document.body.appendChild(overlay);
        
        // Small delay to ensure overlay is rendered
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Temporarily modify the element to show all content without scrolling
        const element = runHistoryRef.current;
        const originalMaxHeight = element.style.maxHeight;
        const originalOverflow = element.style.overflowY;
        
        // Remove height restrictions to show all content
        element.style.maxHeight = 'none';
        element.style.overflowY = 'visible';
        
        // Force a reflow
        element.offsetHeight;
        
        // Take the screenshot with backgroundColor matching the theme
        const canvas = await html2canvas(element, {
          scrollY: 0,
          scrollX: 0,
          height: element.scrollHeight,
          width: element.scrollWidth,
          useCORS: true,
          scale: 2, // Higher quality
          backgroundColor: document.documentElement.classList.contains('dark') ? '#0c0c0c' : '#ffffff'
        });
        
        // Restore original styles
        element.style.maxHeight = originalMaxHeight;
        element.style.overflowY = originalOverflow;
        
        // Remove the overlay
        document.body.removeChild(overlay);
        
        // Create and download the image
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `key-run-history-${infoKey?.name || "unnamed"}-${new Date().toISOString().slice(0, 10)}.png`;
        link.click();
      } catch (error) {
        console.error("Error taking screenshot:", error);
        // Remove overlay in case of error
        const overlay = document.querySelector('div[style*="position: fixed"]') as HTMLElement;
        if (overlay) {
          document.body.removeChild(overlay);
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Key Management</h2>
          <p className="text-muted-foreground">Manage your keys and track their usage</p>
        </div>
        <Drawer open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DrawerTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Key
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-md mx-auto mt-32 mb-16 rounded-lg border-none shadow-lg">
            <DrawerHeader className="text-left">
              <DrawerTitle>Add New Key</DrawerTitle>
              <DrawerDescription>Enter the details for your new key</DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-4 py-4 px-6">
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
            <DrawerFooter className="gap-2">
              <Button onClick={addKey}>Add Key</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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
                  <TableHead>Avg Profit/Run</TableHead>
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
                    <TableCell className={key.totalRuns > 0 ? (key.totalProfit / key.totalRuns) >= 0 ? "text-green-600" : "text-red-600" : ""}>
                      {key.totalRuns > 0 ? `${Math.round((key.totalProfit || 0) / key.totalRuns).toLocaleString()}` : "$0"}
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
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => openDeleteDialog(key)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Empty State */}
            {keys.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <KeyRound className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No keys found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add your first key to start tracking usage and profits
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Run Drawer */}
      <Drawer open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DrawerContent className="max-w-md mx-auto mt-32 mb-16 rounded-lg border-none shadow-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle>Record New Run</DrawerTitle>
            <DrawerDescription>
              Enter the profit from your key run for {selectedKey?.name}
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4 px-6">
            <div className="grid gap-2">
              <Label htmlFor="profit">Profit</Label>
              <Input
                id="profit"
                type="text"
                value={runProfit ? runProfit.toLocaleString() : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, "")
                  if (!isNaN(Number(value)) || value === "") {
                    setRunProfit(value === "" ? 0 : Number(value))
                  }
                }}
                placeholder="25,000"
              />
            </div>
          </div>
          <DrawerFooter className="gap-2">
            <Button onClick={submitRun}>Record Run</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Info Drawer */}
      <Drawer open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DrawerContent className="max-w-4xl mx-auto mt-24 mb-16 rounded-lg border-none shadow-lg">
          <DrawerHeader className="text-left">
            <div className="flex justify-between items-center">
              <div>
                <DrawerTitle>Key Details - {infoKey?.name}</DrawerTitle>
                <DrawerDescription>View performance metrics and run history</DrawerDescription>
              </div>
              {infoKey && infoKey.runs.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={takeScreenshot}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Screenshot
                </Button>
              )}
            </div>
          </DrawerHeader>
          {infoKey && (
            <div ref={runHistoryRef} className="grid gap-6 py-4 px-6 overflow-y-auto max-h-[70vh]">
              {/* Key Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Key Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(infoKey.cost || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Initial investment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">${(infoKey.totalProfit || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Net earnings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Profit/Run</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {infoKey && infoKey.totalRuns > 0 
                        ? `${Math.round((infoKey.totalProfit || 0) / infoKey.totalRuns).toLocaleString()}` 
                        : "$0"}
                    </div>
                    <p className="text-xs text-muted-foreground">Per run average</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ROI</CardTitle>
                    {(calculateROI(infoKey) || 0) >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${(calculateROI(infoKey) || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {(calculateROI(infoKey) || 0).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Return on investment</p>
                  </CardContent>
                </Card>
              </div>

              {/* Run History */}
              <Card>
                <CardHeader>
                  <CardTitle>Run History - {infoKey?.totalRuns || 0} Runs</CardTitle>
                  <CardDescription>All recorded runs for this <span className="font-bold">{infoKey?.name || "key"}</span> Key</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('runNumber')}
                        >
                          <div className="flex items-center">
                            Run
                            {runSortConfig.key === 'runNumber' && (
                              runSortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('profit')}
                        >
                          <div className="flex items-center">
                            Profit
                            {runSortConfig.key === 'profit' && (
                              runSortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {infoKey && getSortedRuns(infoKey.runs).map((run) => (
                        <TableRow key={run.runNumber}>
                          <TableCell>#{run.runNumber}</TableCell>
                          <TableCell className={(run.profit || 0) >= 0 ? "text-green-600" : "text-red-600"}>
                            ${(run.profit || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>{formatDate(run.date)}</TableCell>
                          <TableCell className="text-right">
                            <RunActionsMenu 
                              run={run} 
                              keyId={infoKey.id} 
                              onEdit={(profit) => {
                                setEditingRun({ keyId: infoKey.id, runNumber: run.runNumber, profit })
                                setIsEditRunDialogOpen(true)
                              }}
                              onDelete={() => openRunDeleteDialog(infoKey.id, run.runNumber, run.profit)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {infoKey.runs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No runs recorded yet</p>
                      <p className="text-sm">Complete a run to see it here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DrawerContent className="max-w-md mx-auto mt-32 mb-16 rounded-lg border-none shadow-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Key</DrawerTitle>
            <DrawerDescription>Update the details for this key</DrawerDescription>
          </DrawerHeader>
          {editingKey && (
            <div className="grid gap-4 py-4 px-6">
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
          <DrawerFooter className="gap-2">
            <Button onClick={editKey}>Save Changes</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the key "{keyToDelete?.name}" and all associated run data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteKey} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Run Drawer */}
      <Drawer open={isEditRunDialogOpen} onOpenChange={setIsEditRunDialogOpen}>
        <DrawerContent className="max-w-md mx-auto mt-32 mb-16 rounded-lg border-none shadow-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Run</DrawerTitle>
            <DrawerDescription>Update the profit for this run</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4 px-6">
            <div className="grid gap-2">
              <Label htmlFor="edit-run-profit">Profit</Label>
              <Input
                id="edit-run-profit"
                type="text"
                value={editingRun?.profit ? editingRun.profit.toLocaleString() : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, "")
                  if (!isNaN(Number(value)) || value === "") {
                    setEditingRun(prev => prev ? { ...prev, profit: value === "" ? 0 : Number(value) } : null)
                  }
                }}
                placeholder="25,000"
              />
            </div>
          </div>
          <DrawerFooter className="gap-2">
            <Button 
              onClick={() => {
                if (editingRun) {
                  // Update the keys
                  const updatedKeys = keys.map((key: KeyData) => {
                    if (key.id === editingRun.keyId) {
                      const updatedRuns = key.runs.map((run: { runNumber: number; profit: number; date: string }) => 
                        run.runNumber === editingRun.runNumber 
                          ? { ...run, profit: editingRun.profit }
                          : run
                      )
                      const newTotalProfit = updatedRuns.reduce((sum: number, run: { runNumber: number; profit: number; date: string }) => sum + (run.profit || 0), 0)
                      return { ...key, runs: updatedRuns, totalProfit: newTotalProfit }
                    }
                    return key
                  })
                  setKeysAction(updatedKeys)
                  
                  setIsEditRunDialogOpen(false)
                  setEditingRun(null)
                }
              }}
            >
              Save Changes
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    {/* Run Delete Confirmation Dialog */}
      <AlertDialog open={isRunDeleteDialogOpen} onOpenChange={setIsRunDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this run?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete run #{runToDelete?.runNumber} with a profit of ${(runToDelete?.profit || 0).toLocaleString()}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRun} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Run
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface RunActionsMenuProps {
  run: { runNumber: number; profit: number; date: string }
  keyId: string
  onEdit: (profit: number) => void
  onDelete: () => void
}

const RunActionsMenu = ({ run, keyId, onEdit, onDelete }: RunActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(run.profit)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}