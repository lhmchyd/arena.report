"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  Star, 
  GitFork, 
  Bug, 
  Coffee, 
  Share2, 
  Github,
  ExternalLink,
  Users,
  Trophy,
  Gift
} from "lucide-react"

export default function SupportPage() {
  const handleStarRepo = () => {
    window.open('https://github.com/your-username/arena.report', '_blank')
  }

  const handleForkRepo = () => {
    window.open('https://github.com/your-username/arena.report/fork', '_blank')
  }

  const handleReportIssue = () => {
    window.open('https://github.com/your-username/arena.report/issues', '_blank')
  }

  const handleShareProject = () => {
    if (navigator.share) {
      navigator.share({
        title: 'arena.report - Arena Breakout Tracker',
        text: 'Check out this awesome tracker for Arena Breakout Infinite!',
        url: 'https://arena.report',
      })
    } else {
      navigator.clipboard.writeText('https://arena.report')
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Support arena.report</h2>
        <p className="text-muted-foreground">
          Help us improve and maintain this project for the Arena Breakout community
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Star the Repository */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Star the Repository
            </CardTitle>
            <CardDescription>
              Show your appreciation by starring the project on GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStarRepo} className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Star on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Starring helps others discover the project and shows your support!
            </p>
          </CardContent>
        </Card>

        {/* Fork the Repository */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitFork className="h-5 w-5" />
              Fork the Repository
            </CardTitle>
            <CardDescription>
              Contribute to the project by forking it and submitting pull requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleForkRepo} variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Fork on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Help improve the project by contributing code or documentation.
            </p>
          </CardContent>
        </Card>

        {/* Report Issues */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Report Issues
            </CardTitle>
            <CardDescription>
              Help us identify and fix bugs or suggest new features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleReportIssue} variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Report on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Your feedback helps make the project better for everyone.
            </p>
          </CardContent>
        </Card>

        {/* Share with Friends */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share with Friends
            </CardTitle>
            <CardDescription>
              Spread the word about arena.report to other players
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleShareProject} variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share Project
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Help other Arena Breakout players discover this useful tool.
            </p>
          </CardContent>
        </Card>

        {/* Community Support */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Support
            </CardTitle>
            <CardDescription>
              Join our community and help others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                <Users className="mr-2 h-4 w-4" />
                Discord Community
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Trophy className="mr-2 h-4 w-4" />
                Reddit Community
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Connect with other users and share tips and strategies.
            </p>
          </CardContent>
        </Card>

        {/* Donate/Sponsor */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Donate & Sponsor
            </CardTitle>
            <CardDescription>
              Support the project financially to help with maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                <Coffee className="mr-2 h-4 w-4" />
                Buy Me a Coffee
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Gift className="mr-2 h-4 w-4" />
                GitHub Sponsors
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Financial support helps cover hosting costs and development time.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-2">Why Your Support Matters</h3>
        <p className="text-muted-foreground">
          arena.report is a passion project built by fans of Arena Breakout Infinite for the community. 
          Your support helps ensure the project continues to grow and improve. Whether it's starring 
          the repository, reporting issues, or sharing with friends, every contribution makes a difference.
        </p>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Heart className="h-4 w-4 mr-2 text-red-500" />
          <span>Thank you for being part of our community!</span>
        </div>
      </div>
    </div>
  )
}