import { Hero } from "@/components/sections/Hero";
import { WelcomeMessage } from "@/components/sections/WelcomeMessage";
import { Services } from "@/components/sections/Services";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { PatronMessage } from "@/components/sections/PatronMessage";
import { CTARibbon } from "@/components/sections/CTARibbon";
import { Blog } from "@/components/sections/Blog";
import WhatsAppWidget from "@/components/ui/whatsapp-widget";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917004029406";

export default async function Home() {
  return (
    <>
      <Hero />
      <WelcomeMessage />
      <Services />
      <WhyChooseUs />
      <PatronMessage />
      <CTARibbon />
      <Blog />
      <WhatsAppWidget phoneNumber={WHATSAPP_NUMBER} />
    </>
  );
}
