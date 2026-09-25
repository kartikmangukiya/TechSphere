import {
  ArrowRight,
  BookOpen,
  Code2,
  Lightbulb,
  Rocket,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Learn",
    description:
      "Understand modern technologies through practical and easy-to-follow articles.",
  },
  {
    icon: Code2,
    title: "Build",
    description:
      "Turn your knowledge into real-world projects and improve your development skills.",
  },
  {
    icon: Lightbulb,
    title: "Discover",
    description:
      "Explore new technologies, tools, trends, and ideas from the constantly evolving tech world.",
  },
  {
    icon: Rocket,
    title: "Grow",
    description:
      "Keep improving your technical skills and stay up to date with modern development practices.",
  },
];

export const About = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
            About TechSphere
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Learn. Build. Explore.
            <span className="block text-primary">
              Grow with Technology.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            TechSphere is a technology-focused blog created for developers,
            learners, and technology enthusiasts who want to learn, build, and
            stay updated with the modern tech world.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" >
              <NavLink
                to="/blogs"
                className="inline-flex items-center whitespace-nowrap"
              >
                Explore Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </NavLink>
            </Button>

            <Button size="lg" variant="outline" >
              <NavLink to="/categories">
                Explore Categories
              </NavLink>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            What is TechSphere?
          </h2>

          <p className="mt-6 leading-7 text-muted-foreground">
            TechSphere is a place where technology and learning come together.
            Our goal is to make software development concepts easier to
            understand through clear explanations, practical examples, and
            real-world insights.
          </p>

          <p className="mt-4 leading-7 text-muted-foreground">
            From programming languages and databases to artificial intelligence,
            cloud computing, cybersecurity, and software development,
            TechSphere brings different areas of technology together in one
            place.
          </p>
        </div>
      </section>

      {/* What We Cover */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-primary">
              OUR FOCUS
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Explore the World of Technology
            </h2>

            <p className="mt-4 text-muted-foreground">
              Learn about the technologies and concepts that are shaping modern
              software development.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>

                    <CardTitle className="pt-2">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-12">
          <Users className="mx-auto h-10 w-10 text-primary" />

          <h2 className="mt-5 text-3xl font-bold tracking-tight">
            Our Mission
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
            Our mission is to create a useful and accessible space where
            developers and technology enthusiasts can continuously learn,
            exchange ideas, and discover new possibilities in technology.
          </p>
        </div>
      </section>
    </main>
  );
};