"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Shield,
  Edit,
  Trash2,
  Settings,
  Search,
  Download,
  Upload,
  MoreHorizontal,
  FileText,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export default function ArmorManager({ armors, setArmors }: { armors: ArmorData[], setArmors: (armors: ArmorData[]) => void }) {
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
  const [selectedRepairNPC, setSelectedRepairNPC] = useState<"" | "low" | "medium" | "high">("")
  const [newCurrentDurability, setNewCurrentDurability] = useState("")

  // Edit states
  const [isEditArmorDialogOpen, setIsEditArmorDialogOpen] = useState(false)
  const [editingArmor, setEditingArmor] = useState<ArmorData | null>(null)

  // Export/Import states
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importData, setImportData] = useState("")
  const [importError, setImportError] = useState("")
  const [exportData, setExportData] = useState("")

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [armorToDelete, setArmorToDelete] = useState<ArmorData | null>(null)

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

  const deleteArmor = (armorId: string) => {
    setArmors(armors.filter((armor) => armor.id !== armorId))
  }

  const openEditDialog = (armor: ArmorData) => {
    setEditingArmor(armor)
    setIsEditArmorDialogOpen(true)
  }

  const updateArmor = () => {
    if (!editingArmor) return

    setArmors(
      armors.map((armor) => 
        armor.id === editingArmor.id ? ensureRepairDeductions(editingArmor) : armor
      )
    )
    
    setIsEditArmorDialogOpen(false)
    setEditingArmor(null)
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

  // Helper functions for editing protected areas
  const addEditingProtectedArea = (area: string) => {
    if (editingArmor && !editingArmor.protectedAreas.includes(area)) {
      setEditingArmor({
        ...editingArmor,
        protectedAreas: [...editingArmor.protectedAreas, area],
      })
    }
  }

  const removeEditingProtectedArea = (area: string) => {
    if (editingArmor) {
      setEditingArmor({
        ...editingArmor,
        protectedAreas: editingArmor.protectedAreas.filter((a) => a !== area),
      })
    }
  }

  // Repair functions
  const openRepairDialog = (armor: ArmorData) => {
    setRepairingArmor(armor)
    setSelectedRepairNPC("")
    setIsRepairDialogOpen(true)
  }

  // Export/Import functions
  const exportArmors = () => {
    const exportPayload = {
      version: "1.0",
      exportDate: new Date().toISOString(),
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

  // Filter armors based on search and condition
  const filteredArmors = armors.filter((armor) => {
    const matchesSearch = armor.name.toLowerCase().includes(armorSearchTerm.toLowerCase())
    const matchesCondition = !armorConditionFilter || armor.condition === armorConditionFilter
    return matchesSearch && matchesCondition
  })

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Armor Durability Management</h2>
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
                                <MoreHorizontal className="h-3 w-3" />
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
                    <div className="flex items-center justify-between">
                      <Label>Repair Deductions</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          // Toggle between simple and detailed view
                          // Check if we're currently in simple mode (all values are the same and non-zero, or all are zero)
                          const isSimpleMode = (newArmor.repairDeductions.low === newArmor.repairDeductions.medium && 
                                               newArmor.repairDeductions.low === newArmor.repairDeductions.high);
                          
                          if (isSimpleMode && newArmor.repairDeductions.low !== 0) {
                            // Switch to detailed view with default values
                            setNewArmor({
                              ...newArmor,
                              repairDeductions: {
                                low: 8.1,
                                medium: 6.1,
                                high: 4.5,
                              }
                            });
                          } else {
                            // Switch to simple view with current low value or default 0
                            const currentValue = newArmor.repairDeductions.low || 0;
                            setNewArmor({
                              ...newArmor,
                              repairDeductions: {
                                low: currentValue,
                                medium: currentValue,
                                high: currentValue,
                              }
                            });
                          }
                        }}
                      >
                        {(newArmor.repairDeductions.low === newArmor.repairDeductions.medium && 
                          newArmor.repairDeductions.low === newArmor.repairDeductions.high && 
                          newArmor.repairDeductions.low !== 0) ? 
                         'Show NPC Options' : 'Simple Deduction'}
                      </Button>
                    </div>
                    
                    {/* Simple Deduction View */}
                    {(newArmor.repairDeductions.low === newArmor.repairDeductions.medium && 
                      newArmor.repairDeductions.low === newArmor.repairDeductions.high && 
                      newArmor.repairDeductions.low !== 0) ? (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="simple-repair-deduction">Deduction Value</Label>
                          <Input
                            id="simple-repair-deduction"
                            type="number"
                            step="0.1"
                            value={newArmor.repairDeductions.low}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setNewArmor({
                                ...newArmor,
                                repairDeductions: {
                                  low: value,
                                  medium: value,
                                  high: value,
                                }
                              });
                            }}
                            placeholder="Enter deduction value"
                            className="text-right"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Detailed NPC View */
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
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addArmor}>Add Armor</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Armor Dialog */}
            <Dialog open={isEditArmorDialogOpen} onOpenChange={setIsEditArmorDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Armor</DialogTitle>
                  <DialogDescription>Modify the details for your body armor</DialogDescription>
                </DialogHeader>
                {editingArmor && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-armor-name">Armor Name</Label>
                        <Input
                          id="edit-armor-name"
                          value={editingArmor.name}
                          onChange={(e) => setEditingArmor({ ...editingArmor, name: e.target.value })}
                          placeholder="e.g., 926 Composite Body Armor"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-armor-class">Armor Class</Label>
                        <Select
                          value={editingArmor.armorClass.toString()}
                          onValueChange={(value) => setEditingArmor({ ...editingArmor, armorClass: Number(value) })}
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
                        {editingArmor.protectedAreas.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {editingArmor.protectedAreas.map((area) => (
                              <Badge key={area} variant="default" className="flex items-center gap-1">
                                {area}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 hover:bg-transparent"
                                  onClick={() => setEditingArmor({
                                    ...editingArmor,
                                    protectedAreas: editingArmor.protectedAreas.filter((a) => a !== area)
                                  })}
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Add Area Dropdown */}
                        <Select
                          onValueChange={(value) => {
                            if (editingArmor.protectedAreas.includes(value)) {
                              setEditingArmor({
                                ...editingArmor,
                                protectedAreas: editingArmor.protectedAreas.filter((a) => a !== value)
                              })
                            } else {
                              setEditingArmor({
                                ...editingArmor,
                                protectedAreas: [...editingArmor.protectedAreas, value]
                              })
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
                                  {editingArmor.protectedAreas.includes(area) && (
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
                        <Label htmlFor="edit-material">Material</Label>
                        <Select
                          value={editingArmor.material}
                          onValueChange={(value) => setEditingArmor({ ...editingArmor, material: value })}
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
                        <Label htmlFor="edit-armor-type">Armor Type</Label>
                        <Select
                          value={editingArmor.condition}
                          onValueChange={(value: "Body Armor" | "Armored Rig") =>
                            setEditingArmor({ ...editingArmor, condition: value })
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
                        <Label htmlFor="edit-movement-speed">Movement Speed</Label>
                        <Input
                          id="edit-movement-speed"
                          value={editingArmor.movementSpeed}
                          onChange={(e) => setEditingArmor({ ...editingArmor, movementSpeed: e.target.value })}
                          placeholder="e.g., -4%"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-ergonomics">Ergonomics</Label>
                        <Input
                          id="edit-ergonomics"
                          value={editingArmor.ergonomics}
                          onChange={(e) => setEditingArmor({ ...editingArmor, ergonomics: e.target.value })}
                          placeholder="e.g., -3"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-weight">Weight</Label>
                        <Input
                          id="edit-weight"
                          value={editingArmor.weight}
                          onChange={(e) => setEditingArmor({ ...editingArmor, weight: e.target.value })}
                          placeholder="e.g., 6.20kg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-new-durability">New Durability</Label>
                        <Input
                          id="edit-new-durability"
                          type="number"
                          value={editingArmor.newDurability}
                          onChange={(e) => setEditingArmor({ ...editingArmor, newDurability: Number(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-like-new-durability">Like New Durability</Label>
                        <Input
                          id="edit-like-new-durability"
                          type="number"
                          value={editingArmor.likeNewDurability}
                          onChange={(e) => setEditingArmor({ ...editingArmor, likeNewDurability: Number(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-worn-durability">Worn Durability</Label>
                        <Input
                          id="edit-worn-durability"
                          type="number"
                          value={editingArmor.wornDurability}
                          onChange={(e) => setEditingArmor({ ...editingArmor, wornDurability: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* Repair Deductions Section */}
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label>Repair Deductions</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (!editingArmor) return;
                            
                            // Toggle between simple and detailed view
                            // Check if we're currently in simple mode (all values are the same and non-zero, or all are zero)
                            const isSimpleMode = (editingArmor.repairDeductions.low === editingArmor.repairDeductions.medium && 
                                                 editingArmor.repairDeductions.low === editingArmor.repairDeductions.high);
                            
                            if (isSimpleMode && editingArmor.repairDeductions.low !== 0) {
                              // Switch to detailed view with default values
                              setEditingArmor({
                                ...editingArmor,
                                repairDeductions: {
                                  low: 8.1,
                                  medium: 6.1,
                                  high: 4.5,
                                }
                              });
                            } else {
                              // Switch to simple view with current low value or default 0
                              const currentValue = editingArmor.repairDeductions.low || 0;
                              setEditingArmor({
                                ...editingArmor,
                                repairDeductions: {
                                  low: currentValue,
                                  medium: currentValue,
                                  high: currentValue,
                                }
                              });
                            }
                          }}
                        >
                          {editingArmor && 
                           (editingArmor.repairDeductions.low === editingArmor.repairDeductions.medium && 
                            editingArmor.repairDeductions.low === editingArmor.repairDeductions.high && 
                            editingArmor.repairDeductions.low !== 0) ? 
                           'Show NPC Options' : 'Simple Deduction'}
                        </Button>
                      </div>
                      
                      {/* Simple Deduction View */}
                      {editingArmor && 
                       (editingArmor.repairDeductions.low === editingArmor.repairDeductions.medium && 
                        editingArmor.repairDeductions.low === editingArmor.repairDeductions.high && 
                        editingArmor.repairDeductions.low !== 0) ? (
                        <div className="grid grid-cols-1 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-simple-repair-deduction">Deduction Value</Label>
                            <Input
                              id="edit-simple-repair-deduction"
                              type="number"
                              step="0.1"
                              value={editingArmor.repairDeductions.low}
                              onChange={(e) => {
                                if (!editingArmor) return;
                                const value = Number(e.target.value);
                                setEditingArmor({
                                  ...editingArmor,
                                  repairDeductions: {
                                    low: value,
                                    medium: value,
                                    high: value,
                                  }
                                });
                              }}
                              placeholder="Enter deduction value"
                              className="text-right"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Detailed NPC View */
                        editingArmor && (
                          <div className="grid grid-cols-3 gap-4">
                            {REPAIR_NPCS.map((npc) => (
                              <div key={npc.id} className="grid gap-2">
                                <Label htmlFor={`edit-repair-${npc.id}`} className={`text-xs ${npc.color}`}>
                                  {npc.name} ({npc.id})
                                </Label>
                                <Input
                                  id={`edit-repair-${npc.id}`}
                                  type="number"
                                  step="0.1"
                                  value={editingArmor.repairDeductions[npc.id as keyof typeof editingArmor.repairDeductions]}
                                  onChange={(e) => {
                                    if (!editingArmor) return;
                                    setEditingArmor({
                                      ...editingArmor,
                                      repairDeductions: {
                                        ...editingArmor.repairDeductions,
                                        [npc.id]: Number(e.target.value),
                                      },
                                    });
                                  }}
                                  placeholder={npc.defaultDeduction.toString()}
                                  className="text-right"
                                />
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={updateArmor}>Update Armor</Button>
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
                        <DropdownMenuItem onClick={() => openEditDialog(armor)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openRepairDialog(armor)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Repair Calculator
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setArmorToDelete(armor)
                            setIsDeleteDialogOpen(true)
                          }} 
                          className="text-red-600"
                        >
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
            </CardContent>
          </Card>
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
                    {repairingArmor && 
                     repairingArmor.repairDeductions.low === repairingArmor.repairDeductions.medium && 
                     repairingArmor.repairDeductions.low === repairingArmor.repairDeductions.high &&
                     repairingArmor.repairDeductions.low !== 0 ? (
                      // Simple deduction mode - show only one result
                      (() => {
                        const armorWithDeductions = ensureRepairDeductions(repairingArmor);
                        const deduction = armorWithDeductions.repairDeductions.low;
                        const afterRepair = Math.max(0, Number(newCurrentDurability) - deduction);
                        
                        // Determine repair quality based on thresholds
                        let recommendationText = "";
                        if (Number(newCurrentDurability) > 0) {
                          if (afterRepair >= repairingArmor.likeNewDurability) {
                            recommendationText = "Excellent repair choice";
                          } else if (afterRepair >= repairingArmor.wornDurability) {
                            recommendationText = "Decent repair option";
                          } else {
                            recommendationText = "Not recommended";
                          }
                        }
                        
                        return (
                          <div
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              selectedRepairNPC === "low"
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted/50 border-border"
                            }`}
                            onClick={() => setSelectedRepairNPC("low")}
                          >
                            <div>
                              <span className="font-medium">Repair Deduction</span>
                              <div className="text-xs text-muted-foreground">Simple Mode</div>
                            </div>
                            <div className="text-right">
                              {Number(newCurrentDurability) > 0 ? (
                                <div>
                                  <div className="font-medium">{Math.round(afterRepair * 10) / 10}</div>
                                  <div className="text-xs text-muted-foreground">{recommendationText}</div>
                                </div>
                              ) : (
                                <div className="text-sm">-{deduction}</div>
                              )}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      // Detailed mode - show all three NPCs
                      REPAIR_NPCS.map((npc) => {
                        const armorWithDeductions = ensureRepairDeductions(repairingArmor!);
                        const deduction =
                          armorWithDeductions.repairDeductions[npc.id as keyof typeof armorWithDeductions.repairDeductions];
                        const afterRepair = Math.max(0, Number(newCurrentDurability) - deduction);
                        
                        // Determine repair quality based on thresholds
                        let recommendationText = "";
                        if (Number(newCurrentDurability) > 0) {
                          if (afterRepair >= repairingArmor!.likeNewDurability) {
                            recommendationText = "Excellent repair choice";
                          } else if (afterRepair >= repairingArmor!.wornDurability) {
                            recommendationText = "Decent repair option";
                          } else {
                            recommendationText = "Not recommended";
                          }
                        }
                        
                        return (
                          <div
                            key={npc.id}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border ${
                              selectedRepairNPC === npc.id
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted/50 border-border"
                            }`}
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
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* DialogFooter removed - no Apply Repair button needed */}
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
                    <MoreHorizontal className="h-4 w-4" />
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this armor? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {armorToDelete && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium">{armorToDelete.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    Class {armorToDelete.armorClass} {armorToDelete.condition}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will permanently remove the armor from your collection.
                </p>
              </div>
            )}
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (armorToDelete) {
                    deleteArmor(armorToDelete.id)
                    setIsDeleteDialogOpen(false)
                    setArmorToDelete(null)
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Armor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}