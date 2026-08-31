'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, ShieldOff, Search, UserPlus, ShieldCheck } from 'lucide-react';
import { createAdminUser, updateUserRole, deactivateUser } from '@/lib/actions/users';
import type { Role } from '@/lib/auth/roles';
import { toast } from 'sonner';

export function UserList({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'content_admin' as Role
  });

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('email', formData.email);
      fd.append('password', formData.password);
      fd.append('role', formData.role);

      const res = await createAdminUser(fd);
      if (res.success && res.data) {
        setUsers([res.data, ...users]);
        toast.success('Admin user created');
        setIsCreateOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'content_admin' });
      } else {
        toast.error(typeof res.error === 'string' ? res.error : 'Failed to create user');
      }
    } catch {
      toast.error('Failed to create user');
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error('Failed to update role');
      }
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDeactivate = async (userId: string) => {
    try {
      const res = await deactivateUser(userId);
      if (res.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'inactive' } : u));
        toast.success('User deactivated');
      } else {
        toast.error('Failed to deactivate user');
      }
    } catch {
      toast.error('Failed to deactivate user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
          />
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer">
              <Plus className="h-4 w-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Create Admin User
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-900 font-medium">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-900 font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-900 font-medium">Initial Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-slate-900 font-medium">Access Role</Label>
                <Select value={formData.role} onValueChange={(val: Role) => setFormData({...formData, role: val})}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    <SelectItem value="content_admin">Content Admin</SelectItem>
                    <SelectItem value="super_admin">Super Administrator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl cursor-pointer">
                Create User
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Name</TableHead>
              <TableHead className="font-bold text-slate-700">Email</TableHead>
              <TableHead className="font-bold text-slate-700">Role</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">Created</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <TableCell className="font-bold text-slate-900">{user.name}</TableCell>
                <TableCell className="text-slate-600">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'super_admin' ? 'destructive' : user.role === 'content_admin' ? 'default' : 'secondary'} className="font-semibold">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer hover:bg-slate-100 rounded-lg">
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-900 shadow-lg rounded-xl">
                      <DropdownMenuLabel className="text-slate-700">Manage Access</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'content_admin')} className="cursor-pointer hover:bg-slate-50">
                        Set as Content Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'super_admin')} className="cursor-pointer hover:bg-slate-50">
                        Set as Super Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'viewer')} className="cursor-pointer hover:bg-slate-50">
                        Set as Viewer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem onClick={() => handleDeactivate(user.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                        <ShieldOff className="mr-2 h-4 w-4" /> Deactivate Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">No users found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}