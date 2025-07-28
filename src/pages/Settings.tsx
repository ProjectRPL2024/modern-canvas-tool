import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, User, Lock, Palette } from "lucide-react"

const Settings = () => {
  const [selectedWallpaper, setSelectedWallpaper] = useState("wallpaper-a")

  const wallpapers = [
    { id: "wallpaper-a", name: "Wallpaper A", preview: "/api/placeholder/300/200" },
    { id: "wallpaper-b", name: "Wallpaper B", preview: "/api/placeholder/300/200" },
    { id: "wallpaper-c", name: "Wallpaper C", preview: "/api/placeholder/300/200" },
    { id: "custom", name: "Custom", preview: "/api/placeholder/300/200" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Kelola pengaturan akun dan tampilan sistem</p>
      </div>

      <Card className="border-0 shadow-soft">
        <CardContent className="p-0">
          <Tabs defaultValue="password" className="w-full">
            <div className="border-b bg-muted/30">
              <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="password" 
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-4"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  UBAH PASSWORD
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-4"
                >
                  <User className="w-4 h-4 mr-2" />
                  PROFILE
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance"
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-4"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  TAMPILAN
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="password" className="p-6 space-y-6">
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="old-password">Password Lama</Label>
                  <Input 
                    id="old-password" 
                    type="password" 
                    placeholder="Masukkan password lama"
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Masukkan password baru"
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                  <p className="text-sm text-muted-foreground">(ketik ulang)</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  SIMPAN
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="p-6 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-primary/20">
                    <AvatarImage src="/api/placeholder/128/128" alt="Profile" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">AN</AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Upload Foto
                  </Button>
                </div>
                <div className="w-full max-w-md space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input 
                      id="name" 
                      defaultValue="Achyar Nur Sahid"
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue="achyar@smkkrian1.sch.id"
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      defaultValue="MODUL PKL/PRAKERIN"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Update Profile
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="p-6 space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="slide-menu" className="rounded border-border" defaultChecked />
                    <Label htmlFor="slide-menu">Tampilkan Awal Menu Samping (SlideMenu) Tertutup</Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Pilih Wallpaper</h3>
                  <RadioGroup value={selectedWallpaper} onValueChange={setSelectedWallpaper}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wallpapers.map((wallpaper) => (
                        <div key={wallpaper.id} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={wallpaper.id} id={wallpaper.id} />
                            <Label htmlFor={wallpaper.id} className="font-medium">
                              {wallpaper.name}
                            </Label>
                          </div>
                          <div className="border-2 border-border rounded-lg overflow-hidden hover:border-primary transition-colors">
                            <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">{wallpaper.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Simpan Pengaturan
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings