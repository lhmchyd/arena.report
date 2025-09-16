import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Mail, Github, Twitter, Link, QrCode, Heart } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { UpdateCarousel } from "@/components/update-carousel"

export const SupportPage = () => {
  const [copiedUrl, setCopiedUrl] = useState(false)

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText("https://arenareport.vercel.app")
    setCopiedUrl(true)
    toast("URL copied to clipboard")
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <div className="space-y-1.5">
      {/* Update Carousel - Moved to the top */}
      <UpdateCarousel 
        updates={[
          {
            id: "1",
            title: "Key Tracker Improvements",
            date: "Latest Update",
            description: "Comprehensive bug fixes and feature additions for the Key Tracker:",
            features: [
              "Bug Fixed on Key Tracker - Run History Duplicated entry when user try to remove one of the entry and then make new entry by pressing Run Button",
              "Bug Fixed on Key Tracker - Run History key uses didn't get updated when user deleted the run on the entry",
              "Bug Fixed on Key Tracker - Run History Number on run aren't updated when user deleted an entry which make them stuck on their current number instead of get updated immediately",
              "Feature on Key Tracker - Add Sort on Run History for Run Number and Profit",
              "Remove Button called Apply Repair on Repair Armor Calculator Dialog",
              "Feature on Key Tracker - Run History Add Key Name on subtitle to be able tell which key are screenshooted without changing the layout",
              "On Copy URL change from arena.report.vercel to arenareport.vercel.app",
              "Remove Scrollbar Visual on Cookie, Privacy, Copyright but keep the scrollable feature, and also remove Close Button on bottom",
              "Change KeyRound on sidebar to List icon"
            ],
            version: "1.1.0"
          },
          {
            id: "2",
            title: "Full Version Release",
            date: "Initial Release",
            description: "Initial full version release of the application:",
            features: [
              "Full Version Released With Some Bugs Obviously 🎊🎊"
            ],
            version: "1.0.0"
          }
        ]} 
      />
      
      {/* Separator below carousel */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <Separator className="my-2" />
        </div>
      </div>
      
      {/* Content below separator - fits to screen height */}
      <div className="flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {/* Large Background Card - Full width with constrained content */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <Card className="bg-background border border-input shadow-lg rounded-2xl overflow-hidden">
              <div className="h-24 w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl flex items-center justify-center">
                <Heart className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
            </Card>
          </div>
        </div>
      
      {/* Compact centered wrapper with capsule-like cards */}
      <div className="flex justify-center">
        <div className="flex gap-3 w-full max-w-3xl">
          {/* Left Card - Donation Options (70% width) */}
          <div className="flex-[7] flex flex-col">
            <div className="flex-1 min-h-2"></div>
            <Card className="bg-background border border-input shadow-lg h-full rounded-2xl">
              <CardContent className="p-3 h-full flex flex-col gap-2">
                {/* Two Purple Cards side by side in 1x2 grid - now clickable */}
                <div className="grid grid-cols-2 gap-2 flex-grow">
                  <Card 
                    className="bg-muted flex items-center p-3 rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:bg-muted-foreground/20"
                    onClick={() => window.open("https://tako.id/woeham", "_blank")}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">Tako</span>
                      <span className="text-xs text-muted-foreground">via tako.id</span>
                    </div>
                  </Card>
                  <Card 
                    className="bg-muted flex items-center p-3 rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:bg-muted-foreground/20"
                    onClick={() => window.open("https://ko-fi.com", "_blank")}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">Ko-fi</span>
                      <span className="text-xs text-muted-foreground">via ko-fi.com</span>
                    </div>
                  </Card>
                </div>
                
                {/* Five Blue Cards below purple cards - Fixed Amounts */}
                <div className="grid grid-cols-5 gap-1.5">
                  <Button 
                    className="h-10 bg-muted text-foreground hover:bg-muted-foreground/20 rounded-md shadow transition-all text-xs"
                    onClick={() => window.open("https://example.com/donate/5", "_blank")}
                  >
                    $5
                  </Button>
                  <Button 
                    className="h-10 bg-muted text-foreground hover:bg-muted-foreground/20 rounded-md shadow transition-all text-xs"
                    onClick={() => window.open("https://example.com/donate/10", "_blank")}
                  >
                    $10
                  </Button>
                  <Button 
                    className="h-10 bg-muted text-foreground hover:bg-muted-foreground/20 rounded-md shadow transition-all text-xs"
                    onClick={() => window.open("https://example.com/donate/30", "_blank")}
                  >
                    $30
                  </Button>
                  <Button 
                    className="h-10 bg-muted text-foreground hover:bg-muted-foreground/20 rounded-md shadow transition-all text-xs"
                    onClick={() => window.open("https://example.com/donate/50", "_blank")}
                  >
                    $50
                  </Button>
                  <Button 
                    className="h-10 bg-muted text-foreground hover:bg-muted-foreground/20 rounded-md shadow transition-all text-xs"
                    onClick={() => window.open("https://example.com/donate/100", "_blank")}
                  >
                    $100
                  </Button>
                </div>
                
                {/* Custom Amount - Directly as input with button */}
                <div className="flex gap-1.5">
                  <Input 
                    type="number" 
                    placeholder="Custom" 
                    className="flex-1 h-10 bg-muted border-input text-foreground rounded-md text-xs px-2 shadow-inner"
                  />
                  <Button 
                    className="h-10 bg-muted text-foreground hover:bg-muted-foreground/20 rounded-md shadow transition-all px-3"
                    onClick={() => {
                      const customAmount = (document.querySelector('input[type="number"]') as HTMLInputElement)?.value;
                      if (customAmount) {
                        window.open(`https://example.com/donate/${customAmount}`, "_blank");
                      }
                    }}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="flex-1 min-h-2"></div>
          </div>
          
          {/* Right Card - QR Code and Social Links (30% width) */}
          <div className="flex-[3] flex flex-col">
            <div className="flex-1 min-h-2"></div>
            <Card className="bg-background border border-input shadow-lg h-full rounded-2xl">
              <CardContent className="p-3 h-full flex flex-col gap-2">
                {/* Header text above QR code - aligned to left */}
                <div className="text-left">
                  <h3 className="text-foreground text-xs font-semibold">Share arena.report</h3>
                </div>
                
                {/* QR Code and Social Links - Bigger size to fill space */}
                <div className="flex gap-2 h-full flex-col">
                  <div className="flex gap-2 items-center">
                    {/* QR Code container - wrapped in popover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                          <div className="bg-muted w-24 h-24 flex items-center justify-center rounded">
                            <QrCode className="h-12 w-12 text-foreground" />
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border border-input rounded-lg shadow-lg">
                        <div className="p-4">
                          <div className="bg-muted w-48 h-48 md:w-64 md:h-64 flex items-center justify-center rounded">
                            <QrCode className="h-24 w-24 text-foreground" />
                        </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {/* Social Links Grid - 2x2 square icons, bigger size */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-2" style={{width: '6rem', height: '6rem'}}>
                      <Button 
                        className="bg-muted text-foreground hover:bg-muted-foreground/20 flex items-center justify-center h-full w-full rounded-sm shadow transition-all p-0"
                        onClick={() => window.open("mailto:example@email.com", "_blank")}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="bg-muted text-foreground hover:bg-muted-foreground/20 flex items-center justify-center h-full w-full rounded-sm shadow transition-all p-0"
                        onClick={() => window.open("https://github.com/lhmchyd/arena.report", "_blank")}
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="bg-muted text-foreground hover:bg-muted-foreground/20 flex items-center justify-center h-full w-full rounded-sm shadow transition-all p-0"
                        onClick={() => window.open("https://x.com/woeham", "_blank")}
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="bg-muted text-foreground hover:bg-muted-foreground/20 flex items-center justify-center h-full w-full rounded-sm shadow transition-all p-0"
                        onClick={copyUrlToClipboard}
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* arena.report text below QR code and social links - aligned to left */}
                  <div className="text-left">
                    <span className="text-muted-foreground text-[0.6rem]">arena.report</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex-1 min-h-2"></div>
          </div>
        </div>
      </div>
      
      {/* Gratitude Message Container - Same width as cards, placed below donation */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="bg-background border border-input rounded-2xl p-2 text-center">
            <p className="text-foreground text-sm">
              Your support means the world to me. All funds will be used to improve and maintain this website, 
              ensuring it remains a valuable resource for the Arena Breakout community.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}