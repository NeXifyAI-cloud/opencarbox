'use client';

import { AdminPageLayout } from '@/components/admin/AdminPageLayout';

export default function TerminePage() {
  return (
    <AdminPageLayout title="Termine">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Termine Management</h1>
        <p className="text-gray-600">Termine-Verwaltung wird hier angezeigt.</p>
      </div>
    </AdminPageLayout>
  );
}