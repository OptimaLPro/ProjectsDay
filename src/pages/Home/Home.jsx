import { useState } from "react"
import { ChevronRight, ExternalLink, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample project data
const projects = [
  {
    id: 1,
    name: "WavesSaves",
    image: "/placeholder.svg?height=400&width=600",
    category: "Environment",
    description: "Ocean conservation project tracking wave patterns",
    link: "#",
  },
  {
    id: 2,
    name: "BookShare",
    image: "/placeholder.svg?height=400&width=600",
    category: "Education",
    description: "Community book sharing platform",
    link: "#",
  },
  {
    id: 3,
    name: "Menahem",
    image: "/placeholder.svg?height=400&width=600",
    category: "Pets",
    description: "Organize your pets with the push of a button",
    link: "#",
  },
  {
    id: 4,
    name: "FinTrack",
    image: "/placeholder.svg?height=400&width=600",
    category: "Finance",
    description: "Personal finance tracking application",
    link: "#",
  },
  {
    id: 5,
    name: "EcoHome",
    image: "/placeholder.svg?height=400&width=600",
    category: "Environment",
    description: "Smart home energy conservation system",
    link: "#",
  },
  {
    id: 6,
    name: "MediSync",
    image: "/placeholder.svg?height=400&width=600",
    category: "Health",
    description: "Medical appointment scheduling platform",
    link: "#",
  },
]

// Categories for filtering
const categories = ["All", "Environment", "Education", "Pets", "Finance", "Health"]

export default function ProjectShowcase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  // Filter projects based on search query and active category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || project.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Project Showcase</h1>
              <p className="text-primary-foreground/80 mt-1">Discover amazing student projects</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary">Home</Button>
              <Button variant="secondary">Instructors</Button>
              <Button variant="secondary">Internships</Button>
              <Button variant="secondary" className="font-bold">
                Winners Projects
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="All" className="w-full md:w-2/3" onValueChange={setActiveCategory}>
            <TabsList className="w-full grid grid-cols-3 md:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-sm">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-medium text-muted-foreground">No projects found</h3>
            <p className="mt-2">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <a href={project.link} key={project.id} className="group">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                  <CardContent className="flex-grow pt-4">
                    <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
                      {project.category}
                    </div>
                    <h3 className="font-bold text-xl">{project.name}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      View Project <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

