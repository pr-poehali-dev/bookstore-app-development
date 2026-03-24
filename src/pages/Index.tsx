import { useState } from "react";
import Icon from "@/components/ui/icon";

const BOOKS = [
  {
    id: 1,
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    price: 690,
    genre: "Классика",
    rating: 4.9,
    pages: 480,
    cover: "https://cdn.poehali.dev/projects/7eb05c4f-94a6-43f4-a01a-ab49c537aaab/files/d5ee512d-a014-47bc-b9e8-d784fa637c9d.jpg",
    description: "Роман о вечной борьбе добра и зла, любви и предательства в Москве 1930-х годов.",
    inStock: true,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 2,
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    price: 590,
    genre: "Классика",
    rating: 4.8,
    pages: 592,
    cover: "https://cdn.poehali.dev/projects/7eb05c4f-94a6-43f4-a01a-ab49c537aaab/files/966fdfa7-fcdb-45d2-92bc-adecfdfcbb90.jpg",
    description: "История студента Раскольникова и его психологического падения и возрождения.",
    inStock: true,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 3,
    title: "Тихий Дон",
    author: "Михаил Шолохов",
    price: 820,
    genre: "Исторический",
    rating: 4.7,
    pages: 896,
    cover: "https://cdn.poehali.dev/projects/7eb05c4f-94a6-43f4-a01a-ab49c537aaab/files/865cda44-00b4-4d04-a46f-f0f52ae1bc67.jpg",
    description: "Эпическая сага о жизни донских казаков в переломные годы истории России.",
    inStock: true,
    isNew: true,
    isBestseller: false,
  },
  {
    id: 4,
    title: "Анна Каренина",
    author: "Лев Толстой",
    price: 750,
    genre: "Классика",
    rating: 4.8,
    pages: 864,
    cover: "https://cdn.poehali.dev/projects/7eb05c4f-94a6-43f4-a01a-ab49c537aaab/files/db4bf107-7478-473a-b15f-bdb34b85ea6e.jpg",
    description: "Трагическая история любви на фоне светского общества Российской империи.",
    inStock: false,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 5,
    title: "Отцы и дети",
    author: "Иван Тургенев",
    price: 450,
    genre: "Классика",
    rating: 4.5,
    pages: 320,
    cover: "https://cdn.poehali.dev/projects/7eb05c4f-94a6-43f4-a01a-ab49c537aaab/files/d5ee512d-a014-47bc-b9e8-d784fa637c9d.jpg",
    description: "Роман о конфликте поколений и нигилизме в России XIX века.",
    inStock: true,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 6,
    title: "Идиот",
    author: "Фёдор Достоевский",
    price: 620,
    genre: "Классика",
    rating: 4.7,
    pages: 640,
    cover: "https://cdn.poehali.dev/projects/7eb05c4f-94a6-43f4-a01a-ab49c537aaab/files/966fdfa7-fcdb-45d2-92bc-adecfdfcbb90.jpg",
    description: "История князя Мышкина — человека с чистой душой в несовершенном мире.",
    inStock: true,
    isNew: true,
    isBestseller: false,
  },
];

const GENRES = ["Все", "Классика", "Исторический", "Фантастика", "Детектив"];
const RECOMMENDATIONS = [BOOKS[0], BOOKS[2], BOOKS[5]];

type Tab = "catalog" | "search" | "cart" | "favorites" | "profile";

interface CartItem { book: typeof BOOKS[0]; qty: number; }
interface Bookmark { bookId: number; page: number; note: string; }

