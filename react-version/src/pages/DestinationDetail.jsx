import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import GuideCard from "@/components/guides/GuideCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import MapEmbed from "@/components/shared/MapEmbed";
import NotFound from "@/pages/NotFound";
import { useFetch } from "@/hooks/useFetch";

export default function DestinationDetailPage() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/api/destinations/${id}`);

  if (loading) return <LoadingSpinner full />;
  // The API answers "not found" / "invalid id" for a missing destination => show the 404 page.
  if (error && /not found|invalid/i.test(error)) return <NotFound />;
  if (error) return <ErrorMessage message={error} />;

  const { destination, guides } = data;

  return (
    <div>
      <div className="relative h-64 bg-navy-950">
        {destination.image && (
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
