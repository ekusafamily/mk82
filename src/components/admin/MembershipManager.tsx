import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MembersUpload from "./MembersUpload";

const MembershipManager = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [eventInterests, setEventInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch members from mock + local storage
      const { getLocalData, initialMembers, initialEvents } = await import("@/lib/mockData");
      const baseMembers = getLocalData("members", initialMembers);
      const additionalMembersRaw = localStorage.getItem("additional_members");
      const additionalMembers = additionalMembersRaw ? JSON.parse(additionalMembersRaw) : [];

      // Merge unique members by id
      const allMembersMap = new Map();
      [...baseMembers, ...additionalMembers].forEach(m => allMembersMap.set(m.id, m));
      const allMembers = Array.from(allMembersMap.values());
      allMembers.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

      setMembers(allMembers);

      // Fetch event interests from local storage
      const storedInterests = localStorage.getItem("event_interests");
      const rawInterests = storedInterests ? JSON.parse(storedInterests) : [];
      const allEvents = getLocalData("events", initialEvents);

      const formattedInterests = rawInterests.map((interest: any) => {
        const member = allMembers.find(m => m.id === interest.member_id) || { name: 'Unknown', email: '', registration_number: '' };
        const event = allEvents.find((e: any) => e.id === interest.event_id) || { title: 'Unknown', event_date: null };

        return {
          ...interest,
          member,
          event
        };
      });
      formattedInterests.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

      setEventInterests(formattedInterests);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    setDeleting(id);
    try {
      // Logic to delete from local storage if it's there
      const additionalMembersRaw = localStorage.getItem("additional_members");
      let additionalMembers = additionalMembersRaw ? JSON.parse(additionalMembersRaw) : [];
      const newAdditionalMembers = additionalMembers.filter((m: any) => m.id !== id);

      if (additionalMembers.length !== newAdditionalMembers.length) {
        localStorage.setItem("additional_members", JSON.stringify(newAdditionalMembers));
      } else {
        // It might be in 'initialMembers', which we can't easily delete from code without file IO.
        // For now, we'll just filter it from state.
        // To truly persist, we'd need a 'deleted_members' list in local storage.
        const deleted = JSON.parse(localStorage.getItem("deleted_members") || "[]");
        deleted.push(id);
        localStorage.setItem("deleted_members", JSON.stringify(deleted));
      }

      setMembers(members.filter((member) => member.id !== id));
      toast({
        title: "Member deleted",
        description: "The member has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting member",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upload">Upload Members</TabsTrigger>
        <TabsTrigger value="members">View Members ({members.length})</TabsTrigger>
        <TabsTrigger value="interests">Event Interests ({eventInterests.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-4">
        <MembersUpload />
        <Button onClick={fetchData} variant="outline" className="w-full">
          Refresh Data
        </Button>
      </TabsContent>

      <TabsContent value="members" className="space-y-4">
        {members.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No members yet. Upload an Excel file to add members.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.registration_number}
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email || 'N/A'}</TableCell>
                    <TableCell>{member.phone_number || 'N/A'}</TableCell>
                    <TableCell>{member.course || 'N/A'}</TableCell>
                    <TableCell>{member.year_of_study || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
                        disabled={deleting === member.id}
                      >
                        {deleting === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="interests" className="space-y-4">
        {eventInterests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No event interests recorded yet.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Registration #</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Interest Shown</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventInterests.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell className="font-medium">
                      {interest.member?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{interest.member?.registration_number || 'N/A'}</TableCell>
                    <TableCell>{interest.member?.email || 'N/A'}</TableCell>
                    <TableCell>{interest.event?.title || 'N/A'}</TableCell>
                    <TableCell>
                      {interest.event?.event_date
                        ? new Date(interest.event.event_date).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(interest.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MembershipManager;
