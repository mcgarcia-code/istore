import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Moon,
  Sun,
  Trash2,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ==========================
// Utilidades
// ==========================
const fmt = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

// Calcula precio según almacenamiento (bulto simple para demo)
function getPrice(basePrice, storage) {
  const bump = {
    64: 0,
    128: 0,
    256: 120,
    512: 320,
    1024: 620,
  }[storage] ?? 0;
  return basePrice + bump;
}

// ==========================
// Datos (ficticios)
// ==========================
const COLORS = {
  negro: "#0f1115",
  titanio: "#9a9fab",
  azul: "#3a5da8",
  blanco: "#f5f5f5",
  rojo: "#d12b2b",
  verde: "#18a06f",
  dorado: "#c7a35a",
};

const PRODUCTS = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    basePrice: 999,
    storages: [128, 256, 512, 1024],
    colors: ["titanio", "negro", "azul", "blanco"],
    tagline: "Titanio. Potencia Pro.",
    description:
      "El iPhone 15 Pro ofrece un rendimiento increíble con chip A17 y un diseño de titanio ultraligero.",
    rating: 4.9,
    featured: true,
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    basePrice: 799,
    storages: [128, 256, 512],
    colors: ["negro", "azul", "verde", "rojo", "blanco"],
    tagline: "Color y rendimiento para todos.",
    description:
      "Pantalla Super Retina XDR y cámara avanzada para fotos y videos increíbles.",
    rating: 4.7,
    featured: true,
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    basePrice: 699,
    storages: [128, 256, 512],
    colors: ["negro", "azul", "blanco", "rojo"],
    tagline: "Clásico y confiable.",
    description: "Gran batería y rendimiento sólido para el día a día.",
    rating: 4.6,
    featured: false,
  },
  {
    id: "iphone-se",
    name: "iPhone SE",
    basePrice: 499,
    storages: [64, 128, 256],
    colors: ["negro", "blanco", "rojo"],
    tagline: "Pequeño por fuera, gigante por dentro.",
    description:
      "El iPhone más accesible con chip rápido y el botón de inicio que amás.",
    rating: 4.4,
    featured: false,
  },
];

// ==========================
// SVG del teléfono (coloreable y accesible)
// ==========================
function PhoneSVG({ color = "#111827" }) {
  return (
    <svg viewBox="0 0 180 340" role="img" aria-label="Teléfono" className="w-full h-auto">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopOpacity=".8" stopColor={color} />
          <stop offset="100%" stopOpacity="1" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Cuerpo */}
      <rect x="15" y="10" width="150" height="320" rx="28" fill="url(#g)" />
      {/* Pantalla */}
      <rect x="25" y="40" width="130" height="260" rx="22" fill="#0b0f1a" />
      {/* Dynamic Island */}
      <rect x="70" y="50" width="40" height="10" rx="5" fill="#131a2a" />
      {/* Cámara trasera estilizada */}
      <circle cx="30" cy="30" r="9" fill="#0b0f1a" />
      <circle cx="50" cy="30" r="9" fill="#0b0f1a" />
      <circle cx="40" cy="18" r="5" fill="#0b0f1a" />
    </svg>
  );
}

// ==========================
// Componentes básicos
// ==========================
function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
      {children}
    </span>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "px-3 py-1 rounded-full text-sm border",
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white/50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-white"
      )}
    >
      {children}
    </button>
  );
}

function Button({ children, onClick, variant = "primary", disabled }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 dark:focus:ring-indigo-400",
    ghost:
      "bg-transparent text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/5 border border-indigo-200/60 dark:border-white/10",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
    muted:
      "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </select>
  );
}

// ==========================
// Card de producto
// ==========================
function ProductCard({ product, onAdd }) {
  const [storage, setStorage] = useState(product.storages[0]);
  const [color, setColor] = useState(product.colors[0]);
  const price = getPrice(product.basePrice, Number(storage));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="group rounded-3xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="relative p-5 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent">
        <div className="absolute right-4 top-4">
          {product.featured && <Badge>Destacado</Badge>}
        </div>
        <div className="aspect-[9/14] w-full flex items-center justify-center">
          <PhoneSVG color={COLORS[color]} />
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {product.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{product.tagline}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-600">{fmt.format(price)}</div>
          <div className="text-xs text-zinc-500">⭐ {product.rating}</div>
        </div>

        {/* Almacenamiento */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-500">Almacenamiento</label>
          <div className="flex flex-wrap gap-2">
            {product.storages.map((s) => (
              <Chip key={s} active={Number(storage) === s} onClick={() => setStorage(s)}>
                {s} GB
              </Chip>
            ))}
          </div>
        </div>

        {/* Colores */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-500">Color</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Elegir color ${c}`}
                className={classNames(
                  "h-8 w-8 rounded-full border-2 transition",
                  color === c ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                  "border-white/70 shadow",
                )}
                style={{ backgroundColor: COLORS[c] }}
              />
            ))}
          </div>
        </div>

        <Button onClick={() => onAdd(product, { storage: Number(storage), color, price })}>
          <ShoppingCart className="h-4 w-4" /> Agregar al carrito
        </Button>
      </div>
    </motion.div>
  );
}

