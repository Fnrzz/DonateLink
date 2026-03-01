'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link2, Monitor, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

interface ShareLinkCardProps {
  username: string;
  walletAddress: string;
}

function CopyRow({
  label,
  icon,
  url,
}: {
  label: string;
  icon: React.ReactNode;
  url: string;
}) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Copied to clipboard!', {
        description: url,
        icon: <Check className="h-4 w-4" />,
      });
    } catch {
      toast.error('Failed to copy');
    }
  }, [url]);

  return (
    <div className="flex items-center gap-3 border-2 border-border bg-surface-light p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-border bg-primary text-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted mb-0.5">{label}</p>
        <p className="text-sm font-bold text-text-primary truncate">{url}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="shrink-0"
      >
        <Copy className="h-3.5 w-3.5" />
        <span className="sr-only">Copy</span>
      </Button>
    </div>
  );
}

export function ShareLinkCard({ username, walletAddress }: ShareLinkCardProps) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : '';

  const donationUrl = `${origin}/${username}`;
  const overlayUrl = `${origin}/overlay/${walletAddress}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-surface-white border-2 border-border p-5 shadow-[4px_4px_0_#000]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center border-2 border-border bg-primary text-white">
          <Link2 className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-base font-black uppercase text-text-primary">
            Your Links
          </h3>
          <p className="text-xs font-bold text-text-muted">
            Share these links with your audience
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <CopyRow
          label="Donation Page"
          icon={<Link2 className="h-4 w-4" />}
          url={donationUrl}
        />
        <CopyRow
          label="OBS Overlay"
          icon={<Monitor className="h-4 w-4" />}
          url={overlayUrl}
        />
      </div>
    </motion.div>
  );
}
