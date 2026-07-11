import { cookies } from 'next/headers';
import { SplitConfigForm } from '@/components/dashboard/SplitConfigForm';
import { getMyCreatorProfile } from '@/lib/api/creators';
import { getSplitConfig } from '@/lib/api/splits';

export default async function SplitsPage() {
  const cookieHeader = cookies().toString();
  const creator = await getMyCreatorProfile(cookieHeader);
  const splitConfig = await getSplitConfig(creator.id, cookieHeader);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-ink-900">Revenue splits</h1>
      <SplitConfigForm creatorId={creator.id} initialRecipients={splitConfig.recipients} />
    </div>
  );
}
