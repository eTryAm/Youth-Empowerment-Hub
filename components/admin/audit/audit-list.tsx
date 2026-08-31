'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldAlert } from 'lucide-react';

export function AuditList({ initialLogs }: { initialLogs: any[] }) {
  const [logs] = useState(initialLogs || []);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userEmail?.toLowerCase().includes(search.toLowerCase()) || 
      log.userName?.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action?.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search user, action, or entity..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl" 
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[180px] bg-white border-slate-200 text-slate-900 rounded-xl">
            <SelectValue placeholder="Filter Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="login">Login / Auth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Timestamp</TableHead>
              <TableHead className="font-bold text-slate-700">User / Actor</TableHead>
              <TableHead className="font-bold text-slate-700">Action</TableHead>
              <TableHead className="font-bold text-slate-700">Entity</TableHead>
              <TableHead className="font-bold text-slate-700">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map(log => (
              <TableRow key={log.id} className="border-b border-slate-100 hover:bg-slate-50/60 text-sm transition-colors">
                <TableCell className="text-slate-500 whitespace-nowrap font-mono text-xs">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-slate-900 font-medium">
                  {log.userName || 'System / Admin'} <br/>
                  <span className="text-xs text-slate-400 font-normal">{log.userEmail || log.userId}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300 font-mono text-[11px]">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-700">
                  <span className="font-semibold capitalize">{log.entityType || 'General'}</span> <br/>
                  <span className="text-xs text-slate-400 font-mono">{log.entityId || '—'}</span>
                </TableCell>
                <TableCell className="text-slate-600 max-w-xs truncate" title={log.metadata ? JSON.stringify(log.metadata) : log.details}>
                  {log.metadata ? JSON.stringify(log.metadata) : log.details || '—'}
                </TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">No audit logs found</p>
                  <p className="text-xs text-slate-400 mt-1">Actions performed across the admin portal will be recorded here.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}