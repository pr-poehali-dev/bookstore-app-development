export const BOOKS = [
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

export const GENRES = ["Все", "Классика", "Исторический", "Фантастика", "Детектив"];
export const RECOMMENDATIONS = [BOOKS[0], BOOKS[2], BOOKS[5]];

export type Book = typeof BOOKS[0];
export type Tab = "catalog" | "search" | "cart" | "favorites" | "profile";

export interface CartItem {
  book: Book;
  qty: number;
}

export interface Bookmark {
  bookId: number;
  page: number;
  note: string;
}
