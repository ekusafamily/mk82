import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Edit, Trash2, Newspaper, Calendar, MessageSquare, UserCheck, Users } from "lucide-react";
import NewsManager from "@/components/admin/NewsManager";
import EventsManager from "@/components/admin/EventsManager";
import ContactsManager from "@/components/admin/ContactsManager";
import RegistrationsManager from "@/components/admin/RegistrationsManager";
import MembershipManager from "@/components/admin/MembershipManager";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const session = localStorage.getItem("ekusa_admin_session");

    if (!session) {
      navigate("/admin/auth");
      return;
    }

    try {
      const parsed = JSON.parse(session);
      setUser(parsed.user);
    } catch (e) {
      navigate("/admin/auth");
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("ekusa_admin_session");
    toast({
      title: "Success",
      description: "Successfully logged out",
    });
    navigate("/admin/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">EKUSA Admin Panel</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4" />
              <span>News</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Registrations</span>
            </TabsTrigger>
            <TabsTrigger value="membership" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Membership</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Contacts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Newspaper className="h-5 w-5" />
                  <span>News Management</span>
                </CardTitle>
                <CardDescription>
                  Create, edit, and manage news articles for the EKUSA website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Events Management</span>
                </CardTitle>
                <CardDescription>
                  Create, edit, and manage events for the EKUSA community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Event Registrations</span>
                </CardTitle>
                <CardDescription>
                  View and manage event registrations from community members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegistrationsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membership" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Membership Registrations</span>
                </CardTitle>
                <CardDescription>
                  View and manage membership applications from prospective members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MembershipManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Contact Messages</span>
                </CardTitle>
                <CardDescription>
                  View and manage contact form submissions from website visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactsManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;