import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const UpcomingEvents = () => {
  return (
    <div>
      <h2 className="font-heading font-bold text-2xl mb-5">
        Upcoming Events
      </h2>
      <Card className="bg-[#eefdf8] border-none p-5 space-y-4">
        <h3 className="font-heading font-bold text-lg">
          Ramadan Bazaar Guide 2024
        </h3>
        <p className="text-muted-foreground text-sm">
          Get ready for the festivities with our complete guide.
        </p>
        <Link to="/events">
          <Button className="bg-primary text-white hover:bg-primary-dark font-semibold">
            View Events
          </Button>
        </Link>
      </Card>
    </div>
  );
};
