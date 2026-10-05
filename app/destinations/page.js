import { connectDB } from "@/lib/db";
import Destination from "@/models/Destination";
import DestinationCard from "@/components/guides/DestinationCard";
import EmptyState from "@/components/ui/EmptyState";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";


async function getDestinations() {
  await connectDB();
  const destinations = await Destination.find().sort({ isFeatured: -1, name: 1 }).lean();
  return JSON.parse(JSON.stringify(destinations));
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold mb-2">Destinations</h1>
      <p className="text-charcoal/60 dark:text-white/60 mb-8">Explore popular places across the country.</p>

      {destinations.length === 0 ? (
        <EmptyState icon={MapPin} title="No destinations yet" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((d) => (
            <DestinationCard key={d._id} id={d._id} name={d.name} state={d.state} image={d.image} guideCount={d.guideCount} />
          ))}
        </div>
      )}
    </div>
  );
}
