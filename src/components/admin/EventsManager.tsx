import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string | null;
  location: string;
  type: string;
  expected_attendees: number;
  actual_attendees: number;
  is_past: boolean;
  images: string[] | null;
  highlight: string | null;
  created_at: string;
}

const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    type: "Meeting",
    expected_attendees: 0,
    actual_attendees: 0,
    is_past: false,
    images: "",
    highlight: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const eventTypes = ["Meeting", "Adventure", "Workshop", "Charity", "Social", "Academic"];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { getLocalData, initialEvents } = await import("@/lib/mockData");
      const data = getLocalData("events", initialEvents);
      // Sort by event_date desc
      data.sort((a: any, b: any) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

      setEvents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { getLocalData, setLocalData, initialEvents } = await import("@/lib/mockData");
      const currentEvents = getLocalData("events", initialEvents);

      const eventData = {
        ...formData,
        expected_attendees: Number(formData.expected_attendees),
        actual_attendees: Number(formData.actual_attendees),
        images: formData.images ? formData.images.split(',').map(url => url.trim()).filter(url => url) : null,
        highlight: formData.highlight || null,
        event_time: formData.event_time || null,
      };

      if (editingItem) {
        const updatedEvents = currentEvents.map((item: any) =>
          item.id === editingItem.id ? { ...item, ...eventData } : item
        );
        setLocalData("events", updatedEvents);

        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        const newEvent = {
          id: crypto.randomUUID(),
          ...eventData,
          created_at: new Date().toISOString()
        };
        currentEvents.push(newEvent);
        setLocalData("events", currentEvents);

        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }

      resetForm();
      fetchEvents();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Event) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      event_date: item.event_date,
      event_time: item.event_time || "",
      location: item.location,
      type: item.type,
      expected_attendees: item.expected_attendees,
      actual_attendees: item.actual_attendees,
      is_past: item.is_past,
      images: item.images ? item.images.join(', ') : "",
      highlight: item.highlight || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const { getLocalData, setLocalData, initialEvents } = await import("@/lib/mockData");
      const currentEvents = getLocalData("events", initialEvents);
      const updatedEvents = currentEvents.filter((item: any) => item.id !== id);
      setLocalData("events", updatedEvents);

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      location: "",
      type: "Meeting",
      expected_attendees: 0,
      actual_attendees: 0,
      is_past: false,
      images: "",
      highlight: "",
    });
    setEditingItem(null);
  };

  const handleNewItem = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading && events.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Events ({events.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the event details" : "Create a new event for the EKUSA community"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Date *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_time">Time</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expected_attendees">Expected Attendees</Label>
                  <Input
                    id="expected_attendees"
                    type="number"
                    value={formData.expected_attendees}
                    onChange={(e) => setFormData({ ...formData, expected_attendees: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actual_attendees">Actual Attendees</Label>
                  <Input
                    id="actual_attendees"
                    type="number"
                    value={formData.actual_attendees}
                    onChange={(e) => setFormData({ ...formData, actual_attendees: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images (comma-separated URLs)</Label>
                <Input
                  id="images"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlight">Highlight (for past events)</Label>
                <Textarea
                  id="highlight"
                  value={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  rows={2}
                  placeholder="Special achievement or notable outcome from the event"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_past"
                  checked={formData.is_past}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_past: checked })}
                />
                <Label htmlFor="is_past">This is a past event</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingItem ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.event_date).toLocaleDateString()}</span>
                    </div>
                    {item.event_time && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.event_time}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                    <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                      {item.type}
                    </span>
                    {item.is_past && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                        Past Event
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>
                      {item.is_past
                        ? `${item.actual_attendees} attended`
                        : `${item.expected_attendees} expected`
                      }
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2">
                {item.description}
              </CardDescription>
              {item.highlight && (
                <div className="mt-2 p-2 bg-accent/10 rounded text-sm">
                  <strong>Highlight:</strong> {item.highlight}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsManager;