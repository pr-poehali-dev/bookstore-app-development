import { useState } from "react";
import { BOOKS, Tab, CartItem, Bookmark, Book } from "@/components/bookstore/types";
import BookDetail from "@/components/bookstore/BookDetail";
import BottomNav from "@/components/bookstore/BottomNav";
import TabScreens from "@/components/bookstore/TabScreens";

export default function Index() {
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

  const addToCart = (book: Book) => {
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
            onSetTab={setTab}
            onSetSelectedGenre={setSelectedGenre}
            onSetSearchQuery={setSearchQuery}
            onSelectBook={setSelectedBook}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onChangeQty={changeQty}
            onSetCart={setCart}
            onSetShowSettings={setShowSettings}
            onSetDarkMode={setDarkMode}
            onSetNotificationsOn={setNotificationsOn}
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
