import DashboardLayoutClient from './layout-client';
import { ErrorBoundary } from '@/components/error-boundary';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </ErrorBoundary>
  );
}
