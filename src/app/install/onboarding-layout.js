'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle } from 'lucide-react';

const steps = [
  { number: 1, title: 'Supabase Credentials', description: 'Connect your database' },
  { number: 2, title: 'Review Setup', description: 'Preview migrations' },
  { number: 3, title: 'Install Database', description: 'Run migrations' },
  { number: 4, title: 'Storage Bucket', description: 'Setup media storage' },
  { number: 5, title: 'Create Admin', description: 'Setup administrator account' },
  { number: 6, title: 'Complete', description: 'Start using NotWP' },
];

export default function OnboardingLayout({ children }) {
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = React.useState(1);

  // Extract current step from URL and update whenever pathname changes
  React.useEffect(() => {
    const stepMatch = pathname.match(/\/install\/step-(\d+)/);
    if (stepMatch) {
      setCurrentStep(parseInt(stepMatch[1]));
    } else if (pathname === '/install') {
      setCurrentStep(1);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <li
                key={step.number}
                className={`relative ${idx !== steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex items-center">
                  <div className="flex items-center">
                    {step.number < currentStep ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                    ) : step.number === currentStep ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-stone-900 bg-white">
                        <span className="text-sm font-semibold text-stone-900">
                          {step.number}
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-stone-300 bg-white">
                        <Circle className="h-6 w-6 text-stone-300" />
                      </div>
                    )}
                    <div className="ml-3 hidden sm:block">
                      <p
                        className={`text-sm font-medium ${
                          step.number <= currentStep
                            ? 'text-stone-900'
                            : 'text-stone-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-stone-500">{step.description}</p>
                    </div>
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className="ml-4 flex-1">
                      <div
                        className={`h-0.5 ${
                          step.number < currentStep ? 'bg-stone-900' : 'bg-stone-300'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
