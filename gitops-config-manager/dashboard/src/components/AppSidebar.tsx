import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, List, GitBranch, Terminal } from "lucide-react";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: List },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-sidebar-accent-foreground">GitOps</p>
          <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Config Manager</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <Terminal className="w-4 h-4 text-sidebar-foreground/50" />
          <span className="text-xs text-sidebar-foreground/50 font-mono">
            {import.meta.env.VITE_USE_MOCKS !== "false" ? "Mock Mode" : "Live"}
          </span>
        </div>
      </div>
    </aside>
  );
}
