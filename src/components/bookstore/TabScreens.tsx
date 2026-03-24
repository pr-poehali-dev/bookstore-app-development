import Icon from "@/components/ui/icon";
import { Book, CartItem, Bookmark, Tab, BOOKS, GENRES, RECOMMENDATIONS } from "./types";

interface User { id: number; email: string; name: string; }

interface TabScreensProps {
  tab: Tab;
  selectedGenre: string;
  searchQuery: string;
  cart: CartItem[];
  favorites: number[];
  bookmarks: Bookmark[];
  filteredBooks: Book[];
  favoriteBooks: Book[];
  cartTotal: number;
  cartCount: number;
  showSettings: boolean;
  darkMode: boolean;
  notificationsOn: boolean;
  user: User;
  onSetTab: (tab: Tab) => void;
  onSetSelectedGenre: (genre: string) => void;
  onSetSearchQuery: (q: string) => void;
  onSelectBook: (book: Book) => void;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (book: Book) => void;
  onRemoveFromCart: (id: number) => void;
  onChangeQty: (id: number, delta: number) => void;
  onClearCart: () => void;
  onSetShowSettings: (val: boolean) => void;
  onSetDarkMode: (val: boolean) => void;
  onSetNotificationsOn: (val: boolean) => void;
  onLogout: () => void;
  notify: (msg: string) => void;
}

