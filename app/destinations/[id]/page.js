import { connectDB } from "@/lib/db";
import Destination from "@/models/Destination";
import Guide from "@/models/Guide";
import { notFound } from "next/navigation";
import GuideCard from "@/components/guides/GuideCard";
import EmptyState from "@/components/ui/EmptyState";
import MapEmbed from "@/components/shared/MapEmbed";
import { Users } from "lucide-react";
import { isValidObjectId, escapeRegex } from "@/utils/validators";

export const dynamic = "force-dynamic";


async function getData(id) {
  if (!isValidObjectId(id)) return null; // malformed id => genuine 404, not a server error
  await connectDB();
  const destination = await Destination.findById(id).lean();
  if (!destination) return null;
  const guides = await Guide.find({ status: "approved", location: { $regex: escapeRegex(destination.name), $options: "i" } })
    .populate("user", "name avatar")
    .lean();
  return JSON.parse(JSON.stringify({ destination, guides }));
}

export default async function DestinationDetailPage({ params }) {
  // Only "not found" becomes a 404. Real failures (database down, bad config) propagate to
  // app/error.js and into the server logs instead of being disguised as a missing page.
  const data = await getData(params.id);
  if (!data) return notFound();
  const { destination, guides } = data;

  return (
    <div>
      <div className="relative h-64 bg-navy-950">
        {destination.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={destination.image} alt={destination.name} className="h-full w-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="container-page pb-6 text-white">
            <h1 className="text-3xl font-extrabold">{destination.name}</h1>
            <p className="text-white/80">{destination.state}</p>
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        <p className="text-charcoal/70 dark:text-white/70 max-w-2xl mb-8">{destination.description}</p>

        <div className="mb-10 max-w-2xl">
          <MapEmbed location={`${destination.name}, ${destination.state}`} />
        </div>

        <h2 className="text-xl font-bold mb-4">Guides in {destination.name}</h2>

        {guides.length === 0 ? (
          <EmptyState icon={Users} title="No guides here yet" message="Check back soon or explore other destinations." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((g) => (
              <GuideCard
                key={g._id}
                id={g._id}
                name={g.user?.name}
                image={g.user?.avatar}
                location={g.location}
                rating={g.rating}
                reviewCount={g.reviewCount}
                price={g.pricePerDay}
                languages={g.languages}
                experience={g.experience}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
