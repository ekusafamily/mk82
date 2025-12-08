import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users, Award, Heart, Lightbulb } from "lucide-react";
import MembershipRegistration from "@/components/MembershipRegistration";

const About = () => {
  const previousLeadership = [
    {
      name: "Justus Murimi",
      role: "Chairperson",
      description: "Led with dedication and coordinated academic initiatives.",
      email: "james.vp@ekusa.com",
      phone: "+254 723 456 789",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Brenda",
      role: "Vice Chairperson",
      description: "Built bridges with the community and managed partnerships.",
      email: "david.pr@ekusa.com",
      phone: "+254 767 890 123",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Willson",
      role: "Secretary General",
      description: "Managed communications and kept our community connected.",
      email: "grace.secretary@ekusa.com",
      phone: "+254 734 567 890",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Muragi Master",
      role: "Treasurer",
      description: "Ensured financial transparency and resource management.",
      email: "michael.treasurer@ekusa.com",
      phone: "+254 745 678 901",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Brian Mutwiri",
      role: "Organizing Secretary",
      description: "Organized exciting activities and memorable experiences.",
      email: "organizingsec@ekusa.top",
      phone: "+254 793 402647",
      image: "https://i.ibb.co/pv46wD2M/IMG-7707.jpg"
    },
    {
      name: "Pascoline",
      role: "Vice Secretary",
      description: "Advocated for student academic needs and coordinated study groups.",
      email: "ann.academic@ekusa.com",
      phone: "+254 778 901 234",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Joseph Munene Kagendo",
      role: "Chief Whip",
      description: "Ensured order and discipline within the association.",
      email: "munenes-whip@ekusa.com",
      phone: "+254 768765783",
      image: "https://i.ibb.co/zH4W8vm5/20240814075207-IMG-4440-1.jpg"
    },
    {
      name: "Betty Joan",
      role: "Welfare Officer",
      description: "Supported student wellbeing and provided guidance.",
      email: "welfare@ekusa.top",
      phone: "+254 717 308098",
      image: "https://i.ibb.co/W4bHGsPH/2024081507022645-1.jpg"
    },
    {
      name: "Brian Ireri",
      role: "IT & Digital Media Manager",
      description: "Managed digital presence and technical infrastructure.",
      email: "brian.tech@ekusa.com",
      phone: "+254 701 234 567",
      image: "https://i.ibb.co/8DXgGSNx/IMG-20250218-163059-556-transcpr.jpg"
    }
  ];

  const currentLeadership = [
    {
      name: "Kamunga",
      role: "Patron",
      description: "Leading EKUSA with passion and dedication to student excellence.",
      email: "patron@ekusa.com",
      phone: "+254722373784",
      image: "https://i.ibb.co/rfNqBbk1/20240814064118-IMG-4336.jpg"
    },
    {
      name: "Brian Mutwiri",
      role: "Chairperson",
      description: "Leading the association towards a brighter future.",
      email: "chairman@ekusa.com",
      phone: "+254 793 402647",
      image: "https://i.ibb.co/pv46wD2M/IMG-7707.jpg"
    },
    {
      name: "Betty Joan",
      role: "Vice Chairperson",
      description: "Supporting the chair and coordinating welfare activities.",
      email: "vc@ekusa.com",
      phone: "+254 717 308098",
      image: "https://i.ibb.co/W4bHGsPH/2024081507022645-1.jpg"
    },
    {
      name: "Eric Wilson",
      role: "Secretary General",
      description: "Ensuring smooth communication and administrative efficiency.",
      email: "secgen@ekusa.com",
      phone: "+254 700 000000",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Brian Ireri",
      role: "Treasurer",
      description: "Safeguarding the association's financial resources.",
      email: "treasurer@ekusa.com",
      phone: "+254 701 234 567",
      image: "https://i.ibb.co/8DXgGSNx/IMG-20250218-163059-556-transcpr.jpg"
    },
    {
      name: "Rodney Kariuki",
      role: "Organizing Secretary",
      description: "Planning and executing vibrant student events.",
      email: "orgsec@ekusa.com",
      phone: "+254 700 000001",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Maina Peace",
      role: "Vice Secretary",
      description: "Assisting in administrative duties and student advocacy.",
      email: "vicesec@ekusa.com",
      phone: "+254 700 000002",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Sharon Mwende",
      role: "Head of Welfare",
      description: "Championing student wellbeing and support services.",
      email: "welfare@ekusa.com",
      phone: "+254 700 000003",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Emmanuel Macharia",
      role: "Chief Whip",
      description: "Maintaining discipline and order within the association.",
      email: "chiefwhip@ekusa.com",
      phone: "+254 700 000004",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Bradino Rufus",
      role: "First Year Rep",
      description: "Representing the interests of first-year students.",
      email: "firstyear@ekusa.com",
      phone: "+254 700 000005",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const values = [
    {
      icon: Users,
      title: "Unity",
      description: "We believe in the power of working together as one community, supporting each other through challenges and celebrating successes together."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for academic and personal excellence, encouraging each member to reach their full potential and achieve their goals."
    },
    {
      icon: Heart,
      title: "Service",
      description: "We are committed to serving our university community and the broader society through meaningful volunteer work and social impact."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace creativity and new ideas, constantly looking for better ways to serve our members and create positive change."
    }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="bg-gradient-hero">
        <div className="container py-20 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About EKUSA</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Meet the passionate team behind Embu University Students Association and learn about our values,
            mission, and the impact we're making in our community.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Our <span className="bg-gradient-hero bg-clip-text text-transparent">Story</span>
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              EKUSA was founded with a simple yet powerful vision: to create a unified platform where
              Embu University students could connect, grow, and make a meaningful impact together.
              What started as a small group of passionate students has grown into a vibrant community
              that spans across all faculties and years.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we continue to uphold our founding principles of unity, excellence, service,
              and innovation, while adapting to meet the evolving needs of our diverse student body.
              Through our various programs, events, and initiatives, we strive to enhance the
              university experience for every student who joins our community.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-muted">
        <div className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-card hover:shadow-hover transition-all duration-300 group">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full bg-gradient-primary w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Leadership Team */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Current <span className="bg-gradient-hero bg-clip-text text-transparent">Leadership</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the Executive Council (2025/2026) dedicated to serving the students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {currentLeadership.map((member, index) => (
            <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300 group overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gradient-primary">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{member.role}</Badge>
                  </div>
                </div>
                <CardDescription className="text-sm mt-3">
                  {member.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Previous Leadership Team */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-muted-foreground">
            Previous Regime
          </h2>
          <p className="text-md text-muted-foreground max-w-2xl mx-auto">
            Acknowledging the leaders who paved the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {previousLeadership.map((member, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden bg-muted/30">
              <CardHeader className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-primary">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">{member.role}</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gradient-hero">
        <div className="container py-16 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              EKUSA Constitution
            </h2>
            <p className="text-xl text-white/90">
              Access our official constitution document to understand our governance,
              rights, responsibilities, and the framework that guides our organization.
            </p>
            <div className="flex justify-center">
              <a
                href="https://www.dkut.ac.ke/downloads/Notice-to-all-Students-on-Application-for-Co-Curricular-Recognition-Awards-September-2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Constitution (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
