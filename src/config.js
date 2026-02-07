import { Github, Instagram, Linkedin, Twitter, Globe, Mail, Phone, MessageCircle } from 'lucide-react';

export const config = {
  // Brand & Profile Configuration
  profile: {
    name: "Alex Morgan",
    role: "Senior Full Stack Developer",
    bio: "I build high-performance, beautiful web applications with a focus on user experience and clean code. Passionate about React, Node.js, and Cloud Architecture.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop", // Placeholder avatar
    coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop", // Premium Cover
    verified: true,
  },

  // Theme Configuration
  theme: {
    primaryColor: "#6366f1",       // Indigo
    surfaceColor: "#0a0a0b",       // Dark Surface
    onSurface: "#ffffff",          // White text
    onPrimary: "#ffffff",          // White text on primary buttons
    accentColor: "#818cf8",        // Lighter indigo
  },

  // Skills
  skills: [
    { name: "React", level: 95 },
    { name: "Node.js", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Next.js", level: 92 },
    { name: "PostgreSQL", level: 80 },
    { name: "AWS", level: 75 },
  ],

  // Projects
  projects: [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with real-time inventory and payment integration.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800&auto=format&fit=crop",
      link: "#"
    },
    {
      title: "AI Chat Assistant",
      description: "Intelligent chatbot powered by GPT-4 for automated customer support.",
      image: "https://images.unsplash.com/photo-153129748060c-120794474b91?q=80&w=800&auto=format&fit=crop",
      link: "#"
    }
  ],

  // Action Buttons (Top row)
  actions: {
    saveContact: {
      enabled: true,
      label: "Download CV"
    },

    camera: {
      enabled: false,
      label: "Scan"
    },

    email: {
      enabled: true,
      value: "alex.morgan@example.com",
    },
    phone: {
      enabled: true,
      value: "+1 234 567 890",
    },
    website: {
      enabled: true,
      value: "https://alexmorgan.dev",
    }
  },

  // Social Links
  socials: [
    {
      id: "github",
      icon: Github,
      url: "https://github.com/alexmorgan",
      enabled: true,
      color: "#24292e"
    },
    {
      id: "linkedin",
      icon: Linkedin,
      url: "https://linkedin.com/in/alexmorgan",
      enabled: true,
      color: "#0077b5"
    },
    {
      id: "instagram",
      icon: Instagram,
      url: "https://instagram.com/alexmorgan",
      enabled: true,
      color: "#E1306C"
    },
  ]
};
