import React, { useState } from "react";
import { Calendar, User, Tag, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Статические данные для блога
const blogPosts = [
  {
    id: 1,
    title: "Как выбрать идеальный натяжной потолок для вашего дома",
    excerpt:
      "При выборе натяжного потолка важно учитывать несколько ключевых факторов: тип помещения, его размеры, освещение и общий стиль интерьера.",
    content: "Полное содержимое статьи о выборе натяжного потолка...",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=800&auto=format&fit=crop",
    date: "20 апреля 2023",
    author: "Екатерина Иванова",
    tags: ["советы", "дизайн", "выбор потолка"],
  },
  {
    id: 2,
    title: "Тренды в дизайне натяжных потолков 2023 года",
    excerpt:
      "Новые тенденции в дизайне натяжных потолков включают использование геометрических форм, сочетание разных фактур и интеграцию с умными системами освещения.",
    content:
      "Полное содержимое статьи о трендах в дизайне натяжных потолков...",
    image:
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=800&auto=format&fit=crop",
    date: "15 марта 2023",
    author: "Максим Петров",
    tags: ["тренды", "дизайн", "интерьер"],
  },
  {
    id: 3,
    title: "Как ухаживать за натяжным потолком: советы профессионалов",
    excerpt:
      "Правильный уход за натяжным потолком продлит срок его службы и сохранит первоначальный внешний вид на долгие годы.",
    content: "Полное содержимое статьи об уходе за натяжным потолком...",
    image:
      "https://images.unsplash.com/photo-1630699144339-420f59b4747a?q=80&w=800&auto=format&fit=crop",
    date: "10 февраля 2023",
    author: "Алексей Соколов",
    tags: ["уход", "советы", "эксплуатация"],
  },
  {
    id: 4,
    title: "Натяжные потолки для разных помещений: спальня, гостиная, кухня",
    excerpt:
      "Для каждого типа помещения существуют свои рекомендации по выбору материала, фактуры и цвета натяжного потолка.",
    content:
      "Полное содержимое статьи о натяжных потолках для разных помещений...",
    image:
      "https://images.unsplash.com/photo-1603393517795-70234a385a66?q=80&w=800&auto=format&fit=crop",
    date: "20 января 2023",
    author: "Наталья Смирнова",
    tags: ["дизайн", "интерьер", "планировка"],
  },
  {
    id: 5,
    title: "Многоуровневые натяжные потолки: сложно, но эффектно",
    excerpt:
      "Многоуровневые натяжные потолки позволяют зонировать пространство, скрыть коммуникации и создать уникальный дизайн интерьера.",
    content: "Полное содержимое статьи о многоуровневых натяжных потолках...",
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop",
    date: "5 декабря 2022",
    author: "Сергей Волков",
    tags: ["многоуровневые", "дизайн", "сложные решения"],
  },
  {
    id: 6,
    title: "Натяжные потолки с фотопечатью: от идеи до реализации",
    excerpt:
      "Процесс создания натяжного потолка с фотопечатью включает несколько этапов: от выбора изображения до установки готового полотна.",
    content: "Полное содержимое статьи о натяжных потолках с фотопечатью...",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
    date: "18 ноября 2022",
    author: "Елена Кузнецова",
    tags: ["фотопечать", "дизайн", "креатив"],
  },
];

// Список всех тегов из постов блога для фильтрации
const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Фильтрация постов по поисковому запросу и выбранному тегу
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // Обработчики фильтрации
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prevTag) => (prevTag === tag ? null : tag));
  };

  return (
    <div className="max-w-5xl mx-auto py-12">
      {/* Заголовок */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Блог о натяжных потолках
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Полезные статьи, советы и идеи по выбору, установке и уходу за
          натяжными потолками
        </p>
      </div>

      {/* Поиск и фильтры */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Поиск по блогу..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="md:w-1/3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setSelectedTag(null);
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>

        {/* Теги */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Результаты поиска */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            По вашему запросу ничего не найдено.
          </p>
          <p className="text-gray-400">
            Попробуйте изменить параметры поиска или сбросить фильтры.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.date}</span>
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.author}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4">{post.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagClick(tag);
                      }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => alert(`Полная статья: ${post.content}`)}
                >
                  Читать полностью
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
