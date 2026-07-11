"use client";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 px-4 py-2 md:px-6 lg:px-8">
      <div className="rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            BiteScout is thinking
          </span>
          <span className="flex gap-0.5">
            <span
              className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
              style={{ animationDelay: "300ms" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
