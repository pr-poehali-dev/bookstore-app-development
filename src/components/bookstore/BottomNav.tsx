import Icon from "@/components/ui/icon";
import { Tab } from "./types";

interface BottomNavProps {
  tab: Tab;
  cartCount: number;
  favoritesCount: number;
  onSetTab: (tab: Tab) => void;
}

const NAV_ITEMS = [
  { id: "catalog" as Tab, icon: "BookOpen", label: "Каталог" },
  { id: "search" as Tab, icon: "Search", label: "Поиск" },
  { id: "cart" as Tab, icon: "ShoppingCart", label: "Корзина" },
  { id: "favorites" as Tab, icon: "Heart", label: "Избранное" },
  { id: "profile" as Tab, icon: "User", label: "Профиль" },
];

export default function BottomNav({ tab, cartCount, favoritesCount, onSetTab }: BottomNavProps) {
  const getBadge = (id: Tab) => {
    if (id === "cart") return cartCount || undefined;
    if (id === "favorites") return favoritesCount || undefined;
    return undefined;
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur-sm border-t border-border px-2 pt-2 pb-6 z-30">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((t) => {
          const badge = getBadge(t.id);
          return (
            <button
              key={t.id}
              onClick={() => onSetTab(t.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon name={t.icon} size={22} className={tab === t.id ? "text-accent" : ""} />
                {badge ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-body">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] font-body ${tab === t.id ? "text-accent font-medium" : ""}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
