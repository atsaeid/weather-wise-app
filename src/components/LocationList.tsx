type LocationListProps = {
  locations: string[];
};

const LocationList = ({ locations }: LocationListProps) => {
  return (
    <div className="overflow-x-auto whitespace-nowrap px-4 my-2">
      {locations.map((loc, idx) => (
        <button
          key={idx}
          className="inline-block bg-white/10 text-white px-4 py-2 rounded-full mx-1 text-sm hover:bg-white/20 transition"
        >
          {loc}
        </button>
      ))}
    </div>
  );
};

export default LocationList;
