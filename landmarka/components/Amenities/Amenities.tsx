const items = [
  { title: "Тёплый пол", detail: "По всему дому, включая террасу" },
  { title: "Умный дом", detail: "Свет, климат, охрана — с одного пульта" },
  { title: "Гараж на 2 авто", detail: "Отапливаемый, с зарядкой для электромобиля" },
  { title: "Собственный причал", detail: "5 минут пешком до воды" },
  { title: "Система фильтрации воды", detail: "От скважины до крана" },
  { title: "Охраняемый посёлок", detail: "Круглосуточный контроль въезда" },
];

export function Amenities() {
  return (
    <section id="amenities" className="relative bg-ink px-6 md:px-14 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs tracking-[0.3em] uppercase text-cream/50">Инфраструктура</span>
        <h2 className="font-display text-cream text-4xl md:text-6xl mt-4 mb-14 max-w-2xl">
          Всё уже включено
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/10 rounded-3xl overflow-hidden">
          {items.map((item) => (
            <div key={item.title} className="bg-ink-soft p-8">
              <h3 className="text-cream text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-cream/60 text-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
