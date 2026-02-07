import { Instagram, Globe, Mail, Phone, MessageCircle, Github, Linkedin, Twitter } from 'lucide-react';

/**
 * CLIENT DATA EXAMPLES:
 * 
 * You can create different client objects here.
 * To switch the active client, change the `export const config = client_printo;` at the bottom.
 */

const client_printo = {
  profile: {
    name: "Printo Cards",
    role: "Digital Identity Solutions",
    bio: "We specialize in cutting-edge NFC technology and digital identity platforms. Our goal is to revolutionize how professionals connect and share information in a paperless world.",
    image: "/logobig.jpeg",
    coverImage: "/banner.jpeg",
    verified: true,
  },
  theme: {
    primaryColor: "#38bdf8",
    surfaceColor: "#0a0a0b",
    onSurface: "#ffffff",
    onPrimary: "#ffffff",
    accentColor: "#0ea5e9",
  },
  skills: [
    { name: "NFC Technology", level: 98 },
    { name: "Digital Identity", level: 95 },
    { name: "Brand Integration", level: 90 },
    { name: "UI/UX Design", level: 85 },
  ],
  projects: [
    {
      title: "Metal NFC Cards",
      description: "Premium laser-engraved metal cards with integrated NFC chips.",
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop",
      link: "https://www.printocards.com"
    },
    {
      title: "Digital Identity SaaS",
      description: "A complete platform for managing digital business cards.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      link: "https://www.printocards.com"
    }
  ],
  actions: {
    saveContact: { enabled: true, label: "Save Contact" },
    camera: { enabled: true, label: "Scan" },
    email: { enabled: true, value: "sales@printocards.com" },
    phone: { enabled: true, value: "+91 9207806665" },
    website: { enabled: true, value: "https://www.printocards.com" }
  },
  socials: [
    { id: "whatsapp", icon: MessageCircle, url: "https://wa.me/+919207806665", enabled: true, color: "#25D366" },
    { id: "instagram", icon: Instagram, url: "https://instagram.com/printocards", enabled: true, color: "#E1306C" },
    { id: "website", icon: Globe, url: "https://www.printocards.com", enabled: true, color: "#38bdf8" },
  ]
};

const client_photographer = {
  profile: {
    name: "Elena Vision",
    role: "Professional Photographer",
    bio: "Capturing life's most beautiful moments through a unique lens. Specializing in wedding, portrait, and architectural photography.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop",
    verified: true,
  },
  theme: {
    primaryColor: "#f472b6", // Pink
    surfaceColor: "#0f172a",
    onSurface: "#ffffff",
    onPrimary: "#ffffff",
    accentColor: "#ec4899",
  },
  skills: [
    { name: "Portraiture", level: 95 },
    { name: "Color Grading", level: 90 },
    { name: "Flash Lighting", level: 85 },
  ],
  projects: [
    {
      title: "Summer Wedding",
      description: "A beautiful destination wedding gallery at the Amalfi Coast.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      link: "#"
    }
  ],
  actions: {
    saveContact: { enabled: true, label: "Book a Session" },
    camera: { enabled: false, label: "Scan" },
    email: { enabled: true, value: "elena@example.com" },
    phone: { enabled: true, value: "+1 555 123 456" },
    website: { enabled: true, value: "https://elenavision.com" }
  },
  socials: [
    { id: "instagram", icon: Instagram, url: "#", enabled: true, color: "#E1306C" },
    { id: "linkedin", icon: Linkedin, url: "#", enabled: true, color: "#0077b5" },
  ]
};

const client_developer = {
  profile: {
    name: "Devin Code",
    role: "Frontend Architect",
    bio: "Building high-performance user interfaces with React, Next.js, and TypeScript. Focused on accessibility and micro-interactions.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop",
    verified: true,
  },
  theme: {
    primaryColor: "#10b981", // Emerald
    surfaceColor: "#020617",
    onSurface: "#ffffff",
    onPrimary: "#ffffff",
    accentColor: "#34d399",
  },
  skills: [
    { name: "React/Next.js", level: 98 },
    { name: "TypeScript", level: 92 },
    { name: "Tailwind CSS", level: 95 },
  ],
  projects: [
    {
      title: "Portfolio Template",
      description: "A multi-client NFC portfolio system.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      link: "#"
    }
  ],
  actions: {
    saveContact: { enabled: true, label: "Hire Me" },
    camera: { enabled: true, label: "Scan" },
    email: { enabled: true, value: "devin@example.com" },
    phone: { enabled: true, value: "+1 888 777 666" },
    website: { enabled: true, value: "https://devincode.io" }
  },
  socials: [
    { id: "github", icon: Github, url: "#", enabled: true, color: "#24292e" },
    { id: "linkedin", icon: Linkedin, url: "#", enabled: true, color: "#0077b5" },
    { id: "twitter", icon: Twitter, url: "#", enabled: true, color: "#1DA1F2" },
  ]
};

// ---------------------------------------------------------
// EXPORT ACTIVE CLIENT
// ---------------------------------------------------------
// Change 'client_printo' to 'client_photographer' or 'client_developer' to switch profiles!
export const config = client_printo;
