import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

export const SettingsPage = ({ onClearData }: { onClearData: () => void }) => {
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false)
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)
  const [copyrightDialogOpen, setCopyrightDialogOpen] = useState(false)
  const [isClearDataDialogOpen, setIsClearDataDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Data Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Clear All Data</p>
                <p className="text-sm text-muted-foreground">Remove all keys, armors, and profiles</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setIsClearDataDialogOpen(true)}
              >
                Clear Data
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Legal Information</h3>
          <div className="space-y-3">
            <div 
              className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() => setCookieDialogOpen(true)}
            >
              <h4 className="font-medium">Cookie Policy</h4>
              <p className="text-sm text-muted-foreground">
                Learn how we use cookies to enhance your experience
              </p>
            </div>
            <div 
              className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() => setPrivacyDialogOpen(true)}
            >
              <h4 className="font-medium">Privacy Policy</h4>
              <p className="text-sm text-muted-foreground">
                Understand how we protect your privacy
              </p>
            </div>
            <div 
              className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() => setCopyrightDialogOpen(true)}
            >
              <h4 className="font-medium">Copyright Information</h4>
              <p className="text-sm text-muted-foreground">
                View our copyright and intellectual property information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Policy Dialog */}
      <Dialog open={cookieDialogOpen} onOpenChange={setCookieDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cookie Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">What Are Cookies</h3>
              <p className="text-muted-foreground">
                Cookies are small text files that are stored on your device when you visit websites. 
                They are widely used to make websites work more efficiently and to provide information 
                to the owners of the site.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">How We Use Cookies</h3>
              <p className="text-muted-foreground">
                Our application uses cookies solely for functionality purposes. We do not use cookies 
                for tracking or advertising purposes. The cookies we use help with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Maintaining your session and preferences</li>
                <li>Remembering your theme preference (light/dark mode)</li>
                <li>Improving your user experience</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Types of Cookies We Use</h3>
              <div className="space-y-2 mt-2">
                <div>
                  <h4 className="font-medium">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    These cookies are necessary for the website to function and cannot be switched off. 
                    They are usually only set in response to actions made by you which amount to a 
                    request for services, such as setting your privacy preferences or filling in forms.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Functional Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    These cookies enable the website to provide enhanced functionality and personalization. 
                    They may be set by us or by third party providers whose services we have added to our pages.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Managing Cookies</h3>
              <p className="text-muted-foreground">
                You can control and/or delete cookies as you wish. You can delete all cookies that are 
                already on your device and you can set most browsers to prevent them from being placed. 
                However, if you do this, you may have to manually adjust some preferences every time you 
                visit a site and some services may not function properly.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Changes to This Cookie Policy</h3>
              <p className="text-muted-foreground">
                We may update our Cookie Policy from time to time. We will notify you of any changes 
                by posting the new Cookie Policy on this page and updating the "Last Updated" date.
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setCookieDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Information We Collect</h3>
              <p className="text-muted-foreground">
                We respect your privacy and are committed to protecting it. This Privacy Policy 
                explains our practices regarding the collection, use, and disclosure of information 
                when you use our service.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Important:</strong> Our application operates entirely client-side. 
                This means all data is stored locally on your device and is never transmitted 
                to any external servers.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Data Storage and Security</h3>
              <p className="text-muted-foreground">
                All information you enter into our application (keys, armor data, profiles, etc.) 
                is stored locally in your browser's storage. We do not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Collect any personal information</li>
                <li>Transmit your data to external servers</li>
                <li>Use analytics or tracking services that identify individual users</li>
                <li>Sell or share your data with third parties</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Types of Data We Store Locally</h3>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Key tracking information (names, locations, costs, run history)</li>
                <li>Armor durability data and repair history</li>
                <li>Profile information (names, preferences)</li>
                <li>Application preferences (theme settings)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Data Retention and Deletion</h3>
              <p className="text-muted-foreground">
                Your data remains on your device until you choose to delete it. You can:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Clear all data using the "Clear All Data" button in Settings</li>
                <li>Manually delete individual items through the application interface</li>
                <li>Clear browser data to remove all locally stored information</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Third-Party Services</h3>
              <p className="text-muted-foreground">
                Our application uses the following third-party services that may collect information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li><strong>Vercel Analytics:</strong> Used for anonymous usage statistics to improve our service</li>
                <li><strong>Google Fonts:</strong> Used for typography (fonts are loaded from Google's CDN)</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                These services are configured to minimize data collection and do not track individual users.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Your Rights</h3>
              <p className="text-muted-foreground">
                Since we don't collect personal data, there's no personal information to access, 
                modify, or delete. However, you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Use our service without providing any personal information</li>
                <li>Delete all your data at any time using the clear data function</li>
                <li>Opt out of any non-essential data collection by adjusting your browser settings</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Children's Privacy</h3>
              <p className="text-muted-foreground">
                Our service does not address anyone under the age of 13. We do not knowingly 
                collect personal information from children under 13. If you are a parent or 
                guardian and you are aware that your child has provided us with personal data, 
                please contact us so that we can take necessary actions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Changes to This Privacy Policy</h3>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the 
                "Last Updated" date.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us through 
                our support channels.
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setPrivacyDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copyright Dialog */}
      <Dialog open={copyrightDialogOpen} onOpenChange={setCopyrightDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Copyright Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Copyright Notice</h3>
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} arena.report. All rights reserved.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Ownership</h3>
              <p className="text-muted-foreground">
                The arena.report application, including all source code, graphics, 
                interfaces, and documentation, is the property of its creators and is protected 
                by international copyright laws.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">License</h3>
              <p className="text-muted-foreground">
                This application is provided as open-source software under the MIT License. 
                You are free to use, copy, modify, merge, publish, distribute, sublicense, 
                and/or sell copies of the software, subject to the following conditions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software</li>
                <li>The software is provided "as is", without warranty of any kind</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Trademarks</h3>
              <p className="text-muted-foreground">
                All product names, logos, and brands are property of their respective owners. 
                The use of these names, logos, and brands does not imply endorsement.
              </p>
              <p className="text-muted-foreground mt-2">
                "Arena Breakout" and related trademarks are the property of Keen Games and 
                are used for identification purposes only. This application is not affiliated 
                with, endorsed by, or sponsored by Keen Games.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Third-Party Components</h3>
              <p className="text-muted-foreground">
                This application incorporates the following third-party components:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li><strong>Next.js:</strong> Copyright © 2024 Vercel, Inc.</li>
                <li><strong>React:</strong> Copyright © 2013-present, Facebook, Inc.</li>
                <li><strong>shadcn/ui:</strong> Copyright © 2023 shadcn</li>
                <li><strong>Lucide Icons:</strong> Licensed under ISC License</li>
                <li><strong>Tailwind CSS:</strong> Copyright © 2024 Tailwind Labs</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Each component is used under its respective license terms.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Attribution</h3>
              <p className="text-muted-foreground">
                This application was built using v0.dev and QWEN3.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Disclaimer</h3>
              <p className="text-muted-foreground">
                This application is an unofficial fan project created for educational and 
                personal use. It is not affiliated with MoreFun Studio or the Arena Breakout Infinte
                development team. All game-related information is publicly available and 
                used for informational purposes only.
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setCopyrightDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Clear Data Confirmation Dialog */}
      <AlertDialog open={isClearDataDialogOpen} onOpenChange={setIsClearDataDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to clear all data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your keys, armors, profiles, and run history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onClearData()
                setIsClearDataDialogOpen(false)
              }} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}