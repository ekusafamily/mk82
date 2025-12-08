import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Heart, Mountain, BookOpen, Camera } from "lucide-react";
import { getLocalData, initialEvents, Event } from "@/lib/mockData";
import EventRegistration from "@/components/EventRegistration";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = getLocalData<Event[]>("events", initialEvents);
      // Sort by date equivalent
      const sorted = [...data].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
      setEvents(sorted);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(event => !event.is_past);
  const pastEvents = events.filter(event => event.is_past);

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meeting': return Users;
      case 'adventure': return Mountain;
      case 'workshop': return BookOpen;
      case 'charity': return Heart;
      case 'social': return Camera;
      default: return Users;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meeting':
        return 'bg-primary';
      case 'adventure':
        return 'bg-secondary';
      case 'workshop':
        return 'bg-accent text-accent-foreground';
      case 'charity':
        return 'bg-destructive';
      case 'social':
        return 'bg-primary';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="bg-gradient-hero">
        <div className="container py-20 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Events & Activities</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Join us for exciting events, meaningful activities, and unforgettable experiences that
            bring our student community together.
          </p>
        </div>
      </section>

      {/* Events Tabs */}
      <section className="container">
        <Tabs defaultValue="upcoming" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Upcoming</span>
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>Past Events</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Don't Miss <span className="bg-gradient-hero bg-clip-text text-transparent">These Events</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Mark your calendars and join us for these exciting upcoming activities!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map(event => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <Card key={event.id} className="shadow-card hover:shadow-hover transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-primary">
                            <EventIcon className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {event.title}
                            </CardTitle>
                            <Badge className={`mt-1 ${getEventTypeColor(event.type)}`}>
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base">{event.description}</CardDescription>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        {event.event_time && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{event.event_time}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.expected_attendees} expected attendees</span>
                        </div>
                      </div>

                      <EventRegistration
                        eventId={event.id}
                        eventTitle={event.title}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Our <span className="bg-gradient-hero bg-clip-text text-transparent">Recent Activities</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Take a look at some of the amazing events we've organized recently!
              </p>
            </div>

            <div className="space-y-8">
              {pastEvents.map(event => (
                <Card key={event.id} className="shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    <div className="lg:col-span-1">
                      <div className="aspect-video lg:aspect-square overflow-hidden">
                        {event.images && event.images[0] ? (
                          <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="lg:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.event_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{event.actual_attendees} attendees</span>
                            </div>
                          </div>
                          <Badge className={`${getEventTypeColor(event.type)} mb-4`}>
                            {event.type}
                          </Badge>
                        </div>
                      </div>

                      <CardDescription className="text-base mb-4">
                        {event.description}
                      </CardDescription>

                      {event.highlight && (
                        <div className="bg-accent/10 p-4 rounded-lg">
                          <p className="text-sm font-medium">
                            <strong>Highlight:</strong> {event.highlight}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-hero">
        <div className="container py-16 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Have an Event Idea?
            </h2>
            <p className="text-xl text-white/90">
              We're always looking for creative and engaging event ideas from our community members.
              Share your suggestions with us!
            </p>
            <Button size="lg" variant="secondary" className="shadow-hover">
              Suggest an Event
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;