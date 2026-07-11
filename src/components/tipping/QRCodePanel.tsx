'use client';

import { QRCodeSVG } from 'qrcode.react';

export function QRCodePanel({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-ink-100 p-4">
      <QRCodeSVG value={url} size={128} />
      <p className="text-xs text-ink-500">Scan to tip on mobile</p>
    </div>
  );
}