export default function TabScreens({
  tab,
  selectedGenre,
  searchQuery,
  cart,
  favorites,
  bookmarks,
  filteredBooks,
  favoriteBooks,
  cartTotal,
  cartCount,
  showSettings,
  darkMode,
  notificationsOn,
  user,
  onSetTab,
  onSetSelectedGenre,
  onSetSearchQuery,
  onSelectBook,
  onToggleFavorite,
  onAddToCart,
  onRemoveFromCart,
  onChangeQty,
  onClearCart,
  onSetShowSettings,
  onSetDarkMode,
  onSetNotificationsOn,
  onLogout,
  notify,
}: TabScreensProps) {
  return (
    <>
      {/* Settings overlay */}
      {showSettings && (
        <div
          className="fixed inset-0 z-40 bg-background animate-fade-in"
          style={{ maxWidth: 430, margin: "0 auto" }}
        >
          <div className="px-5 pt-12 pb-4 flex items-center gap-3">
            <button
              onClick={() => onSetShowSettings(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <h1 className="font-display text-3xl font-light">Настройки</h1>
          </div>
          <div className="px-5 mt-4 space-y-4">
            {[
              { label: "Тёмная тема", sub: "Переключить оформление", val: darkMode, set: onSetDarkMode },
              { label: "Уведомления", sub: "Push-уведомления о новинках", val: notificationsOn, set: onSetNotificationsOn },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-4">
                <div>
                  <p className="font-body font-medium text-sm">{s.label}</p>
                  <p className="text-muted-foreground text-xs font-body mt-0.5">{s.sub}</p>
                </div>
                <button
                  onClick={() => s.set(!s.val)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${s.val ? "bg-accent" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${s.val ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            ))}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {["Язык", "Валюта", "О приложении"].map((item, i, arr) => (
                <button
                  key={item}
                  className={`w-full flex items-center justify-between px-4 py-4 hover:bg-secondary transition-colors font-body text-sm ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                >
                  <span>{item}</span>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATALOG */}
      {tab === "catalog" && (
        <div className="animate-fade-in">
          <div className="px-5 pt-12 pb-4">
            <p className="text-muted-foreground text-xs font-body uppercase tracking-widest mb-1">Книжный магазин</p>
            <h1 className="font-display text-5xl font-light leading-tight">Фолиант</h1>
          </div>

          <div className="px-5 mb-6">
            <div className="bg-foreground text-background rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-accent/20 rounded-full" />
              <div className="absolute -right-2 bottom-0 w-20 h-20 bg-accent/10 rounded-full" />
              <p className="text-background/50 text-xs font-body uppercase tracking-widest mb-1">Рекомендуем</p>
              <h2 className="font-display text-2xl font-light mb-1 leading-tight relative z-10">{RECOMMENDATIONS[0].title}</h2>
              <p className="text-background/60 text-xs font-body mb-4 relative z-10">{RECOMMENDATIONS[0].author}</p>
              <button
                onClick={() => onSelectBook(RECOMMENDATIONS[0])}
                className="bg-background text-foreground text-xs font-body font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity relative z-10"
              >
                Подробнее
              </button>
            </div>
          </div>

          <div className="px-5 mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => onSetSelectedGenre(g)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-body font-medium border transition-all ${
                    selectedGenre === g
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5">
            <div className="grid grid-cols-2 gap-3">
              {filteredBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                  onClick={() => onSelectBook(book)}
                >
                  <div className="relative mb-2.5">
                    <img src={book.cover} alt={book.title} className="w-full h-52 object-cover rounded-xl" />
                    {!book.inStock && (
                      <div className="absolute inset-0 bg-background/70 rounded-xl flex items-center justify-center">
                        <span className="text-xs font-body text-foreground bg-background/90 px-2.5 py-1 rounded-full border border-border">
                          Нет в наличии
                        </span>
                      </div>
                    )}
                    {book.isNew && (
                      <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-body">
                        Новинка
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(book.id);
                        notify(favorites.includes(book.id) ? "Удалено из избранного" : "В избранное");
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
                    >
                      <Icon
                        name="Heart"
                        size={13}
                        className={favorites.includes(book.id) ? "text-accent fill-accent" : "text-muted-foreground"}
                      />
                    </button>
                  </div>
                  <p className="font-body font-medium text-xs leading-snug mb-0.5 line-clamp-2">{book.title}</p>
                  <p className="text-muted-foreground text-xs font-body mb-1.5">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-body font-semibold text-sm">{book.price.toLocaleString()} ₽</span>
                    <div className="flex items-center gap-0.5">
                      <Icon name="Star" size={10} className="text-accent fill-accent" />
                      <span className="text-xs font-body text-muted-foreground">{book.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH */}
      {tab === "search" && (
        <div className="animate-fade-in px-5 pt-12">
          <h1 className="font-display text-5xl font-light mb-6">Поиск</h1>
          <div className="relative mb-6">
            <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Название или автор..."
              value={searchQuery}
              onChange={(e) => onSetSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-transparent focus:border-accent rounded-xl pl-10 pr-4 py-3 text-sm font-body outline-none transition-colors"
            />
            {searchQuery && (
              <button onClick={() => onSetSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          {searchQuery === "" ? (
            <div>
              <p className="text-muted-foreground text-xs font-body uppercase tracking-widest mb-4">Жанры</p>
              <div className="grid grid-cols-2 gap-2">
                {GENRES.slice(1).map((g) => (
                  <button
                    key={g}
                    onClick={() => { onSetSelectedGenre(g); onSetTab("catalog"); }}
                    className="bg-secondary rounded-xl px-4 py-4 text-left hover:bg-accent hover:text-accent-foreground transition-colors group"
                  >
                    <p className="font-body text-sm font-medium">{g}</p>
                    <p className="font-body text-xs text-muted-foreground group-hover:text-accent-foreground/70">
                      {BOOKS.filter((b) => b.genre === g).length}{" "}
                      {BOOKS.filter((b) => b.genre === g).length === 1 ? "книга" : "книг"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground text-xs font-body mb-4">Найдено: {filteredBooks.length} книг</p>
              {filteredBooks.length === 0 ? (
                <div className="text-center py-16">
                  <Icon name="SearchX" size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-body text-sm">Ничего не найдено</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      className="flex gap-3 cursor-pointer hover:bg-secondary rounded-xl p-2.5 transition-colors"
                    >
                      <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg" />
                      <div className="flex-1 py-1">
                        <p className="font-body font-medium text-sm leading-snug mb-0.5">{book.title}</p>
                        <p className="text-muted-foreground text-xs font-body mb-2">{book.author}</p>
                        <span className="font-body font-semibold text-sm">{book.price.toLocaleString()} ₽</span>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground self-center" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CART */}
      {tab === "cart" && (
        <div className="animate-fade-in px-5 pt-12">
          <h1 className="font-display text-5xl font-light mb-6">Корзина</h1>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                <Icon name="ShoppingCart" size={32} className="text-muted-foreground" />
              </div>
              <p className="font-display text-2xl mb-2">Корзина пуста</p>
              <p className="text-muted-foreground font-body text-sm">Добавьте книги из каталога</p>
              <button
                onClick={() => onSetTab("catalog")}
                className="mt-6 bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-body hover:opacity-90 transition-opacity"
              >
                В каталог
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-5">
                {cart.map((item) => (
                  <div key={item.book.id} className="flex gap-3 bg-card border border-border rounded-xl p-3">
                    <img src={item.book.cover} alt={item.book.title} className="w-16 object-cover rounded-lg" style={{ height: 88 }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-sm leading-snug mb-0.5 truncate">{item.book.title}</p>
                      <p className="text-muted-foreground text-xs font-body mb-3">{item.book.author}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onChangeQty(item.book.id, -1)}
                            className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center hover:bg-border transition-colors"
                          >
                            <Icon name="Minus" size={12} />
                          </button>
                          <span className="font-body font-medium text-sm">{item.qty}</span>
                          <button
                            onClick={() => onChangeQty(item.book.id, 1)}
                            className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center hover:bg-border transition-colors"
                          >
                            <Icon name="Plus" size={12} />
                          </button>
                        </div>
                        <span className="font-body font-semibold text-sm">
                          {(item.book.price * item.qty).toLocaleString()} ₽
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.book.id)}
                      className="self-start p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-secondary rounded-2xl p-4 mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-muted-foreground font-body text-sm">Товаров</span>
                  <span className="font-body text-sm">{cartCount} шт.</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-body font-medium">Итого</span>
                  <span className="font-display text-2xl">{cartTotal.toLocaleString()} ₽</span>
                </div>
              </div>

              <button
                onClick={onClearCart}
                className="w-full bg-foreground text-background py-4 rounded-xl font-body font-medium hover:opacity-90 transition-opacity"
              >
                Оформить заказ
              </button>
            </>
          )}
        </div>
      )}

      {/* FAVORITES */}
      {tab === "favorites" && (
        <div className="animate-fade-in px-5 pt-12">
          <h1 className="font-display text-5xl font-light mb-6">Избранное</h1>
          {favoriteBooks.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                <Icon name="Heart" size={32} className="text-muted-foreground" />
              </div>
              <p className="font-display text-2xl mb-2">Список пуст</p>
              <p className="text-muted-foreground font-body text-sm">Нажимайте ♥ на обложке книги</p>
            </div>
          ) : (
            <div className="space-y-2">
              {favoriteBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="flex gap-3 cursor-pointer hover:bg-secondary rounded-xl p-2.5 transition-colors"
                >
                  <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg" />
                  <div className="flex-1 py-1">
                    <p className="font-body font-medium text-sm leading-snug mb-0.5">{book.title}</p>
                    <p className="text-muted-foreground text-xs font-body mb-2">{book.author}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-body font-semibold text-sm">{book.price.toLocaleString()} ₽</span>
                      <div className="flex items-center gap-0.5">
                        <Icon name="Star" size={10} className="text-accent fill-accent" />
                        <span className="text-xs font-body text-muted-foreground">{book.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(book.id);
                      notify("Удалено из избранного");
                    }}
                    className="self-center p-1 text-accent"
                  >
                    <Icon name="Heart" size={18} className="fill-accent" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE */}
      {tab === "profile" && (
        <div className="animate-fade-in px-5 pt-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-muted-foreground text-xs font-body uppercase tracking-widest mb-1">Профиль</p>
              <h1 className="font-display text-5xl font-light">{user.name}</h1>
              <p className="text-muted-foreground text-xs font-body mt-1">{user.email}</p>
            </div>
            <button
              onClick={() => onSetShowSettings(true)}
              className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-border transition-colors"
            >
              <Icon name="Settings" size={18} className="text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              { label: "Куплено", value: "14" },
              { label: "Избранное", value: String(favorites.length) },
              { label: "Закладки", value: String(bookmarks.length) },
            ].map((s) => (
              <div key={s.label} className="bg-secondary rounded-xl p-3 text-center">
                <p className="font-display text-3xl font-light">{s.value}</p>
                <p className="text-muted-foreground text-xs font-body mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-xs font-body uppercase tracking-widest mb-3">Рекомендации</p>
          <div className="space-y-1 mb-7">
            {RECOMMENDATIONS.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="flex gap-3 cursor-pointer hover:bg-secondary rounded-xl p-2.5 transition-colors"
              >
                <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
                <div className="flex-1 py-1">
                  <p className="font-body text-sm font-medium leading-snug">{book.title}</p>
                  <p className="text-muted-foreground text-xs font-body">{book.author}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground self-center" />
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            {[
              { icon: "ShoppingBag", label: "История заказов" },
              { icon: "Bookmark", label: "Мои закладки", badge: bookmarks.length || undefined },
              { icon: "Bell", label: "Уведомления" },
              { icon: "HelpCircle", label: "Поддержка" },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-secondary transition-colors ${
                  i < arr.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <Icon name={item.icon} size={18} className="text-muted-foreground" />
                <span className="flex-1 text-left font-body text-sm">{item.label}</span>
                {item.badge ? (
                  <span className="bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-body">
                    {item.badge}
                  </span>
                ) : null}
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors font-body text-sm"
          >
            <Icon name="LogOut" size={16} />
            Выйти из аккаунта
          </button>
        </div>
      )}
    </>
  );
}