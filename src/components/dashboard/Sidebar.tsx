// components/dashboard/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "🏠" },
    { name: "Posts", href: "/dashboard/posts", icon: "📝" },
    { name: "Forms", href: "/dashboard/forms", icon: "📋" },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;