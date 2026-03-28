import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, List, GitBranch } from "lucide-react";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/applications", label: "Apps", icon: List },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-sidebar-primary flex items-center justify-center">
          <GitBranch className="w-3.5 h-3.5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-sm font-bold text-sidebar-accent-foreground">GitOps</span>
      </div>
      <nav className="flex gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
