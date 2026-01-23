import { Share2, Instagram, Linkedin, Twitter, Globe, Mail, Phone, MessageCircle } from 'lucide-react';
import { FaWhatsapp, FaTelegram, FaDiscord, FaMedium, FaFacebook, FaFacebookF, FaMobile, FaPhone, FaInternetExplorer, FaGoogle } from 'react-icons/fa';

export const config = {
  // Brand & Profile Configuration
  profile: {
    name: "Printo Cards And Technologies",
    // role: "Software Developer",
    image: "/logobig.jpeg", // Avatar
    coverImage: "/banner.jpeg", // Premium Cover
    // verified: true,
  },

  // Theme Configuration
  theme: {
    primaryColor: "#ffffff",       // Solid White
    surfaceColor: "#000000ff",       // Solid Dark Slate
    onSurface: "#ffffff",          // White text
    onPrimary: "#000000ff",          // Dark text on white buttons
    accentColor: "#000000ff",        // Sky Blue accent
  },

  // Action Buttons (Top row)
  actions: {
    saveContact: {
      enabled: true,
      label: "Save Contact"
    },

    email: {
      enabled: true,
      value: "sales@printocards.com",
    },
    phone: {
      enabled: true,
      value: "+91 9207806665",
    },
    website: {
      enabled: true,
      value: "https://www.printocards.com",
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
      id: "Website",
      icon: FaGoogle,
      url: "https://www.printocards.com",
      enabled: true,
      color: "#444444ff"
    },
    {
      id: "instagram",
      icon: Instagram,
      url: "https://instagram.com/printocards",
      enabled: true,
      color: "#E1306C"
    },
    // {
    //   id: "telegram",
    //   icon: FaTelegram,
    //   url: "https://t.me/alexmorgan",
    //   enabled: true,
    //   color: "#0088cc"
    // },



    // {
    //   id: "medium",
    //   icon: FaFacebook,
    //   url: "https://facebook.com/printocards",
    //   enabled: true,
    //   color: "#004cffff"
    // },

  ]
};
