import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Users, Calendar, Phone, User, GraduationCap, FileText } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  name: string;
  course: string;
  registration_number: string;
  phone_number: string;
  created_at: string;
  event: {
    id: string;
    title: string;
    event_date: string;
    type: string;
  };
}

interface Event {
  id: string;
  title: string;
  event_date: string;
  type: string;
}

const RegistrationsManager = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchEvents = async () => {
    try {
      const { getLocalData, initialEvents } = await import("@/lib/mockData");
      const data = getLocalData("events", initialEvents);
      // Sort by event_date desc
      data.sort((a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  };

  const fetchRegistrations = async () => {
    try {
      // Fetch registrations from local storage
      const stored = localStorage.getItem("event_registrations");
      const rawRegistrations = stored ? JSON.parse(stored) : [];

      // Fetch events to join
      const { getLocalData, initialEvents } = await import("@/lib/mockData");
      const allEvents = getLocalData("events", initialEvents);

      const formattedRegistrations = rawRegistrations.map((reg: any) => {
        const event = allEvents.find((e: any) => e.id === reg.event_id) || {
          id: "unknown",
          title: "Unknown Event",
          event_date: new Date().toISOString(),
          type: "Unknown"
        };
        return {
          ...reg,
          event: event
        };
      });

      // Sort by created_at desc if available, else standard sort
      formattedRegistrations.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

      setRegistrations(formattedRegistrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    try {
      const stored = localStorage.getItem("event_registrations");
      let registrations = stored ? JSON.parse(stored) : [];
      registrations = registrations.filter((r: any) => r.id !== id);
      localStorage.setItem("event_registrations", JSON.stringify(registrations));

      setRegistrations(prev => prev.filter(reg => reg.id !== id));
      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast({
        title: "Error",
        description: "Failed to delete registration",
        variant: "destructive",
      });
    }
  };

  const filteredRegistrations = selectedEventId === "all"
    ? registrations
    : registrations.filter(reg => reg.event.id === selectedEventId);

  const getRegistrationsByEvent = () => {
    const eventCounts = registrations.reduce((acc, reg) => {
      const eventId = reg.event.id;
      acc[eventId] = (acc[eventId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return events.map(event => ({
      ...event,
      registrations: eventCounts[event.id] || 0
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Event Registrations</h2>
          <p className="text-muted-foreground">
            Manage event registrations and view participant details
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Event Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Registrations</CardTitle>
          <CardDescription>Filter registrations by event</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title} - {new Date(event.event_date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Registrations by Event Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Registrations Summary</CardTitle>
          <CardDescription>Number of registrations per event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRegistrationsByEvent().map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.event_date).toLocaleDateString()} • {event.type}
                  </p>
                </div>
                <Badge variant="secondary">
                  {event.registrations} registrations
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedEventId === "all" ? "All Registrations" : "Event Registrations"}
          </CardTitle>
          <CardDescription>
            {filteredRegistrations.length} registration(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No registrations found</h3>
              <p className="text-muted-foreground">
                {selectedEventId === "all"
                  ? "No one has registered for any events yet."
                  : "No registrations for the selected event."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Reg. Number</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{registration.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{registration.event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(registration.event.event_date).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{registration.course}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{registration.registration_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{registration.phone_number}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(registration.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRegistration(registration.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationsManager;