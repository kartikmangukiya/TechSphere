import {
  ArrowRight,
  BookOpen,
  Code2,
  Layers3,
  Mail,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
const featuredPosts = [
  {
    title: "Building Modern React Applications with TypeScript",
    description:
      "Learn how to build scalable React applications using TypeScript, modern patterns, and reusable components.",
    category: "React",
    date: "Sep 24, 2026",
    readTime: "8 min read",
  },
  {
    title: "Angular 20: Understanding Signals",
    description:
      "A practical guide to signals, computed values, effects, and modern Angular development.",
    category: "Angular",
    date: "Sep 22, 2026",
    readTime: "6 min read",
  },
  {
    title: "Building APIs with Node.js and TypeScript",
    description:
      "Create maintainable backend applications using Node.js, Express, TypeScript, and MongoDB.",
    category: "Node.js",
    date: "Sep 20, 2026",
    readTime: "10 min read",
  },
];
const categories = [
  { name: "React", icon: Code2, description: "Modern frontend development" },
  {
    name: "Angular",
    icon: Layers3,
    description: "Enterprise web applications",
  },
  { name: "Node.js", icon: BookOpen, description: "Backend & API development" },
  { name: "TypeScript", icon: Code2, description: "Type-safe JavaScript" },
  { name: "AI", icon: Sparkles, description: "AI & modern technology" },
];
export const Home = () => {
  return (
    <main>
      {" "}
      {/* Hero */}{" "}
      <section className="border-b">
        {" "}
        <div className="container mx-auto px-4 py-20 md:py-28">
          {" "}
          <div className="mx-auto max-w-4xl text-center">
            {" "}
            <Badge variant="secondary" className="mb-6">
              {" "}
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Explore the world of
              technology{" "}
            </Badge>{" "}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {" "}
              Learn. Build. <span className="text-primary">Innovate.</span>{" "}
            </h1>{" "}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {" "}
              TechSphere is a developer-focused blog where you can discover
              practical insights about React, Angular, Node.js, TypeScript, AI,
              and modern web development.{" "}
            </p>{" "}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {" "}
              <Button size="lg">
                {" "}
                Explore Articles <ArrowRight className="ml-2 h-4 w-4" />{" "}
              </Button>{" "}
              <Button size="lg" variant="outline">
                {" "}
                Start Writing{" "}
              </Button>{" "}
            </div>{" "}
            {/* Stats */}{" "}
            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x">
              {" "}
              <div>
                {" "}
                <p className="text-2xl font-bold">100+</p>{" "}
                <p className="text-sm text-muted-foreground"> Articles </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-2xl font-bold">20+</p>{" "}
                <p className="text-sm text-muted-foreground"> Topics </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-2xl font-bold">10K+</p>{" "}
                <p className="text-sm text-muted-foreground"> Readers </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Featured Posts */}{" "}
      <section className="py-16 md:py-20">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <div className="mb-10 flex items-end justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm font-medium text-primary">
                {" "}
                FEATURED{" "}
              </p>{" "}
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                {" "}
                Featured Articles{" "}
              </h2>{" "}
              <p className="mt-2 text-muted-foreground">
                {" "}
                Hand-picked articles to help you grow as a developer.{" "}
              </p>{" "}
            </div>{" "}
            <Button variant="ghost" className="hidden sm:flex">
              {" "}
              View all <ArrowRight className="ml-2 h-4 w-4" />{" "}
            </Button>{" "}
          </div>{" "}
          <div className="grid gap-6 md:grid-cols-3">
            {" "}
            {featuredPosts.map((post) => (
              <Card
                key={post.title}
                className="group transition-shadow hover:shadow-md"
              >
                {" "}
                <div className="aspect-video rounded-t-xl bg-muted" />{" "}
                <CardHeader>
                  {" "}
                  <Badge className="w-fit">{post.category}</Badge>{" "}
                  <CardTitle className="mt-2 transition-colors group-hover:text-primary">
                    {" "}
                    {post.title}{" "}
                  </CardTitle>{" "}
                  <CardDescription> {post.description} </CardDescription>{" "}
                </CardHeader>{" "}
                <CardContent>
                  {" "}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {" "}
                    <span>{post.date}</span> <span>{post.readTime}</span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Categories */}{" "}
      <section className="border-y bg-muted/30 py-16 md:py-20">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            {" "}
            <p className="text-sm font-medium text-primary"> EXPLORE </p>{" "}
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {" "}
              Explore by Category{" "}
            </h2>{" "}
            <p className="mt-2 text-muted-foreground">
              {" "}
              Find content based on the technologies you're learning.{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {" "}
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.name}
                  className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {" "}
                  <CardContent className="p-6">
                    {" "}
                    <Icon className="mb-4 h-7 w-7 text-primary" />{" "}
                    <h3 className="font-semibold"> {category.name} </h3>{" "}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {" "}
                      {category.description}{" "}
                    </p>{" "}
                  </CardContent>{" "}
                </Card>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Latest Articles */}{" "}
      <section className="py-16 md:py-20">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <div className="mb-10">
            {" "}
            <p className="text-sm font-medium text-primary"> LATEST </p>{" "}
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {" "}
              Latest Articles{" "}
            </h2>{" "}
            <p className="mt-2 text-muted-foreground">
              {" "}
              Fresh ideas, tutorials, and insights from the TechSphere
              community.{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {" "}
            {featuredPosts.map((post, index) => (
              <Card key={`${post.title}-${index}`}>
                {" "}
                <div className="aspect-video rounded-t-xl bg-muted" />{" "}
                <CardHeader>
                  {" "}
                  <Badge variant="outline" className="w-fit">
                    {" "}
                    {post.category}{" "}
                  </Badge>{" "}
                  <CardTitle className="mt-2"> {post.title} </CardTitle>{" "}
                  <CardDescription> {post.description} </CardDescription>{" "}
                </CardHeader>{" "}
                <CardContent>
                  {" "}
                  <Button variant="link" className="px-0">
                    {" "}
                    Read article <ArrowRight className="ml-2 h-4 w-4" />{" "}
                  </Button>{" "}
                </CardContent>{" "}
              </Card>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Newsletter */}{" "}
      <section className="border-t py-16">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <Card className="mx-auto max-w-4xl">
            {" "}
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
              {" "}
              <div className="rounded-full bg-primary/10 p-3">
                {" "}
                <Mail className="h-6 w-6 text-primary" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h2 className="text-2xl font-bold"> Stay in the loop </h2>{" "}
                <p className="mt-2 text-muted-foreground">
                  {" "}
                  Get the latest developer articles and technology insights
                  directly in your inbox.{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                {" "}
                <Input type="email" placeholder="Enter your email" />{" "}
                <Button> Subscribe </Button>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
      </section>{" "}
    </main>
  );
};
