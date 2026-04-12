import { useState, type FormEvent } from "react";
import { useDevVaultStore } from "../store/useDevVaultStore";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, register, isMutating, error, clearError } = useDevVaultStore();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "register") {
      await register({ name, email, password });
      return;
    }

    await login({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white/95 p-8 shadow-2xl shadow-slate-200/70 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <div className="mb-10 flex flex-col gap-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-sky-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            DevVault Authentication
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Access your personal study vault
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            Sign in or register to view only your own subjects, categories, and
            resources.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {(["login", "register"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                mode === option
                  ? "bg-slate-900 text-white dark:bg-emerald-400 dark:text-slate-950"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200"
              }`}
            >
              {option === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mb-6 rounded-3xl border border-red-200/70 bg-red-50/90 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            <div className="flex items-center justify-between gap-3">
              <span>{error}</span>
              <button onClick={clearError} className="font-semibold underline">
                Dismiss
              </button>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                Full name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
                required
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
              Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
              required
              minLength={8}
            />
          </label>

          <button
            type="submit"
            disabled={isMutating}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
          >
            {isMutating
              ? "Processing…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-semibold text-slate-900 underline dark:text-white"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-slate-900 underline dark:text-white"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
