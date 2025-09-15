"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  KeyRound,
  BarChart3,
  Settings,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  User,
  Edit,
  Trash2,
  Plus,
  Crown,
  Star,
  Zap,
  Target,
  Trophy,
  Gamepad2,
  Sword,
  Crosshair,
  Skull,
  Heart,
  Diamond,
  Flame,
  Rocket,
  Computer,
} from "lucide-react";
import { MobileRestriction } from "@/components/mobile-restriction";
import { Separator } from "@/components/ui/separator";
import KeyTracker from "@/components/key-tracker/key-tracker";
import ArmorManager from "@/components/armor-manager/armor-manager";
import Dashboard from "@/components/dashboard/dashboard";
import Analytics from "@/components/dashboard/analytics";
import ProfileManager from "@/components/profiles/profile-manager";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarHeaderContent } from "@/components/sidebar-header";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SettingsPage } from "@/components/settings-page"
import { SupportPage } from "@/components/support-page";

const PROFILE_ICONS = [
  "User",
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
];

interface KeyData {
  id: string;
  name: string;
  location: string;
  cost: number;
  currentUses: number;
  totalRuns: number;
  totalProfit: number;
  runs: Array<{ runNumber: number; profit: number; date: string }>;
}

interface ArmorData {
  id: string;
  name: string;
  armorClass: number;
  protectedAreas: string[];
  material: string;
  movementSpeed: string;
  ergonomics: string;
  weight: string;
  newDurability: number;
  likeNewDurability: number;
  wornDurability: number;
  condition: "Body Armor" | "Armored Rig";
  repairCost: number;
  purchaseDate: string;
  repairHistory: Array<{
    date: string;
    cost: number;
    durabilityRestored: number;
  }>;
  repairDeductions: {
    low: number;
    medium: number;
    high: number;
  };
  currentDurability?: number;
}

interface Profile {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  keys: KeyData[];
  armors: ArmorData[];
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "keys", label: "Key Management", icon: KeyRound },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support", icon: Heart },
];

const mainTabs = [
  { id: "keys", label: "Key", icon: KeyRound },
  { id: "armor", label: "Armor", icon: Shield },
];

const keySidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "list", label: "List", icon: KeyRound }, // Changed from "Key Management" to "List"
  // Removed support from key sidebar
  // Removed analytics
];

const armorSidebarItems = [
  { id: "armor-overview", label: "Overview", icon: Home },
  // Removed support from armor sidebar
  // Removed calculator submenu since we have calculator on the cards
];

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    User: () => <User className="h-4 w-4" />,
    Crown: () => <Crown className="h-4 w-4" />,
    Shield: () => <Shield className="h-4 w-4" />,
    Star: () => <Star className="h-4 w-4" />,
    Zap: () => <Zap className="h-4 w-4" />,
    Target: () => <Target className="h-4 w-4" />,
    Trophy: () => <Trophy className="h-4 w-4" />,
    Gamepad2: () => <Gamepad2 className="h-4 w-4" />,
    Sword: () => <Sword className="h-4 w-4" />,
    Crosshair: () => <Crosshair className="h-4 w-4" />,
    Skull: () => <Skull className="h-4 w-4" />,
    Heart: () => <Heart className="h-4 w-4" />,
    Diamond: () => <Diamond className="h-4 w-4" />,
    Flame: () => <Flame className="h-4 w-4" />,
    Rocket: () => <Rocket className="h-4 w-4" />,
  };

  const IconComponent =
    iconMap[iconName] || (() => <User className="h-4 w-4" />);
  return <IconComponent />;
};

