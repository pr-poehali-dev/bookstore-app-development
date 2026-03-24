import Icon from "@/components/ui/icon";
import { Book, Bookmark } from "./types";

interface BookDetailProps {
  book: Book;
  favorites: number[];
  bookmarks: Bookmark[];
  bookmarkPage: string;
  bookmarkNote: string;
  showBookmarkForm: boolean;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (book: Book) => void;
  onSetBookmarkPage: (val: string) => void;
  onSetBookmarkNote: (val: string) => void;
  onSetShowBookmarkForm: (val: boolean) => void;
  onAddBookmark: (bookId: number) => void;
  onRemoveBookmark: (index: number) => void;
  notify: (msg: string) => void;
}

export default function BookDetail({
  book,
  favorites,
  bookmarks,
  bookmarkPage,
  bookmarkNote,
  showBookmarkForm,
  onClose,
  onToggleFavorite,
  onAddToCart,
  onSetBookmarkPage,
  onSetBookmarkNote,
  onSetShowBookmarkForm,
  onAddBookmark,
  onRemoveBookmark,
  notify,
}: BookDetailProps) {
  const bookBookmarks = bookmarks
    .map((b, i) => ({ ...b, originalIndex: i }))
    .filter((b) => b.bookId === book.id);

  return (
    <div
      className="fixed inset-0 z-40 bg-background animate-fade-in overflow-y-auto"
      style={{ maxWidth: 430, margin: "0 auto" }}
    >
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={18} />
          <span className="text-sm font-body">Назад</span>
        </button>
        <button
          onClick={() => {
            onToggleFavorite(book.id);
            notify(favorites.includes(book.id) ? "Удалено из избранного" : "Добавлено в избранное");
          }}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <Icon
            name="Heart"
            size={20}
            className={favorites.includes(book.id) ? "text-accent fill-accent" : "text-muted-foreground"}
          />
        </button>
      </div>

      <div className="px-5 pb-36">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img src={book.cover} alt={book.title} className="w-44 h-64 object-cover rounded-xl shadow-2xl" />
            {book.isBestseller && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2.5 py-1 rounded-full font-body font-medium">
                Бестселлер
              </span>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-light mb-1 leading-tight">{book.title}</h1>
          <p className="text-muted-foreground font-body text-sm mb-2">{book.author}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex items-center gap-0.5">
              <Icon name="Star" size={13} className="text-accent fill-accent" />
              <span className="text-sm font-body font-medium">{book.rating}</span>
            </div>
            <span className="text-border">·</span>
            <span className="text-muted-foreground text-sm font-body">{book.pages} стр.</span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground text-sm font-body">{book.genre}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-display text-xl mb-2">О книге</h3>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">{book.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-xl">Закладки</h3>
            <button
              onClick={() => onSetShowBookmarkForm(!showBookmarkForm)}
              className="text-sm text-accent font-body flex items-center gap-1"
            >
              <Icon name="Plus" size={14} />Добавить
            </button>
          </div>

          {showBookmarkForm && (
            <div className="bg-secondary rounded-xl p-4 mb-3 animate-slide-up space-y-2">
              <input
                type="number"
                placeholder="Страница"
                value={bookmarkPage}
                onChange={(e) => onSetBookmarkPage(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:border-accent transition-colors"
              />
              <input
                type="text"
                placeholder="Заметка (необязательно)"
                value={bookmarkNote}
                onChange={(e) => onSetBookmarkNote(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={() => onAddBookmark(book.id)}
                className="w-full bg-foreground text-background py-2.5 rounded-lg text-sm font-body font-medium hover:opacity-90 transition-opacity"
              >
                Сохранить
              </button>
            </div>
          )}

          {bookBookmarks.length === 0 ? (
            <p className="text-muted-foreground text-sm font-body">Нет сохранённых закладок</p>
          ) : (
            <div className="space-y-2">
              {bookBookmarks.map((bm) => (
                <div key={bm.originalIndex} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon name="Bookmark" size={13} className="text-accent fill-accent" />
                      <span className="text-sm font-body font-medium">Стр. {bm.page}</span>
                    </div>
                    {bm.note && (
                      <p className="text-xs text-muted-foreground font-body mt-0.5 ml-5">{bm.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveBookmark(bm.originalIndex)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
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
          <span className="font-display text-2xl">{book.price.toLocaleString()} ₽</span>
          {!book.inStock && <span className="text-destructive text-sm font-body">Нет в наличии</span>}
        </div>
        <button
          onClick={() => { if (book.inStock) { onAddToCart(book); onClose(); } }}
          disabled={!book.inStock}
          className="w-full bg-foreground text-background py-3.5 rounded-xl font-body font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {book.inStock ? "В корзину" : "Нет в наличии"}
        </button>
      </div>
    </div>
  );
}
