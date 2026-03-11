import WikiEditor from "@/components/wiki-editor";
import { stackServerApp } from "@/stack/server";

export default async function NewArticlePage() {
  const user = await stackServerApp.getUser({ or: "redirect" });
  return <WikiEditor isEditing={false} userId={user.id} />;
}
