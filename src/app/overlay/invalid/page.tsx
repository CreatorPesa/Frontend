export default function InvalidOverlayLinkPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-ink-50 px-4">
      <div className="flex flex-col items-center gap-2 rounded-xl border border-ink-100 bg-white p-8 text-center shadow-card">
        <p className="text-lg font-semibold text-ink-900">This overlay link isn&apos;t valid</p>
        <p className="max-w-sm text-sm text-ink-500">
          Copy the OBS Browser Source URL again from your dashboard&apos;s Settings page — this one
          is missing or has an invalid signature.
        </p>
      </div>
    </div>
  );
}
