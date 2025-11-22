import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarNavLinkProps {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SidebarNavLink = ({ to, icon, children, className }: SidebarNavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-glow-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
        className
      )}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span className="font-medium">{children}</span>
    </Link>
  );
};
