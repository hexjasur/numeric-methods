import type { Metadata } from 'next';
import { AboutPage } from '@/components/about-page';

export const metadata: Metadata = {
  title: 'About - Numerical Methods Platform',
  description: "Learn about the Numerical Methods Platform, its mission, and the team behind it. Discover how we aim to make numerical methods accessible and understandable for everyone.",
};

export default function Page() {
  return <AboutPage />;
}