// ==========================
// Drawer del carrito
// ==========================
function CartDrawer({ open, onClose, items, updateQty, removeItem, total, onCheckout }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.aside
            key="drawer"
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] bg-white dark:bg-zinc-900 z-50 shadow-2xl border-l border-zinc-200/60 dark:border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-200/60 dark:border-white/10">
              <h3 className="font-semibold text-lg">Tu carrito</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {items.length === 0 && (
                <p className="text-sm text-zinc-500">Aún no agregaste productos.</p>
              )}
              {items.map((it) => (
                <div
                  key={it.key}
                  className="flex gap-3 rounded-2xl border border-zinc-200/60 dark:border-white/10 p-3"
                >
                  <div className="w-16 shrink-0">
                    <PhoneSVG color={COLORS[it.color]} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-zinc-500">
                          {it.storage} GB · {it.color}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(it.key)}
                        className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm font-semibold">{fmt.format(it.price)}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(it.key, Math.max(1, it.qty - 1))}
                          className="px-2 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800"
                          aria-label="Restar"
                        >
                          −
                        </button>
                        <div className="w-8 text-center" aria-live="polite">{it.qty}</div>
                        <button
                          onClick={() => updateQty(it.key, it.qty + 1)}
                          className="px-2 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800"
                          aria-label="Sumar"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-200/60 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>{fmt.format(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{fmt.format(total)}</span>
              </div>
              <Button disabled={items.length === 0} onClick={onCheckout}>
                Finalizar compra
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ==========================
// Modal de Checkout (falso)
// ==========================
function CheckoutModal({ open, onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setAddress("");
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Checkout</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <Input value={name} onChange={setName} placeholder="Nombre y apellido" />
              <Input value={email} onChange={setEmail} placeholder="Email" type="email" />
              <Input value={address} onChange={setAddress} placeholder="Dirección" />
              <p className="text-xs text-zinc-500">
                * Este es un flujo de ejemplo. No se realiza ningún pago real.
              </p>
              <Button
                onClick={() => onConfirm({ name, email, address })}
                disabled={!name || !email || !address}
              >
                Confirmar pedido
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==========================
// Navegación / Tema
// ==========================
function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("istore_theme");
    if (saved) return saved === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("istore_theme", dark ? "dark" : "light");
  }, [dark]);
  return { dark, setDark };
}

function Navbar({ cartCount, onOpenCart, onSearch, search }) {
  const { dark, setDark } = useTheme();

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 bg-white/90 dark:bg-zinc-900/90 border-b border-white/20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-3 py-3">
          <div className="text-xl font-bold">
            <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">iStore</span>
          </div>
          <div className="hidden md:flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input value={search} onChange={onSearch} placeholder="Buscar iPhone…" />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}<span className="hidden sm:inline">Tema</span>
            </Button>
            <Button variant="ghost" onClick={onOpenCart}>
              <ShoppingCart className="h-4 w-4" />
              <span className="ml-1">{cartCount}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ==========================
// App principal
// ==========================
export default function App() {
  // Estado de filtros
  const [search, setSearch] = useState("");
  const [colorFilter, setColorFilter] = useState([]); // ["negro", "azul"]
  const [storageFilter, setStorageFilter] = useState([]); // [128, 256]
  const [sort, setSort] = useState("relevance"); // price-asc | price-desc
  const [maxPrice, setMaxPrice] = useState(1400);

  // Carrito
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("istore_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("istore_cart", JSON.stringify(cart));
  }, [cart]);

  const handleAdd = (product, { storage, color, price }) => {
    const key = `${product.id}-${storage}-${color}`;
    setCart((prev) => {
      const exists = prev.find((p) => p.key === key);
      if (exists) {
        return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + 1 } : p));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          storage,
          color,
          price,
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (key, qty) => setCart((prev) => prev.map((p) => (p.key === key ? { ...p, qty } : p)));
  const removeItem = (key) => setCart((prev) => prev.filter((p) => p.key !== key));
  const total = cart.reduce((acc, it) => acc + it.price * it.qty, 0);

  // Filtros + búsqueda + orden
  const filtered = useMemo(() => {
    let list = PRODUCTS.map((p) => ({
      ...p,
      minPrice: Math.min(...p.storages.map((s) => getPrice(p.basePrice, s))),
    }));

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.tagline, p.description].some((t) => t.toLowerCase().includes(q))
      );
    }

    if (colorFilter.length) {
      list = list.filter((p) => p.colors.some((c) => colorFilter.includes(c)));
    }

    if (storageFilter.length) {
      list = list.filter((p) => p.storages.some((s) => storageFilter.includes(String(s)) || storageFilter.includes(Number(s))));
    }

    list = list.filter((p) => p.minPrice <= maxPrice);

    if (sort === "price-asc") list = list.sort((a, b) => a.minPrice - b.minPrice);
    if (sort === "price-desc") list = list.sort((a, b) => b.minPrice - a.minPrice);

    return list;
  }, [search, colorFilter, storageFilter, sort, maxPrice]);

  // Hero
  const hero = (
    <section className="relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[1200px] rounded-full blur-3xl opacity-60 bg-gradient-to-r from-indigo-500 via-blue-500 to-fuchsia-500" />
      <div className="mx-auto max-w-7xl px-4 py-16 relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              iStore — <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">Tu tienda demo</span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 text-lg">
              Mini e‑commerce ficticio para mostrar en tu portfolio. Código limpio, diseño moderno y carrito funcional.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge>React</Badge>
              <Badge>Tailwind</Badge>
              <Badge>Framer Motion</Badge>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-8 -top-8 rotate-6 scale-90 hidden md:block">
              <div className="w-56 drop-shadow-2xl">
                <PhoneSVG color={COLORS.azul} />
              </div>
            </div>
            <div className="w-64 md:w-80 mx-auto">
              <PhoneSVG color={COLORS.titanio} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Panel de filtros
  const filters = (
    <section className="mx-auto max-w-7xl px-4 pb-6">
      <div className="rounded-3xl border border-zinc-200/60 dark:border-white/10 bg-white dark:bg-zinc-900 p-4">
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="col-span-2 flex items-center gap-2">
            <Search className="h-4 w-4 text-zinc-400" />
            <Input value={search} onChange={setSearch} placeholder="Buscar modelos…" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onChange={setSort}>
              <option value="relevance">Ordenar por: Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={storageFilter.join(",")}
              onChange={(v) => setStorageFilter(v.split(",").filter(Boolean))}
            >
              <option value="">Almacenamiento (todos)</option>
              {[64, 128, 256, 512, 1024].map((s) => (
                <option key={s} value={String(s)}>
                  {s} GB
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm whitespace-nowrap">Tope precio</label>
            <input
              type="range"
              min={400}
              max={1400}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm font-medium w-24 text-right">{fmt.format(maxPrice)}</div>
          </div>
          <div className="lg:col-span-5 pt-3 border-t border-zinc-200/60 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-500 mr-1">Colores:</span>
              {Object.keys(COLORS).map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    setColorFilter((prev) =>
                      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                    )
                  }
                  title={c}
                  className={classNames(
                    "h-7 w-7 rounded-full border-2",
                    colorFilter.includes(c) ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                    "border-white/70 shadow"
                  )}
                  style={{ backgroundColor: COLORS[c] }}
                />
              ))}
              {(colorFilter.length > 0 || storageFilter.length > 0 || search) && (
                <Button
                  variant="muted"
                  onClick={() => {
                    setColorFilter([]);
                    setStorageFilter([]);
                    setSearch("");
                    setMaxPrice(1400);
                    setSort("relevance");
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Grilla de productos
  const grid = (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-300">No se encontraron productos con esos filtros.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={handleAdd} />)
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );

  const handleCheckout = () => setCheckoutOpen(true);
  const confirmOrder = (data) => {
    // Simular compra
    alert(
      `¡Gracias ${data.name}! Tu pedido #${Math.floor(Math.random() * 100000)} fue recibido.\n\n(Esto es sólo una demo para portfolio)`
    );
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar
        cartCount={cart.reduce((a, b) => a + b.qty, 0)}
        onOpenCart={() => setCartOpen(true)}
        onSearch={setSearch}
        search={search}
      />

      {hero}
      {filters}
      {grid}

      <footer className="border-t border-white/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold">iStore</span> · demo hecha con ❤ para tu portfolio.
          </div>
          <div className="text-zinc-500">
            © {new Date().getFullYear()} — React · Tailwind · Framer Motion
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        updateQty={updateQty}
        removeItem={removeItem}
        total={total}
        onCheckout={handleCheckout}
      />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={confirmOrder} />
    </div>
  );
}
