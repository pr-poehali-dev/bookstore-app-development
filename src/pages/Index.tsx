import { useState, useEffect, useCallback } from "react";
import { BOOKS, Tab, CartItem, Bookmark, Book } from "@/components/bookstore/types";
import BookDetail from "@/components/bookstore/BookDetail";
import BottomNav from "@/components/bookstore/BottomNav";
import TabScreens from "@/components/bookstore/TabScreens";
import AuthScreen from "@/components/bookstore/AuthScreen";
import { api } from "@/lib/api";

interface User { id: number; email: string; name: string; }

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [tab, setTab] = useState<Tab>("catalog");
  const [selectedGenre, setSelectedGenre] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
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

  // Загружаем сессию при старте
  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) { setAuthChecked(true); return; }
    api.auth.me().then((res) => {
      if (res.user) setUser(res.user);
      else localStorage.removeItem("session_token");
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);

  // Загружаем корзину и избранное после входа
  const loadUserData = useCallback(async () => {
    const [cartRes, favRes] = await Promise.all([api.cart.get(), api.favorites.get()]);
    if (cartRes.items) {
      const items: CartItem[] = cartRes.items
        .map((i: { bookId: number; qty: number }) => {
          const book = BOOKS.find((b) => b.id === i.bookId);
          return book ? { book, qty: i.qty } : null;
        })
        .filter(Boolean) as CartItem[];
      setCart(items);
    }
    if (favRes.bookIds) setFavorites(favRes.bookIds);
  }, []);

  useEffect(() => {
    if (user) loadUserData();
  }, [user, loadUserData]);

  const handleAuthSuccess = (u: User) => {
    setUser(u);
  };

  const handleLogout = async () => {
    await api.auth.logout();
    localStorage.removeItem("session_token");
    setUser(null);
    setCart([]);
    setFavorites([]);
    setBookmarks([]);
    notify("Вы вышли из аккаунта");
  };

  // ─── Корзина ──────────────────────────────────────────────────
  const addToCart = async (book: Book) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.book.id === book.id);
      if (exists) return prev.map((i) => i.book.id === book.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { book, qty: 1 }];
    });
    notify("Добавлено в корзину");
    if (user) await api.cart.add(book.id, 1);
  };

  const removeFromCart = async (id: number) => {
    setCart((prev) => prev.filter((i) => i.book.id !== id));
    if (user) await api.cart.remove(id);
  };

  const changeQty = async (id: number, delta: number) => {
    let newQty = 1;
    setCart((prev) => {
      const updated = prev.map((i) => {
        if (i.book.id === id) { newQty = Math.max(1, i.qty + delta); return { ...i, qty: newQty }; }
        return i;
      });
      return updated;
    });
    if (user) await api.cart.update(id, newQty);
  };

  const clearCart = async () => {
    setCart([]);
    if (user) await api.cart.clear();
    notify("Заказ оформлен! Спасибо за покупку");
  };

  // ─── Избранное ────────────────────────────────────────────────
  const toggleFavorite = async (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
    if (user) await api.favorites.toggle(id);
  };

  // ─── Закладки ─────────────────────────────────────────────────
  const addBookmark = (bookId: number) => {
    const page = parseInt(bookmarkPage);
    if (isNaN(page) || page < 1) return;
    setBookmarks((prev) => [...prev, { bookId, page, note: bookmarkNote }]);
    setBookmarkPage("");
    setBookmarkNote("");
    setShowBookmarkForm(false);
    notify("Закладка сохранена");
  };

  const removeBookmark = (index: number) =>
    setBookmarks((prev) => prev.filter((_, i) => i !== index));

  const cartTotal = cart.reduce((s, i) => s + i.book.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const filteredBooks = BOOKS.filter((b) => {
    const genreMatch = selectedGenre === "Все" || b.genre === selectedGenre;
    const searchMatch =
      searchQuery === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return genreMatch && searchMatch;
  });

  const favoriteBooks = BOOKS.filter((b) => favorites.includes(b.id));

  if (!authChecked) {
    return (
      <div className="app-container flex items-center justify-center min-h-dvh">
        <div className="text-center">
          <p className="font-display text-4xl font-light mb-3">Фолиант</p>
          <p className="text-muted-foreground text-sm font-body">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-container">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm px-5 py-2.5 rounded-full shadow-lg animate-fade-in font-body whitespace-nowrap">
          {notification}
        </div>
      )}

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          favorites={favorites}
          bookmarks={bookmarks}
          bookmarkPage={bookmarkPage}
          bookmarkNote={bookmarkNote}
          showBookmarkForm={showBookmarkForm}
          onClose={() => { setSelectedBook(null); setShowBookmarkForm(false); }}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
          onSetBookmarkPage={setBookmarkPage}
          onSetBookmarkNote={setBookmarkNote}
          onSetShowBookmarkForm={setShowBookmarkForm}
          onAddBookmark={addBookmark}
          onRemoveBookmark={removeBookmark}
          notify={notify}
        />
      )}

      <div className="flex flex-col min-h-dvh">
        <div className="flex-1 overflow-y-auto pb-24">
          <TabScreens
            tab={tab}
            selectedGenre={selectedGenre}
            searchQuery={searchQuery}
            cart={cart}
            favorites={favorites}
            bookmarks={bookmarks}
            filteredBooks={filteredBooks}
            favoriteBooks={favoriteBooks}
            cartTotal={cartTotal}
            cartCount={cartCount}
            showSettings={showSettings}
            darkMode={darkMode}
            notificationsOn={notificationsOn}
            user={user}
            onSetTab={setTab}
            onSetSelectedGenre={setSelectedGenre}
            onSetSearchQuery={setSearchQuery}
            onSelectBook={setSelectedBook}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onChangeQty={changeQty}
            onClearCart={clearCart}
            onSetShowSettings={setShowSettings}
            onSetDarkMode={setDarkMode}
            onSetNotificationsOn={setNotificationsOn}
            onLogout={handleLogout}
            notify={notify}
          />
        </div>

        <BottomNav
          tab={tab}
          cartCount={cartCount}
          favoritesCount={favorites.length}
          onSetTab={setTab}
        />
      </div>
    </div>
  );
}
