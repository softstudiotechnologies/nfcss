import { Share2, Instagram, Linkedin, Twitter, Globe, Mail, Phone, MessageCircle } from 'lucide-react';
import { FaWhatsapp, FaTelegram, FaDiscord, FaMedium, FaFacebook, FaFacebookF } from 'react-icons/fa';

export const config = {
  // Brand & Profile Configuration
  profile: {
    name: "Muhammed Favas",
    role: "Software Develor",
    image: "/favas.JPG", // Avatar
    coverImage: "BLG.JPG", // Premium Cover
    verified: true,
  },

  // Theme Configuration
  theme: {
    primaryColor: "#ffffff",       // White buttons for maximum contrast
    // Dark Slate
    surfaceColor: "#000000ff",       // Deep Midnight Blue
    onSurface: "#f8fafc",          // Off-white text for readability
    onPrimary: "#0f172a",          // Dark text on white buttons
    accentColor: "#38bdf8",        // Sky Blue accent
  },

  // Action Buttons (Top row)
  actions: {
    saveContact: {
      enabled: true,
      label: "Save Contact"
    },

    email: {
      enabled: true,
      value: "alex@example.com",
    },
    phone: {
      enabled: true,
      value: "+91 8086630149",
    },
    website: {
      enabled: true,
      value: "https://alexmorgan.design",
    }
  },

  // Social Links
  socials: [
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      url: "https://wa.me/15551234567",
      enabled: true,
      color: "#25D366"
    },
    {
      id: "linkedin",
      icon: Linkedin,
      url: "https://linkedin.com/in/alexmorgan",
      enabled: true,
      color: "#0077B5"
    },
    {
      id: "instagram",
      icon: Instagram,
      url: "https://instagram.com/mhmdfavas",
      enabled: true,
      color: "#E1306C"
    },
    {
      id: "telegram",
      icon: FaTelegram,
      url: "https://t.me/alexmorgan",
      enabled: true,
      color: "#0088cc"
    },
    {
      id: "medium",
      icon: FaFacebook,
      url: "https://medium.com/@alexmorgan",
      enabled: true,
      color: "#000000"
    },
    {
      id: "discord",
      icon: FaDiscord,
      url: "https://discord.gg/alex",
      enabled: true,
      color: "#5865F2"
    }
  ]
};