export default function Index() {
  const [tab, setTab] = useState<Tab>("catalog");
  const [selectedGenre, setSelectedGenre] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedBook, setSelectedBook] = useState<typeof BOOKS[0] | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkPage, setBookmarkPage] = useState("");
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [notification, setNotification] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2500);
  };

  const addToCart = (book: typeof BOOKS[0]) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.book.id === book.id);
      if (exists) return prev.map((i) => i.book.id === book.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { book, qty: 1 }];
    });
    notify("Добавлено в корзину");
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.book.id !== id));

  const changeQty = (id: number, delta: number) =>
    setCart((prev) => prev.map((i) => i.book.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const toggleFavorite = (id: number) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const addBookmark = (bookId: number) => {
    const page = parseInt(bookmarkPage);
    if (isNaN(page) || page < 1) return;
    setBookmarks((prev) => [...prev, { bookId, page, note: bookmarkNote }]);
    setBookmarkPage(""); setBookmarkNote(""); setShowBookmarkForm(false);
    notify("Закладка сохранена");
  };

  const cartTotal = cart.reduce((s, i) => s + i.book.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const filteredBooks = BOOKS.filter((b) => {
    const genreMatch = selectedGenre === "Все" || b.genre === selectedGenre;
    const searchMatch = searchQuery === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return genreMatch && searchMatch;
  });

  const favoriteBooks = BOOKS.filter((b) => favorites.includes(b.id));

  return (
    <div className="app-container">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm px-5 py-2.5 rounded-full shadow-lg animate-fade-in font-body whitespace-nowrap">
          {notification}
        </div>
      )}

      {/* Book Detail */}
      {selectedBook && (
        <div className="fixed inset-0 z-40 bg-background animate-fade-in overflow-y-auto" style={{ maxWidth: 430, margin: "0 auto" }}>
          <div className="flex items-center justify-between px-5 pt-12 pb-4">
            <button onClick={() => { setSelectedBook(null); setShowBookmarkForm(false); }} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="ArrowLeft" size={18} /><span className="text-sm font-body">Назад</span>
            </button>
            <button onClick={() => { toggleFavorite(selectedBook.id); notify(favorites.includes(selectedBook.id) ? "Удалено из избранного" : "Добавлено в избранное"); }}
              className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Icon name="Heart" size={20} className={favorites.includes(selectedBook.id) ? "text-accent fill-accent" : "text-muted-foreground"} />
            </button>
          </div>

          <div className="px-5 pb-36">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img src={selectedBook.cover} alt={selectedBook.title} className="w-44 h-64 object-cover rounded-xl shadow-2xl" />
                {selectedBook.isBestseller && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2.5 py-1 rounded-full font-body font-medium">Бестселлер</span>
                )}
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="font-display text-3xl font-light mb-1 leading-tight">{selectedBook.title}</h1>
              <p className="text-muted-foreground font-body text-sm mb-2">{selectedBook.author}</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div className="flex items-center gap-0.5">
                  <Icon name="Star" size={13} className="text-accent fill-accent" />
                  <span className="text-sm font-body font-medium">{selectedBook.rating}</span>
                </div>
                <span className="text-border">·</span>
                <span className="text-muted-foreground text-sm font-body">{selectedBook.pages} стр.</span>
                <span className="text-border">·</span>
                <span className="text-muted-foreground text-sm font-body">{selectedBook.genre}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-display text-xl mb-2">О книге</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{selectedBook.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xl">Закладки</h3>
                <button onClick={() => setShowBookmarkForm(!showBookmarkForm)} className="text-sm text-accent font-body flex items-center gap-1">
                  <Icon name="Plus" size={14} />Добавить
                </button>
              </div>

              {showBookmarkForm && (
                <div className="bg-secondary rounded-xl p-4 mb-3 animate-slide-up space-y-2">
                  <input type="number" placeholder="Страница" value={bookmarkPage} onChange={(e) => setBookmarkPage(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:border-accent transition-colors" />
                  <input type="text" placeholder="Заметка (необязательно)" value={bookmarkNote} onChange={(e) => setBookmarkNote(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:border-accent transition-colors" />
                  <button onClick={() => addBookmark(selectedBook.id)}
                    className="w-full bg-foreground text-background py-2.5 rounded-lg text-sm font-body font-medium hover:opacity-90 transition-opacity">
                    Сохранить
                  </button>
                </div>
              )}

              {bookmarks.filter((b) => b.bookId === selectedBook.id).length === 0 ? (
                <p className="text-muted-foreground text-sm font-body">Нет сохранённых закладок</p>
              ) : (
                <div className="space-y-2">
                  {bookmarks.filter((b) => b.bookId === selectedBook.id).map((bm, i) => (
                    <div key={i} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon name="Bookmark" size={13} className="text-accent fill-accent" />
                          <span className="text-sm font-body font-medium">Стр. {bm.page}</span>
                        </div>
                        {bm.note && <p className="text-xs text-muted-foreground font-body mt-0.5 ml-5">{bm.note}</p>}
                      </div>
                      <button onClick={() => setBookmarks((prev) => prev.filter((b, bi) => bi !== bookmarks.indexOf(bm)))}
                        className="text-muted-foreground hover:text-destructive transition-colors">
                        <Icon name="X" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background border-t border-border px-5 py-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-2xl">{selectedBook.price.toLocaleString()} ₽</span>
              {!selectedBook.inStock && <span className="text-destructive text-sm font-body">Нет в наличии</span>}
            </div>
            <button onClick={() => { if (selectedBook.inStock) { addToCart(selectedBook); setSelectedBook(null); } }}
              disabled={!selectedBook.inStock}
              className="w-full bg-foreground text-background py-3.5 rounded-xl font-body font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
              {selectedBook.inStock ? "В корзину" : "Нет в наличии"}
            </button>
          </div>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div className="fixed inset-0 z-40 bg-background animate-fade-in" style={{ maxWidth: 430, margin: "0 auto" }}>
          <div className="px-5 pt-12 pb-4 flex items-center gap-3">
            <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </button>
            <h1 className="font-display text-3xl font-light">Настройки</h1>
          </div>
          <div className="px-5 mt-4 space-y-4">
            {[
              { label: "Тёмная тема", sub: "Переключить оформление", val: darkMode, set: setDarkMode },
              { label: "Уведомления", sub: "Push-уведомления о новинках", val: notificationsOn, set: setNotificationsOn },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-4">
                <div>
                  <p className="font-body font-medium text-sm">{s.label}</p>
                  <p className="text-muted-foreground text-xs font-body mt-0.5">{s.sub}</p>
                </div>
                <button onClick={() => s.set(!s.val)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${s.val ? "bg-accent" : "bg-border"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${s.val ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            ))}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {["Язык", "Валюта", "О приложении"].map((item, i, arr) => (
                <button key={item} className={`w-full flex items-center justify-between px-4 py-4 hover:bg-secondary transition-colors font-body text-sm ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <span>{item}</span>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col min-h-dvh">
        <div className="flex-1 overflow-y-auto pb-24">

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
                  <button onClick={() => setSelectedBook(RECOMMENDATIONS[0])}
                    className="bg-background text-foreground text-xs font-body font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity relative z-10">
                    Подробнее
                  </button>
                </div>
              </div>

              <div className="px-5 mb-5">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {GENRES.map((g) => (
                    <button key={g} onClick={() => setSelectedGenre(g)}
                      className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-body font-medium border transition-all ${selectedGenre === g ? "bg-foreground text-background border-foreground" : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-5">
                <div className="grid grid-cols-2 gap-3">
                  {filteredBooks.map((book, i) => (
                    <div key={book.id} className="animate-slide-up cursor-pointer"
                      style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                      onClick={() => setSelectedBook(book)}>
                      <div className="relative mb-2.5">
                        <img src={book.cover} alt={book.title} className="w-full h-52 object-cover rounded-xl" />
                        {!book.inStock && (
                          <div className="absolute inset-0 bg-background/70 rounded-xl flex items-center justify-center">
                            <span className="text-xs font-body text-foreground bg-background/90 px-2.5 py-1 rounded-full border border-border">Нет в наличии</span>
                          </div>
                        )}
                        {book.isNew && (
                          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-body">Новинка</span>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id); notify(favorites.includes(book.id) ? "Удалено из избранного" : "В избранное"); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                          <Icon name="Heart" size={13} className={favorites.includes(book.id) ? "text-accent fill-accent" : "text-muted-foreground"} />
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
                <input autoFocus type="text" placeholder="Название или автор..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary border border-transparent focus:border-accent rounded-xl pl-10 pr-4 py-3 text-sm font-body outline-none transition-colors" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon name="X" size={14} />
                  </button>
                )}
              </div>

              {searchQuery === "" ? (
                <div>
                  <p className="text-muted-foreground text-xs font-body uppercase tracking-widest mb-4">Жанры</p>
                  <div className="grid grid-cols-2 gap-2">
                    {GENRES.slice(1).map((g) => (
                      <button key={g} onClick={() => { setSelectedGenre(g); setTab("catalog"); }}
                        className="bg-secondary rounded-xl px-4 py-4 text-left hover:bg-accent hover:text-accent-foreground transition-colors group">
                        <p className="font-body text-sm font-medium">{g}</p>
                        <p className="font-body text-xs text-muted-foreground group-hover:text-accent-foreground/70">
                          {BOOKS.filter(b => b.genre === g).length} {BOOKS.filter(b => b.genre === g).length === 1 ? "книга" : "книг"}
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
                        <div key={book.id} onClick={() => setSelectedBook(book)}
                          className="flex gap-3 cursor-pointer hover:bg-secondary rounded-xl p-2.5 transition-colors">
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
                  <button onClick={() => setTab("catalog")} className="mt-6 bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-body hover:opacity-90 transition-opacity">
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
                              <button onClick={() => changeQty(item.book.id, -1)} className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center hover:bg-border transition-colors">
                                <Icon name="Minus" size={12} />
                              </button>
                              <span className="font-body font-medium text-sm">{item.qty}</span>
                              <button onClick={() => changeQty(item.book.id, 1)} className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center hover:bg-border transition-colors">
                                <Icon name="Plus" size={12} />
                              </button>
                            </div>
                            <span className="font-body font-semibold text-sm">{(item.book.price * item.qty).toLocaleString()} ₽</span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.book.id)} className="self-start p-1 text-muted-foreground hover:text-destructive transition-colors">
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

                  <button onClick={() => { setCart([]); notify("Заказ оформлен! Спасибо за покупку"); }}
                    className="w-full bg-foreground text-background py-4 rounded-xl font-body font-medium hover:opacity-90 transition-opacity">
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
                    <div key={book.id} onClick={() => setSelectedBook(book)}
                      className="flex gap-3 cursor-pointer hover:bg-secondary rounded-xl p-2.5 transition-colors">
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
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id); notify("Удалено из избранного"); }}
                        className="self-center p-1 text-accent">
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
                  <h1 className="font-display text-5xl font-light">Анна К.</h1>
                </div>
                <button onClick={() => setShowSettings(true)} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-border transition-colors">
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
                  <div key={book.id} onClick={() => setSelectedBook(book)}
                    className="flex gap-3 cursor-pointer hover:bg-secondary rounded-xl p-2.5 transition-colors">
                    <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
                    <div className="flex-1 py-1">
                      <p className="font-body text-sm font-medium leading-snug">{book.title}</p>
                      <p className="text-muted-foreground text-xs font-body">{book.author}</p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground self-center" />
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {[
                  { icon: "ShoppingBag", label: "История заказов" },
                  { icon: "Bookmark", label: "Мои закладки", badge: bookmarks.length || undefined },
                  { icon: "Bell", label: "Уведомления" },
                  { icon: "HelpCircle", label: "Поддержка" },
                ].map((item, i, arr) => (
                  <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-secondary transition-colors ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                    <Icon name={item.icon} size={18} className="text-muted-foreground" />
                    <span className="flex-1 text-left font-body text-sm">{item.label}</span>
                    {item.badge ? (
                      <span className="bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-body">{item.badge}</span>
                    ) : null}
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur-sm border-t border-border px-2 pt-2 pb-6 z-30">
          <div className="flex items-center justify-around">
            {([
              { id: "catalog", icon: "BookOpen", label: "Каталог" },
              { id: "search", icon: "Search", label: "Поиск" },
              { id: "cart", icon: "ShoppingCart", label: "Корзина", badge: cartCount || undefined },
              { id: "favorites", icon: "Heart", label: "Избранное", badge: favorites.length || undefined },
              { id: "profile", icon: "User", label: "Профиль" },
            ] as const).map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <div className="relative">
                  <Icon name={t.icon} size={22} className={tab === t.id ? "text-accent" : ""} />
                  {t.badge ? (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-body">
                      {t.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[10px] font-body ${tab === t.id ? "text-accent font-medium" : ""}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}