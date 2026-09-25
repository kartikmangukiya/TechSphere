import {
  ArrowRight,
  Binary,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Package,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { NavLink } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Programming Languages",
    slug: "programming-languages",
    description:
      "Learn programming languages, syntax, concepts, best practices, and modern development techniques.",
    icon: Code2,
    articleCount: 24,
  },
  {
    id: 2,
    name: "Database",
    slug: "database",
    description:
      "Explore SQL and NoSQL databases, data modeling, queries, optimization, and database management.",
    icon: Database,
    articleCount: 18,
  },
  {
    id: 3,
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    description:
      "Discover artificial intelligence, machine learning, generative AI, LLMs, and AI-powered applications.",
    icon: BrainCircuit,
    articleCount: 16,
  },
  {
    id: 4,
    name: "DevOps & Cloud",
    slug: "devops-cloud",
    description:
      "Learn about cloud platforms, DevOps practices, CI/CD, containers, deployment, and infrastructure.",
    icon: Cloud,
    articleCount: 14,
  },
  {
    id: 5,
    name: "Tools & Productivity",
    slug: "tools-productivity",
    description:
      "Discover developer tools, workflows, automation, productivity techniques, and resources for efficient development.",
    icon: Wrench,
    articleCount: 12,
  },
  {
    id: 6,
    name: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Learn about application security, web security, authentication, encryption, vulnerabilities, and security best practices.",
    icon: ShieldCheck,
    articleCount: 10,
  },
  {
    id: 7,
    name: "Product Development",
    slug: "product-development",
    description:
      "Explore software product development, architecture, project planning, UX, testing, and building scalable products.",
    icon: Package,
    articleCount: 15,
  },
  {
    id: 8,
    name: "Data Structures & Algorithms",
    slug: "data-structures-algorithms",
    description:
      "Master data structures, algorithms, problem-solving techniques, complexity analysis, and coding interview preparation.",
    icon: Binary,
    articleCount: 20,
  },
];

export const Categories = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-medium text-primary">
            Explore TechSphere
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Explore Categories
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
            Explore technology topics, discover useful articles, and keep
            learning with TechSphere.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Card
                key={category.id}
                className="group flex h-full flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.articleCount} Articles
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="group hover:bg-primary/10 hover:text-primary"
                    
                  >
                    <NavLink
                      to={`/categories/${category.slug}`}
                      className="inline-flex items-center whitespace-nowrap"
                    >
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </NavLink>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
};
