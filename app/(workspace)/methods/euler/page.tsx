import type { Metadata } from 'next';
import { EulerMethod } from '@/components/euler-method';

export const metadata: Metadata = {
  title: 'Euler Methods',
  description:
    'Oddiy va takomillashgan Eyler usullari bilan differensial tenglamalarni yeching va taqqoslang.',
};

export default function EulerPage() {
  return <EulerMethod />;
}
