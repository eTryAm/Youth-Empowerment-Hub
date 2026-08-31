import { Metadata } from 'next';
import { AuditList } from '@/components/admin/audit/audit-list';
import { getAuditLogs } from '@/lib/actions/audit';

export const metadata: Metadata = {
  title: 'Audit Logs | Admin | Youth Empowerment Hub',
};

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 mt-1">System activity, mutation logs, and security events.</p>
      </div>
      <AuditList initialLogs={logs} />
    </div>
  );
}