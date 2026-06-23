import { FormEvent, useEffect, useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useThreads } from '@/providers/thread';

/**
 * A small modal for renaming a conversation. Shared by the chat top-bar menu and
 * the sidebar session list so both edit titles the same way.
 */
export function RenameThreadDialog({
  initialTitle,
  onOpenChange,
  open,
  threadId,
}: {
  initialTitle: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  threadId: string | null;
}) {
  const { updateThreadTitle } = useThreads();
  const [value, setValue] = useState(initialTitle);

  // Reset the field to the current title each time the dialog opens.
  useEffect(() => {
    if (open) setValue(initialTitle);
  }, [open, initialTitle]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const title = value.trim();
    if (!threadId || !title) return;
    updateThreadTitle(threadId, title)
      .then(() => toast.success('Conversation renamed'))
      .catch((err) => {
        console.error(err);
        toast.error("Couldn't rename conversation");
      });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            aria-label="Conversation title"
            placeholder="Conversation title"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={!value.trim()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
