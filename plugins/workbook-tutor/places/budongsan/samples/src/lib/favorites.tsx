// 관심 단지. 아직 저장하지 않아서 앱을 다시 열면 비어 있다(저장은 2-2 에서 배운다)
import { createContext, useContext, useState, type ReactNode } from "react";

type Favorites = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
};

const FavoritesContext = createContext<Favorites | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const value: Favorites = {
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) =>
      setIds((now) =>
        now.includes(id) ? now.filter((x) => x !== id) : [...now, id],
      ),
  };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): Favorites {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("FavoritesProvider 안에서만 쓸 수 있어요");
  return value;
}
