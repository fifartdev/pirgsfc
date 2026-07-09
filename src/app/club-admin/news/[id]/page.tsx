import { requireClubAdmin } from "@/lib/club-admin/auth";
import { notFound } from "next/navigation";
import { EditNewsForm, type NewsEditData } from "./EditNewsForm";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { payload } = await requireClubAdmin();
  const { id } = await params;
  if (!id) notFound();

  let article: NewsEditData;
  try {
    const doc = await payload.findByID({
      collection: "news",
      id,
      depth: 1,
    });

    const img = doc.featuredImage as { id?: string | number; url?: string } | null | undefined;

    const rawDate = doc.publishedDate as string | undefined;
    const publishedDate = rawDate ? rawDate.slice(0, 10) : undefined;

    article = {
      id: String(doc.id),
      title: (doc.title as string) ?? "",
      titleEn: (doc.titleEn as string | undefined) ?? undefined,
      excerpt: (doc.excerpt as string | undefined) ?? undefined,
      excerptEn: (doc.excerptEn as string | undefined) ?? undefined,
      author: (doc.author as string | undefined) ?? undefined,
      authorEn: (doc.authorEn as string | undefined) ?? undefined,
      status: (doc.status as string | undefined) ?? "draft",
      publishedDate,
      readingTime: (doc.readingTime as number | undefined) ?? 3,
      featuredImageId: img?.id != null ? String(img.id) : undefined,
      featuredImageUrl: img?.url ?? undefined,
    };
  } catch {
    notFound();
  }

  return <EditNewsForm article={article} />;
}
