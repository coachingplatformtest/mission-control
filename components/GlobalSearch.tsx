"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Calendar, Brain, AlertCircle } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { useConvexAvailable } from "@/app/ConvexClientProvider";

const searchTypes = [
  { value: "all", label: "All", icon: Search },
  { value: "memory", label: "Memory", icon: Brain },
  { value: "document", label: "Documents", icon: FileText },
  { value: "task", label: "Tasks", icon: Calendar },
];

function GlobalSearchNoConvex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
        <p className="text-muted-foreground mt-2">
          Search across memory files, documents, and scheduled tasks
        </p>
      </div>

      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardContent className="flex items-center gap-4 py-6">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <div>
            <h3 className="font-semibold">Convex Not Configured</h3>
            <p className="text-sm text-muted-foreground">
              Set NEXT_PUBLIC_CONVEX_URL to enable search functionality.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Search Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What you can search:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>
                  <strong>Memory files:</strong> AI assistant's persistent memory and learnings
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>
                  <strong>Documents:</strong> Project documentation and notes
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span>
                  <strong>Tasks:</strong> Scheduled cron jobs and automation
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GlobalSearchWithConvex() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const results = useQuery(
    api.search.searchAll,
    searchQuery
      ? {
          query: searchQuery,
          type: selectedType === "all" ? undefined : selectedType,
          limit: 30,
        }
      : "skip"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "memory":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "document":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "task":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = searchTypes.find((t) => t.value === type);
    return typeConfig?.icon || Search;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
        <p className="text-muted-foreground mt-2">
          Search across memory files, documents, and scheduled tasks
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    type="button"
                    variant={selectedType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.value)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>
              {results === undefined
                ? "Searching..."
                : `${results.length} Results for "${searchQuery}"`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results === undefined ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search query or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result: any) => {
                  const Icon = getTypeIcon(result.type);
                  return (
                    <div
                      key={result._id}
                      className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold group-hover:text-primary transition-colors">
                              {result.title}
                            </h4>
                            <Badge variant="outline" className={getTypeColor(result.type)}>
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.snippet}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="font-mono">{result.filePath}</span>
                            <span>Updated {formatTimestamp(result.lastUpdated)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      {!searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What you can search:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span>
                    <strong>Memory files:</strong> AI assistant's persistent memory and learnings
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>
                    <strong>Documents:</strong> Project documentation and notes
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Tasks:</strong> Scheduled cron jobs and automation
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tips:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Use specific keywords for better results</li>
                <li>Filter by type to narrow down your search</li>
                <li>Search results show relevant snippets with context</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function GlobalSearch() {
  const convexAvailable = useConvexAvailable();
  
  if (!convexAvailable) {
    return <GlobalSearchNoConvex />;
  }

  return <GlobalSearchWithConvex />;
}
