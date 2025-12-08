import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Loader2, Heart } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EventRegistrationProps {
  eventId: string;
  eventTitle: string;
}

interface MemberCheck {
  email: string;
  registration_number: string;
}

interface RegistrationForm {
  name: string;
  course: string;
  registration_number: string;
  phone_number: string;
}

const EventRegistration = ({ eventId, eventTitle }: EventRegistrationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'check' | 'register' | 'new-registration'>('check');
  const [memberData, setMemberData] = useState<any>(null);
  const [memberCheck, setMemberCheck] = useState<MemberCheck>({
    email: "",
    registration_number: "",
  });
  const [formData, setFormData] = useState<RegistrationForm>({
    name: "",
    course: "",
    registration_number: "",
    phone_number: "",
  });
  const { toast } = useToast();

  // Check for existing member data on component mount
  useEffect(() => {
    const storedMemberData = localStorage.getItem('ekusa_member');
    if (storedMemberData) {
      try {
        const parsed = JSON.parse(storedMemberData);
        setMemberData(parsed);
        setStep('check');
      } catch (error) {
        console.error('Error parsing member data:', error);
        localStorage.removeItem('ekusa_member');
      }
    }
  }, []);

  const handleMemberCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Use local mock data for members
      const { getLocalData, initialMembers } = await import("@/lib/mockData");
      const allMembers = getLocalData("members", initialMembers);

      let existingMember: any = null;

      if (memberData) {
        existingMember = allMembers.find((m: any) => m.id === memberData.id);
        if (!existingMember) {
          localStorage.removeItem('ekusa_member');
          setMemberData(null);
          throw new Error('Stored member data is invalid');
        }
      } else {
        existingMember = allMembers.find((m: any) =>
          m.email === memberCheck.email || m.registration_number === memberCheck.registration_number
        );
      }

      if (existingMember) {
        // Check if already interested (mock check)
        const storedInterests = localStorage.getItem("event_interests");
        const interests = storedInterests ? JSON.parse(storedInterests) : [];
        const isInterested = interests.some((i: any) => i.member_id === existingMember.id && i.event_id === eventId);

        if (isInterested) {
          toast({
            title: "Already Interested!",
            description: `You're already marked as interested in ${eventTitle}`,
          });
          setIsOpen(false);
          return;
        }

        // Add interest
        interests.push({ member_id: existingMember.id, event_id: eventId });
        localStorage.setItem("event_interests", JSON.stringify(interests));

        toast({
          title: "Interest Recorded!",
          description: `Welcome back ${existingMember.name}! Your interest in ${eventTitle} has been recorded.`,
        });

        resetAndClose();
      } else {
        // Member doesn't exist, show registration options
        setStep('register');
      }
    } catch (error) {
      console.error("Error checking member:", error);
      toast({
        title: "Check Failed",
        description: "There was an error checking your membership status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const storedRegs = localStorage.getItem("event_registrations");
      const registrations = storedRegs ? JSON.parse(storedRegs) : [];
      registrations.push({
        id: crypto.randomUUID(),
        event_id: eventId,
        ...formData,
        created_at: new Date().toISOString()
      });
      localStorage.setItem("event_registrations", JSON.stringify(registrations));

      toast({
        title: "Registration Successful!",
        description: `You have been registered for ${eventTitle}`,
      });

      resetAndClose();
    } catch (error) {
      console.error("Error registering for event:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setMemberCheck({ email: "", registration_number: "" });
    setFormData({
      name: "",
      course: "",
      registration_number: "",
      phone_number: "",
    });
    setStep('check');
    setIsOpen(false);
  };

  const handleInputChange = (field: keyof RegistrationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberCheckChange = (field: keyof MemberCheck, value: string) => {
    setMemberCheck(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setStep('check');
        setMemberCheck({ email: "", registration_number: "" });
        setFormData({ name: "", course: "", registration_number: "", phone_number: "" });
      }
    }}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <Heart className="h-4 w-4 mr-2" />
          I'm Interested
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'check' && "Check Membership Status"}
            {step === 'register' && "Registration Options"}
            {step === 'new-registration' && `Register for ${eventTitle}`}
          </DialogTitle>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            {step === 'check' && (
              <form onSubmit={handleMemberCheck} className="space-y-4">
                {memberData ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Welcome back, <strong>{memberData.name}</strong>!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click below to mark your interest in this event.
                    </p>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Recording Interest...
                        </>
                      ) : (
                        "Show Interest in Event"
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      Are you already an EKUSA member? Enter your details to quickly mark your interest.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="check-email">Email Address</Label>
                      <Input
                        id="check-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={memberCheck.email}
                        onChange={(e) => handleMemberCheckChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="check-reg-number">Registration Number</Label>
                      <Input
                        id="check-reg-number"
                        type="text"
                        placeholder="Your student registration number"
                        value={memberCheck.registration_number}
                        onChange={(e) => handleMemberCheckChange("registration_number", e.target.value)}
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
                          Checking...
                        </>
                      ) : (
                        "Check Membership"
                      )}
                    </Button>
                  </>
                )}
              </form>
            )}

            {step === 'register' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You're not an EKUSA member yet. Would you like to:
                </p>

                <div className="space-y-2">
                  <Button
                    onClick={() => window.open('/about', '_blank')}
                    className="w-full"
                    variant="default"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join EKUSA First (Recommended)
                  </Button>

                  <Button
                    onClick={() => setStep('new-registration')}
                    className="w-full"
                    variant="outline"
                  >
                    Just Register for This Event
                  </Button>
                </div>
              </div>
            )}

            {step === 'new-registration' && (
              <form onSubmit={handleEventRegistration} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course/Program</Label>
                  <Input
                    id="course"
                    type="text"
                    placeholder="e.g., Computer Science, MBA, etc."
                    value={formData.course}
                    onChange={(e) => handleInputChange("course", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_number">Registration Number</Label>
                  <Input
                    id="registration_number"
                    type="text"
                    placeholder="Your student registration number"
                    value={formData.registration_number}
                    onChange={(e) => handleInputChange("registration_number", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="Your contact number"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange("phone_number", e.target.value)}
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={() => setStep('register')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistration;