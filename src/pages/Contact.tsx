import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, MessageCircle, Clock, Users } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const message = {
        id: crypto.randomUUID(),
        ...formData,
        created_at: new Date().toISOString()
      };

      // Store in local storage for "admin" to see later
      const stored = localStorage.getItem("contacts") || "[]";
      const messages = JSON.parse(stored);
      messages.push(message);
      localStorage.setItem("contacts", JSON.stringify(messages));

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "info@ekusa.com",
      action: "mailto:info@ekusa.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Reach us during office hours",
      contact: "+254 712 345 678",
      action: "tel:+254712345678"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Quick messages and updates",
      contact: "Join Our Group",
      action: "https://wa.me/254712345678"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "EKUSA Office, Student Center",
      contact: "Embu University Campus",
      action: "#"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", time: "8:00 AM - 5:00 PM" },
    { day: "Saturday", time: "9:00 AM - 1:00 PM" },
    { day: "Sunday", time: "Closed" }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="bg-gradient-hero">
        <div className="container py-20 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Have questions, suggestions, or want to get involved? We'd love to hear from you!
            Reach out through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer">
              <a href={info.action} className="block">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full bg-gradient-primary w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-2">{info.description}</CardDescription>
                  <p className="font-medium text-primary group-hover:text-primary-hover transition-colors">
                    {info.contact}
                  </p>
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[120px]"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Office Hours */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-light">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Office Hours</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="font-medium">{schedule.day}</span>
                      <span className="text-muted-foreground">{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Connect */}
            <Card className="shadow-card bg-gradient-hero text-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Quick Connect</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90">
                  Need immediate assistance or want to join our community conversations?
                  Connect with us on WhatsApp for instant responses!
                </p>
                <Button variant="secondary" size="lg" className="w-full shadow-hover">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Join WhatsApp Group
                </Button>
              </CardContent>
            </Card>

            {/* Leadership Contact */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-secondary-light">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Leadership Team</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Brian Mutwiri - Chairperson</p>
                    <p className="text-sm text-muted-foreground">chairman@ekusa.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Betty Joan - Vice Chairperson</p>
                    <p className="text-sm text-muted-foreground">vc@ekusa.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Eric Wilson - Secretary General</p>
                    <p className="text-sm text-muted-foreground">secgen@ekusa.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Brian Ireri - Treasurer</p>
                    <p className="text-sm text-muted-foreground">treasurer@ekusa.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ or Additional Help */}
      <section className="bg-muted">
        <div className="container py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked <span className="bg-gradient-hero bg-clip-text text-transparent">Questions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">How do I join EKUSA?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simply attend one of our monthly meetings or contact us directly.
                  Membership is open to all Embu University students.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Are there membership fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We have a minimal annual membership fee that goes towards organizing
                  events and community service activities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Can I suggest event ideas?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Absolutely! We welcome creative ideas from our members.
                  Contact us or bring your suggestions to our monthly meetings.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;