type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata = {
  title: "Event Details",
};

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-20 lg:px-8">
      <h1 className="text-3xl font-semibold">Event: {slug}</h1>
      <p className="max-w-2xl text-slate-600 dark:text-slate-300">
        Placeholder route for dynamic event detail pages.
      </p>
    </section>
  );
}
