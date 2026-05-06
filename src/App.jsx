import { useEffect, useRef, useState } from "react";

export default function PdfRefreshPrototype() {
  const initialEventName = "Наименование мероприятия";
  const [value, setValue] = useState("");
  const [pdfText, setPdfText] = useState(initialEventName);
  const [status, setStatus] = useState("saved");
  const timerRef = useRef(null);
  const hideUpdatedRef = useRef(null);

  const statusLabel = {
    typing: "Ввод…",
    waiting: "Ждём паузу 400ms",
    updating: "Обновляем документ…",
    updated: "Обновлено",
    saved: "СОХРАНЕНО",
  }[status];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideUpdatedRef.current) clearTimeout(hideUpdatedRef.current);
    };
  }, []);

  function handleChange(event) {
    const nextValue = event.target.value;
    setValue(nextValue);
    setStatus("typing");

    if (timerRef.current) clearTimeout(timerRef.current);
    if (hideUpdatedRef.current) clearTimeout(hideUpdatedRef.current);

    requestAnimationFrame(() => setStatus("waiting"));

    timerRef.current = setTimeout(() => {
      setStatus("updating");

      setTimeout(() => {
        setPdfText(nextValue.trim() || initialEventName);
        setStatus("updated");

        hideUpdatedRef.current = setTimeout(() => {
          setStatus("saved");
        }, 1000);
      }, 180);
    }, 400);
  }

  const isUpdating = status === "updating";

  return (
      <div className="min-h-screen bg-[#F4F4F7] p-10 font-sans text-[#1F1F24]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              Обновление документа после ввода
            </h1>
            <p className="text-[#666A7A] text-lg">
              PDF изначально показывает шаблонное значение. После ввода и debounce страница обновляется и заменяет его на введённый текст.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E7E8EE]">
            <div className="flex items-center gap-3 mb-8 text-sm text-[#666A7A]">
              <div className={`px-3 py-1 rounded-full font-medium transition-colors duration-150 ${
                  status === "updated"
                      ? "bg-[#EEF6EF] text-[#1C8C4A]"
                      : status === "updating" || status === "waiting" || status === "typing"
                          ? "bg-[#FFF7E6] text-[#B76E00]"
                          : "bg-[#EEF6EF] text-[#1C8C4A]"
              }`}>
                {statusLabel}
              </div>
              <span>14:45</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Наименование мероприятия
                </label>

                <div className="relative">
                  <input
                      value={value}
                      onChange={handleChange}
                      placeholder="Введите новое наименование мероприятия"
                      className="w-full h-14 px-4 pr-40 rounded-2xl border border-[#C9CCDA] bg-white text-lg outline-none focus:border-[#3B63F6] focus:ring-4 focus:ring-[#3B63F6]/10 transition-all duration-150"
                  />

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#667085] pointer-events-none">
                    {status === "waiting" ? "400ms…" : "debounce 400ms"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E4E6EF] overflow-hidden bg-[#FAFAFC]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECEEF5] bg-white">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${status === "saved" ? "bg-[#12B76A]" : "bg-[#FFB020] animate-pulse"}`} />
                    <span className="text-sm font-medium text-[#5E6475]">
                    {statusLabel}
                  </span>
                  </div>

                  <div className="text-sm text-[#98A0B3]">
                    fade-out 120ms → refresh → fade-in 180ms
                  </div>
                </div>

                <div className="relative h-[520px] flex items-center justify-center bg-[#F8F9FC] overflow-hidden">
                  <div className="absolute inset-0 bg-black/5" />

                  <div
                      className={`relative w-[360px] h-[470px] bg-white rounded-xl shadow-md border border-[#E5E7F0] p-8 transition-all ${
                          isUpdating
                              ? "opacity-70 scale-[0.985] duration-[120ms]"
                              : "opacity-100 scale-100 duration-[180ms]"
                      }`}
                  >
                    <div className="w-16 h-16 mx-auto mb-8 rounded-md border border-[#DADDE7]" />

                    <div className="space-y-4 text-center">
                      <div className="text-sm font-semibold text-[#2E3445] leading-snug">
                        {pdfText}
                      </div>
                      <div className="h-4 bg-[#ECEEF5] rounded w-2/3 mx-auto" />
                    </div>

                    <div className="mt-12 space-y-3">
                      <div className="h-3 bg-[#F0F2F7] rounded" />
                      <div className="h-3 bg-[#F0F2F7] rounded" />
                      <div className="h-3 bg-[#F0F2F7] rounded w-5/6" />
                      <div className="h-3 bg-[#F0F2F7] rounded w-4/6" />
                    </div>

                    {status === "updating" && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#F5F7FB] border border-[#E2E5EF] text-sm text-[#5E6475]">
                          PDF refresh...
                        </div>
                    )}

                    {status === "updated" && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#EEF6EF] border border-[#CDEFD8] text-sm text-[#1C8C4A]">
                          Обновлено
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#F7F8FC] rounded-2xl p-6 border border-[#E8EAF2]">
                  <div className="text-sm text-[#667085] mb-3">
                    Тайминги
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Debounce</span>
                      <span className="font-medium">400 ms</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Fade-out PDF</span>
                      <span className="font-medium">120 ms</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Fade-in PDF</span>
                      <span className="font-medium">180 ms</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Toast “Обновлено”</span>
                      <span className="font-medium">800–1200 ms</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F7F8FC] rounded-2xl p-6 border border-[#E8EAF2]">
                  <div className="text-sm text-[#667085] mb-3">
                    Последовательность
                  </div>

                  <div className="space-y-2 text-sm leading-relaxed text-[#4F5565]">
                    <div>1. Пользователь вводит текст</div>
                    <div>2. Ждём 400ms паузы</div>
                    <div>3. PDF становится полупрозрачным</div>
                    <div>4. Пересобираем документ</div>
                    <div>5. Шаблонное значение заменяется введённым</div>
                    <div>6. Показываем статус “Сохранено”</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
