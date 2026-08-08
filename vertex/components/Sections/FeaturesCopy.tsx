const modules = [
  {
    title: "Горячая замена весов",
    detail: "Обновление модели без остановки инференса и без просадки latency.",
  },
  {
    title: "Автоскейл по очереди",
    detail: "Кластер растёт быстрее, чем накапливается очередь запросов.",
  },
  {
    title: "Мультитенантность",
    detail: "Изоляция на уровне GPU-партиций, общий биллинг.",
  },
  {
    title: "Наблюдаемость на уровне токена",
    detail: "Трассировка каждого запроса: очередь → батч → генерация → выдача.",
  },
];

export function FeaturesCopy() {
  return (
    <section
      id="features"
      className="relative min-h-[100dvh] w-full flex items-center px-6 md:px-14 py-24 pointer-events-none"
    >
      <div className="max-w-xl pointer-events-auto">
        <span className="text-xs tracking-[0.3em] uppercase text-paper/50">Модули платформы</span>
        <h2 className="font-display uppercase text-paper text-4xl md:text-6xl mt-4 mb-10">
          Собрано для продакшена, не для демо
        </h2>
        <div className="flex flex-col gap-6">
          {modules.map((mod) => (
            <div key={mod.title}>
              <h3 className="font-display uppercase text-paper text-lg mb-1">{mod.title}</h3>
              <p className="text-paper/60 text-sm max-w-sm">{mod.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
