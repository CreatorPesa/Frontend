import { OverlayFeed } from '@/components/overlay/OverlayFeed';

export default function OverlayPage({ params }: { params: { creatorId: string } }) {
  return <OverlayFeed creatorId={params.creatorId} />;
}
