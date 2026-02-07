import { Share2, Mail, Phone, Globe, UserPlus, ScanLine, ExternalLink, Download } from 'lucide-react';
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaGlobe,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';

/**
 * CLIENT DATA EXAMPLES
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
    primaryColor: "#f87238e2",
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
    saveContact: { enabled: true, label: "Save Contact", icon: UserPlus },
    camera: { enabled: false, label: "Scan Card", icon: ScanLine },
    email: { enabled: true, value: "sales@printocards.com", icon: Mail },
    phone: { enabled: true, value: "+91 9207806665", icon: Phone },
    website: { enabled: true, value: "https://www.printocards.com", icon: Globe }
  },
  socials: [
    { id: "whatsapp", icon: FaWhatsapp, url: "https://wa.me/+919207806665", enabled: true, color: "#25D366" },
    { id: "instagram", icon: FaInstagram, url: "https://instagram.com/printocards", enabled: true, color: "#E1306C" },
    { id: "linkedin", icon: FaLinkedin, url: "#", enabled: true, color: "#0077b5" },
    { id: "facebook", icon: FaFacebook, url: "https://facebook.com/printocards", enabled: true, color: "#1877F2" },
    { id: "website", icon: FaGlobe, url: "https://www.printocards.com", enabled: true, color: "#38bdf8" },
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
    primaryColor: "#f472b6",
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
    saveContact: { enabled: true, label: "Book a Session", icon: UserPlus },
    camera: { enabled: false, label: "Scan", icon: ScanLine },
    email: { enabled: true, value: "elena@example.com", icon: Mail },
    phone: { enabled: true, value: "+1 555 123 456", icon: Phone },
    website: { enabled: true, value: "https://elenavision.com", icon: Globe }
  },
  socials: [
    { id: "instagram", icon: FaInstagram, url: "#", enabled: true, color: "#E1306C" },
    { id: "facebook", icon: FaFacebook, url: "#", enabled: true, color: "#1877F2" },
  ]
};

// Change 'client_printo' to toggle profiles
export const config = client_printo;
