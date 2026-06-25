import { notFound } from "next/navigation";
import { getProfileByUsername } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import ProfilePage from "@/components/profile/ProfilePage";

interface UserProfileRouteProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfileRoute({ params }: UserProfileRouteProps) {
  const { username } = await params;
  const data = await getProfileByUsername(username);

  if (!data) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === data.profile.id;

  return <ProfilePage data={data} isOwner={isOwner} />;
}
