import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Loader2, CheckCircle } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MembershipRegistration = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [formData, setFormData] = useState({
    registration_number: "",
    name: "",
  });
  const { toast } = useToast();

  // Check for existing member data on component mount
  useEffect(() => {
    const memberData = localStorage.getItem('ekusa_member');
    if (memberData) {
      try {
        const parsed = JSON.parse(memberData);
        setIsMember(true);
        setMemberName(parsed.name);
      } catch (error) {
        console.error('Error parsing member data:', error);
        localStorage.removeItem('ekusa_member');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { getLocalData, initialMembers } = await import("@/lib/mockData");
      const allMembers = getLocalData("members", initialMembers);

      // Verify if member exists in the mock data
      const member = allMembers.find((m: any) =>
        m.registration_number === formData.registration_number.trim() &&
        m.name.toLowerCase() === formData.name.trim().toLowerCase()
      );


      if (!member) {
        toast({
          title: "Verification Failed",
          description: "Registration number and name do not match our records. Try 'John Doe' / 'B123-01-0001/2021'",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store member data in localStorage
      localStorage.setItem('ekusa_member', JSON.stringify({
        id: member.id,
        name: member.name,
        registration_number: member.registration_number,
        email: member.email,
        phone_number: member.phone_number,
        course: member.course,
        year_of_study: member.year_of_study
      }));

      toast({
        title: "Welcome Back!",
        description: `Hi ${member.name}, you've been verified successfully.`,
      });

      // Update state to show member status
      setIsMember(true);
      setMemberName(member.name);

      // Reset form and close dialog
      setFormData({
        registration_number: "",
        name: "",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error verifying membership:", error);
      toast({
        title: "Verification Failed",
        description: "There was an error verifying your membership. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isMember ? (
        // Show member status button for existing members
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="hidden sm:inline">Welcome, {memberName.split(' ')[0]}!</span>
          <span className="sm:hidden">Member</span>
        </Button>
      ) : (
        // Show verification dialog for non-members
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="sm:size-default">
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Member Login</span>
              <span className="sm:hidden">Login</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Member Verification</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter your registration number and name to verify your EKUSA membership.
              </p>

              <div className="space-y-2">
                <Label htmlFor="registration_number">Registration Number *</Label>
                <Input
                  id="registration_number"
                  type="text"
                  placeholder="B010-01-****/2025"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your details must match those registered with EKUSA by your admin
              </p>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MembershipRegistration;
