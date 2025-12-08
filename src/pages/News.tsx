import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, User, ArrowRight, Megaphone, Trophy, Users, BookOpen } from "lucide-react";
import { getLocalData, initialNews, NewsItem } from "@/lib/mockData";

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = getLocalData<NewsItem[]>("news", initialNews);
      setNewsItems(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'achievement': return Trophy;
      case 'scholarship': return BookOpen;
      case 'announcement': return Megaphone;
      case 'program': return Users;
      case 'community service': return Users;
      case 'workshop': return BookOpen;
      default: return Megaphone;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'achievement': return 'bg-accent text-accent-foreground';
      case 'scholarship': return 'bg-secondary';
      case 'announcement': return 'bg-primary';
      case 'program': return 'bg-secondary';
      case 'community service': return 'bg-destructive';
      case 'workshop': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const featuredNews = newsItems.filter(item => item.featured);
  const regularNews = newsItems.filter(item => !item.featured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="bg-gradient-hero">
        <div className="container py-20 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">News & Updates</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and exciting developments
            from the EKUSA community.
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="container">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Featured <span className="bg-gradient-hero bg-clip-text text-transparent">News</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredNews.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              return (
                <Card key={item.id} className="shadow-hover overflow-hidden group">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-3">
                      <CategoryIcon className="h-4 w-4" />
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{item.author}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">{item.excerpt}</CardDescription>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="group/btn">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center space-x-2 mb-3">
                            <CategoryIcon className="h-4 w-4" />
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                          </div>
                          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{item.author}</span>
                            </div>
                          </div>
                        </DialogHeader>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap">{item.content}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Regular News */}
      <section className="container">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {regularNews.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category);
            return (
              <Card key={item.id} className="shadow-card hover:shadow-hover transition-all duration-300 group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-3">
                    <CategoryIcon className="h-4 w-4" />
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{item.author}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm line-clamp-3">{item.excerpt}</CardDescription>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full group/btn">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <div className="flex items-center space-x-2 mb-3">
                          <CategoryIcon className="h-4 w-4" />
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                        </div>
                        <DialogTitle className="text-2xl">{item.title}</DialogTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{item.author}</span>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{item.content}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-hero">
        <div className="container py-16 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <Megaphone className="h-16 w-16 mx-auto text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Stay in the Loop
            </h2>
            <p className="text-xl text-white/90">
              Never miss important updates, announcements, or exciting news from EKUSA.
              Connect with us on social media or join our WhatsApp group for instant updates.
            </p>
            <Button size="lg" variant="secondary" className="shadow-hover">
              Join Our WhatsApp Group
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;