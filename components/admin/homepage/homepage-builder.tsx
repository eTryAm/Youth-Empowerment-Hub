'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GripVertical, ArrowUp, ArrowDown, Save, Loader2, Layers } from 'lucide-react';
import { reorderHomepageSections, toggleHomepageSection } from '@/lib/actions/settings';
import { toast } from 'sonner';

interface Section {
  id: string;
  name: string;
  description: string | null;
  isVisible: boolean;
  order: number;
}

export function HomepageBuilder({ initialSections }: { initialSections: any[] }) {
  const [sections, setSections] = useState<Section[]>(
    initialSections.map((s, idx) => ({
      id: s.sectionKey,
      name: s.title,
      description: s.description || '',
      isVisible: s.visible ?? true,
      order: s.displayOrder ?? idx,
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    setSections(newSections);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    setSections(newSections);
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    const next = !current;
    setSections(sections.map(s => s.id === id ? { ...s, isVisible: next } : s));
    try {
      await toggleHomepageSection(id, next);
      toast.success('Section visibility updated');
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const orderData = sections.map((s, idx) => ({
        sectionKey: s.id,
        displayOrder: idx,
      }));
      await reorderHomepageSections(orderData);
      toast.success('Section display order saved successfully');
    } catch {
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Drag or use arrows to adjust order. Click save when finished.</span>
        </div>
        <Button onClick={handleSaveOrder} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Order
        </Button>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
            <GripVertical className="text-slate-400 cursor-grab" />
            <div className="flex flex-col gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-slate-100 cursor-pointer" onClick={() => moveUp(index)} disabled={index === 0}>
                <ArrowUp className="h-4 w-4 text-slate-700" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-slate-100 cursor-pointer" onClick={() => moveDown(index)} disabled={index === sections.length - 1}>
                <ArrowDown className="h-4 w-4 text-slate-700" />
              </Button>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{section.name}</h3>
              <p className="text-xs text-slate-500">{section.description || `Section key: ${section.id}`}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Visible</span>
                <Switch checked={section.isVisible} onCheckedChange={() => toggleVisibility(section.id, section.isVisible)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}