import Link from "next/link";
import { readPublicCollection } from "@/lib/public-content";
export default async function CollaborationsPage() {
  const partners = await readPublicCollection("partners").catch(() => []);
  return <div className="container-shell space-y-8 py-32"><h1 className="text-4xl font-bold text-white">Collaborations & Partners</h1><div className="grid gap-5 md:grid-cols-3">{partners.map(partner => <article key={partner.id} className="rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="text-lg font-semibold text-white">{partner.name}</h2><p className="mt-3 text-sm text-zinc-400">{partner.description}</p>{partner.website_url && <a className="mt-4 block text-sm text-blue-400" href={partner.website_url} target="_blank" rel="noreferrer">Visit partner website</a>}</article>)}</div>{!partners.length && <p className="text-zinc-400">Partner information is currently unavailable.</p>}<Link href="/collaborate" className="inline-block rounded-full bg-blue-500 px-5 py-3 text-sm text-white">Propose a collaboration</Link></div>;
}
