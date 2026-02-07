import { Share2, Mail, Phone, Globe, UserPlus, ScanLine, ExternalLink, Download, MessageCircle, Instagram } from 'lucide-react';
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaGlobe
} from 'react-icons/fa';

export const config = {
  // Brand & Profile Configuration
  profile: {
    name: "Printo Cards",
    role: "Digital Identity Solutions",
    bio: "We specialize in cutting-edge NFC technology and digital identity platforms. Our goal is to revolutionize how professionals connect and share information in a paperless world.",
    image: "/logobig.jpeg",
    coverImage: "/banner.jpeg",
    verified: true,
  },

  // Theme Configuration
  theme: {
    primaryColor: "#f87238e2", // Your chosen orange theme
    surfaceColor: "#000000ff", // Pure black
    onSurface: "#ffffff",
    onPrimary: "#ffffff",
    accentColor: "#f87238e2",
  },

  // Services / Expertise
  skills: [
    { name: "NFC Technology", level: 98 },
    { name: "Digital Identity", level: 95 },
    { name: "Brand Integration", level: 90 },
    { name: "UI/UX Design", level: 85 },
    { name: "Mobile Solutions", level: 88 },
    { name: "Cloud Management", level: 82 },
  ],

  // Featured Solutions
  projects: [
    {
      title: "Metal NFC Cards",
      description: "Premium laser-engraved metal cards with integrated NFC chips for ultimate networking.",
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop",
      link: "https://www.printocards.com"
    },
    {
      title: "Digital Identity SaaS",
      description: "A complete platform for managing digital business cards and enterprise identities.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      link: "https://www.printocards.com"
    }
  ],

  // Action Buttons (Top row)
  actions: {
    saveContact: {
      enabled: true,
      label: "Save Contact",
      icon: UserPlus
    },
    camera: {
      enabled: false, // Hidden as per your previous request
      label: "Scan Card",
      icon: ScanLine
    },
    email: {
      enabled: true,
      value: "sales@printocards.com",
      icon: Mail
    },
    phone: {
      enabled: true,
      value: "+91 9207806665",
      icon: Phone
    },
    website: {
      enabled: true,
      value: "https://www.printocards.com",
      icon: Globe
    }
  },

  // Social Links
  socials: [
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      url: "https://wa.me/+919207806665",
      enabled: true,
      color: "#25D366"
    },
    {
      id: "instagram",
      icon: FaInstagram,
      url: "https://instagram.com/printocards",
      enabled: true,
      color: "#E1306C"
    },
    {
      id: "facebook",
      icon: FaFacebook,
      url: "https://facebook.com/printocards",
      enabled: true,
      color: "#1877F2"
    },
    {
      id: "website",
      icon: FaGlobe,
      url: "https://www.printocards.com",
      enabled: true,
      color: "#f87238e2"
    },
  ]
};
