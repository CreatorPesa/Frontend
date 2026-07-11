import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/dashboard/VerifiedBadge';
import type { CreatorProfile } from '@/types/creator';

export function CreatorHeader({ creator }: { creator: CreatorProfile }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Avatar src={creator.avatarUrl} name={creator.displayName} size={88} />
      <div>
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-xl font-semibold text-ink-900">{creator.displayName}</h1>
          <VerifiedBadge isVerified={creator.isVerified} />
        </div>
        <p className="text-sm text-ink-500">@{creator.handle}</p>
      </div>
      {creator.bio && <p className="max-w-md text-sm text-ink-600">{creator.bio}</p>}
    </div>
  );
}
