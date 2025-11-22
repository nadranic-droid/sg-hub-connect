import { Link } from "react-router-dom";

interface PopularDistrictsProps {
  districts: string[];
}

export const PopularDistricts = ({ districts }: PopularDistrictsProps) => {
  return (
    <div>
      <h2 className="font-heading font-bold text-2xl mb-5">
        Popular Districts
      </h2>
      <ul className="space-y-0 border border-border rounded-lg overflow-hidden bg-white">
        {districts.map((district, index) => (
          <Link 
            key={district}
            to={`/neighbourhood/${district.toLowerCase().replace(/\s+/g, '-')}`}
            className={`block py-3 px-4 text-primary font-medium hover:bg-muted cursor-pointer transition-colors ${
              index !== districts.length - 1 ? "border-b border-border" : ""
            }`}
          >
            {district}
          </Link>
        ))}
      </ul>
    </div>
  );
};
