'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from "./_components/landing/Navigation"
import Hero from "./_components/landing/Hero"
import Stats from "./_components/landing/Stats"
import Features from "./_components/landing/Features"
import WhyNotWP from "./_components/landing/WhyNotWP"
import TechStack from "./_components/landing/TechStack"
import Performance from "./_components/landing/Performance"
import Developer from "./_components/landing/Developer"
import Plugins from "./_components/landing/Plugins"
import Security from "./_components/landing/Security"
import Comparison from "./_components/landing/Comparison"
import UseCases from "./_components/landing/UseCases"
import Community from "./_components/landing/Community"
import Testimonials from "./_components/landing/Testimonials"
import Showcase from "./_components/landing/Showcase"
import Roadmap from "./_components/landing/Roadmap"
import Pricing from "./_components/landing/Pricing"
import Documentation from "./_components/landing/Documentation"
import Support from "./_components/landing/Support"
import OpenSource from "./_components/landing/OpenSource"
import FAQ from "./_components/landing/FAQ"
import CTA from "./_components/landing/CTA"
import Footer from "./_components/landing/Footer"

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    async function checkSetup() {
      try {
        const response = await fetch('/api/db-status');
        const status = await response.json();

        if (!status.isSetup) {
          // Database is not set up, redirect to onboarding
          router.push('/onboarding');
        } else {
          // Database is set up, show landing page
          setShowLanding(true);
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Error checking database status:', error);
        // On error, redirect to onboarding to be safe
        router.push('/onboarding');
      }
    }

    checkSetup();
  }, [router]);

  // Show loading state while checking
  if (isChecking || !showLanding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <WhyNotWP />
      <TechStack />
      <Performance />
      <Developer />
      <Plugins />
      <Security />
      <Comparison />
      <UseCases />
      <Community />
      <Testimonials />
      <Showcase />
      <Roadmap />
      <Pricing />
      <Documentation />
      <Support />
      <OpenSource />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
