import { MapPin } from "lucide-react";
import DestinationCard from "@/components/guides/DestinationCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useFetch } from "@/hooks/useFetch";

export default function DestinationsPage() {
  const { data, loading, error } = useFetch("/api/destinations");
  const destinations = data?.destinations || [];

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold mb-2">Destinations</h1>
      <p className="text-charcoal/60 dark:text-white/60 mb-8">Explore popular places across the country.</p>

      {loading ? (
        <LoadingSpinner full />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : destinations.length === 0 ? (
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