export default function MainTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mainTab, setMainTab] = useState("keys");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [newProfile, setNewProfile] = useState({ name: "", icon: "User" });
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [copyrightDialogOpen, setCopyrightDialogOpen] = useState(false);

  const [keys, setKeys] = useState<KeyData[]>([]);
  const [armors, setArmors] = useState<ArmorData[]>([]);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string>("");

  // Set mounted to true after component mounts to handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load profiles and current profile from localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem("arena-breakout-profiles");
    const savedCurrentProfileId = localStorage.getItem(
      "arena-breakout-current-profile",
    );

    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles);
      setProfiles(parsedProfiles);

      if (
        savedCurrentProfileId &&
        parsedProfiles.find((p: Profile) => p.id === savedCurrentProfileId)
      ) {
        setCurrentProfileId(savedCurrentProfileId);
        const currentProfile = parsedProfiles.find(
          (p: Profile) => p.id === savedCurrentProfileId,
        );
        if (currentProfile) {
          setKeys(currentProfile.keys || []);
          setArmors(currentProfile.armors || []);
        }
      } else if (parsedProfiles.length > 0) {
        setCurrentProfileId(parsedProfiles[0].id);
        setKeys(parsedProfiles[0].keys || []);
        setArmors(parsedProfiles[0].armors || []);
      }
    } else {
      // Create default profile
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
      };
      setProfiles([defaultProfile]);
      setCurrentProfileId(defaultProfile.id);
      setKeys(defaultProfile.keys);
      setArmors(defaultProfile.armors);
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem("arena-breakout-profiles", JSON.stringify(profiles));
    }
  }, [profiles]);

  // Save current profile ID
  useEffect(() => {
    if (currentProfileId) {
      localStorage.setItem("arena-breakout-current-profile", currentProfileId);
    }
  }, [currentProfileId]);

  // Update current profile's keys and armors when they change
  useEffect(() => {
    if (currentProfileId && profiles.length > 0) {
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === currentProfileId
            ? { ...profile, keys: keys, armors: armors }
            : profile,
        ),
      );
    }
  }, [keys, armors, currentProfileId]);

  const getCurrentProfile = () => {
    return profiles.find((p) => p.id === currentProfileId);
  };

  const switchProfile = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      setCurrentProfileId(profileId);
      setKeys(profile.keys || []);
      setArmors(profile.armors || []);
    }
  };

  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return; // Don't delete the last profile

    const newProfiles = profiles.filter((p) => p.id !== profileId);
    setProfiles(newProfiles);

    if (currentProfileId === profileId) {
      const newCurrentProfile = newProfiles[0];
      setCurrentProfileId(newCurrentProfile.id);
      setKeys(newCurrentProfile.keys || []);
      setArmors(newCurrentProfile.armors || []);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Dashboard keys={keys} />;
      case "list":
        return <KeyTracker keys={keys} setKeys={setKeys} />;
      case "analytics":
        return <Analytics keys={keys} />;
      case "settings":
        return (
          <SettingsPage
            onClearData={() => {
              // Clear all data
              localStorage.removeItem("arena-breakout-profiles");
              localStorage.removeItem("arena-breakout-current-profile");

              // Reset state to default
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
              };

              setProfiles([defaultProfile]);
              setCurrentProfileId(defaultProfile.id);
              setKeys(defaultProfile.keys);
              setArmors(defaultProfile.armors);
            }}
          />
        );
      case "support":
        return <SupportPage />;
      case "armor-overview":
        return <ArmorManager armors={armors} setArmors={setArmors} />;
      default:
        return <Dashboard keys={keys} />;
    }
  };

  const renderMainContent = () => {
    return renderContent();
  };

  return (
    <MobileRestriction>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <Sidebar collapsible="icon">
              <SidebarHeader>
                <SidebarHeaderContent />
              </SidebarHeader>
              <SidebarContent>
                {/* Main Tab Selection */}
                <SidebarGroup>
                  <SidebarGroupLabel>MODE</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {mainTabs.map((tab) => (
                        <SidebarMenuItem key={tab.id}>
                          <SidebarMenuButton
                            isActive={mainTab === tab.id}
                            onClick={() => {
                              setMainTab(tab.id);
                              // Set default sub-tab based on main tab
                              if (tab.id === "keys") {
                                setActiveTab("overview");
                              } else if (tab.id === "armor") {
                                setActiveTab("armor-overview");
                              }
                            }}
                            className={
                              mainTab === tab.id
                                ? "bg-primary/5"
                                : ""
                            }
                            tooltip={tab.label}
                          >
                            <tab.icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                {/* Sub Navigation - Key Tracker */}
                {mainTab === "keys" && (
                  <SidebarGroup>
                    <SidebarGroupLabel>KEY TRACKER</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {keySidebarItems.map((item) => (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              isActive={activeTab === item.id}
                              onClick={() => setActiveTab(item.id)}
                              className={
                                activeTab === item.id
                                  ? "bg-primary/5"
                                  : ""
                              }
                              tooltip={item.label}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {/* Sub Navigation - Armor */}
                {mainTab === "armor" && (
                  <SidebarGroup>
                    <SidebarGroupLabel>ARMOR</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {armorSidebarItems.map((item) => (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              isActive={activeTab === item.id}
                              onClick={() => setActiveTab(item.id)}
                              className={
                                activeTab === item.id
                                  ? "bg-primary/5"
                                  : ""
                              }
                              tooltip={item.label}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}
              </SidebarContent>
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    {!mounted ? (
                      // SSR placeholder → no mismatch
                      <SidebarMenuButton tooltip="Toggle Theme" disabled>
                        <span className="h-4 w-4" />
                        <span className="ml-2">Theme</span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        tooltip="Toggle Theme"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                        <span className="ml-2">Theme</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("settings")}
                      tooltip="Settings"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="ml-2">Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("support")}
                      tooltip="Support"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="ml-2">Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setProfileDialogOpen(true)}
                      tooltip={getCurrentProfile()?.name || "No Profile"}
                    >
                      <div className="flex items-center justify-center p-1 bg-primary/10 rounded w-6 h-6">
                        {getCurrentProfile() &&
                          getIconComponent(getCurrentProfile()!.icon)}
                      </div>
                      <span className="ml-2 truncate">
                        {getCurrentProfile()?.name || "No Profile"}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-4 lg:p-6">
                <div className="bg-background rounded-lg border p-6">
                  {renderMainContent()}
                </div>
              </div>
            </main>
          </div>

          {/* Profile Selection Dialog */}
          <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Profiles</DialogTitle>
                <DialogDescription>
                  Select or manage your profiles
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Your Profiles</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNewProfile({ name: "", icon: "User" });
                        setCreateProfileDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Profile
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group ${
                          profile.id === currentProfileId
                            ? "bg-primary/5"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => switchProfile(profile.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-primary/10 rounded">
                            {getIconComponent(profile.icon)}
                          </div>
                          <span className="font-medium">{profile.name}</span>
                        </div>
                        {profile.id !== currentProfileId && (
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProfile(profile);
                                setNewProfile({
                                  name: profile.name,
                                  icon: profile.icon,
                                });
                                setCreateProfileDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            {profiles.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProfile(profile.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create/Edit Profile Dialog */}
          <Dialog
            open={createProfileDialogOpen}
            onOpenChange={(open) => {
              setCreateProfileDialogOpen(open);
              if (!open) {
                setEditingProfile(null);
                setNewProfile({ name: "", icon: "User" });
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProfile ? "Edit Profile" : "Create New Profile"}
                </DialogTitle>
                <DialogDescription>
                  {editingProfile
                    ? "Edit your profile details"
                    : "Create a new profile for tracking different key sets"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="profile-name">Profile Name</Label>
                  <Input
                    id="profile-name"
                    value={newProfile.name}
                    onChange={(e) =>
                      setNewProfile({ ...newProfile, name: e.target.value })
                    }
                    placeholder="e.g., Main Account, Alt Account"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profile-icon">Profile Icon</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {PROFILE_ICONS.map((icon) => (
                      <Button
                        key={icon}
                        variant={newProfile.icon === icon ? "default" : "outline"}
                        className="h-12 flex flex-col items-center justify-center gap-1"
                        onClick={() => setNewProfile({ ...newProfile, icon })}
                      >
                        {getIconComponent(icon)}
                        <span className="text-xs">{icon}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    if (editingProfile) {
                      // Update existing profile
                      setProfiles(
                        profiles.map((profile) =>
                          profile.id === editingProfile.id
                            ? {
                                ...profile,
                                name: newProfile.name,
                                icon: newProfile.icon,
                              }
                            : profile,
                        ),
                      );
                    } else {
                      // Create new profile
                      const profile: Profile = {
                        id: Date.now().toString(),
                        name: newProfile.name,
                        icon: newProfile.icon,
                        createdAt: new Date().toISOString(),
                        keys: [],
                        armors: [],
                      };
                      setProfiles([...profiles, profile]);
                    }
                    setCreateProfileDialogOpen(false);
                    setEditingProfile(null);
                    setNewProfile({ name: "", icon: "User" });
                  }}
                  disabled={!newProfile.name.trim()}
                >
                  {editingProfile ? "Save Changes" : "Create Profile"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarProvider>
      </TooltipProvider>
    </MobileRestriction>
  );
}
