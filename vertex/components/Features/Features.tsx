const modules = [
  {
    title: "Горячая замена весов",
    detail: "Обновление модели без остановки инференса и без просадки latency.",
    span: "md:col-span-2",
  },
  {
    title: "Автоскейл по очереди",
    detail: "Кластер растёт быстрее, чем накапливается очередь запросов.",
    span: "",
  },
  {
    title: "Мультитенантность",
    detail: "Изоляция на уровне GPU-партиций, общий биллинг.",
    span: "",
  },
  {
    title: "Наблюдаемость на уровне токена",
    detail: "Трассировка каждого запроса: очередь → батч → генерация → выдача.",
    span: "md:col-span-2",
  },
];

export function Features() {
  return (
    <section id="features" className="relative bg-ink px-6 md:px-14 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs tracking-[0.3em] uppercase text-paper/50">Модули платформы</span>
        <h2 className="font-display uppercase text-paper text-4xl md:text-6xl mt-4 mb-14 max-w-2xl">
          Собрано для продакшена, не для демо
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/10">
          {modules.map((mod) => (
            <div key={mod.title} className={`bg-ink-soft p-8 ${mod.span}`}>
              <h3 className="font-display uppercase text-paper text-xl mb-3">{mod.title}</h3>
              <p className="text-paper/60 text-sm max-w-sm">{mod.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
