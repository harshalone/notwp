import OnboardingLayoutClient from './onboarding-layout';

export const metadata = {
  title: 'Setup - notwp',
  description: 'Setup your notwp installation',
};

export default function OnboardingLayout({ children }) {
  return <OnboardingLayoutClient>{children}</OnboardingLayoutClient>;
}
