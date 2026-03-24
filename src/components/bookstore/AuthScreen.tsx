import { useState } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface AuthScreenProps {
  onSuccess: (user: { id: number; email: string; name: string }, token: string) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = mode === "login"
        ? await api.auth.login(email, password)
        : await api.auth.register(email, password, name);

      if (res.error) {
        setError(res.error);
      } else {
        localStorage.setItem("session_token", res.token);
        onSuccess(res.user, res.token);
      }
    } catch {
      setError("Ошибка соединения. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container flex flex-col min-h-dvh bg-background">
      <div className="flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="mb-12">
          <p className="text-muted-foreground text-xs font-body uppercase tracking-widest mb-2">Книжный магазин</p>
          <h1 className="font-display text-5xl font-light leading-tight">Фолиант</h1>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-3xl font-light mb-1">
            {mode === "login" ? "Добро пожаловать" : "Регистрация"}
          </h2>
          <p className="text-muted-foreground font-body text-sm">
            {mode === "login" ? "Войдите, чтобы продолжить" : "Создайте аккаунт"}
          </p>
        </div>

        <div className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5 block">Имя</label>
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary border border-transparent focus:border-accent rounded-xl px-4 py-3.5 text-sm font-body outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-transparent focus:border-accent rounded-xl px-4 py-3.5 text-sm font-body outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5 block">Пароль</label>
            <input
              type="password"
              placeholder={mode === "register" ? "Минимум 6 символов" : "Ваш пароль"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full bg-secondary border border-transparent focus:border-accent rounded-xl px-4 py-3.5 text-sm font-body outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm font-body bg-destructive/10 rounded-xl px-4 py-3">
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-foreground text-background py-4 rounded-xl font-body font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading && <Icon name="Loader" size={16} className="animate-spin" />}
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-muted-foreground font-body text-sm">
            {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          </span>
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-accent font-body text-sm font-medium hover:underline"
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}
