import { getWeatherSummary } from "@/lib/weather";

export const revalidate = 1800;
export const dynamic = "force-dynamic";

function formatTime(time: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/New_York"
  }).format(new Date(time));
}

function getAdvice(probability: number, precipitationSum: number) {
  if (probability >= 70 || precipitationSum >= 5) {
    return "Alta probabilidade de chuva. Leve guarda-chuva e proteja-se contra pancadas.";
  }

  if (probability >= 40 || precipitationSum > 0) {
    return "Chance moderada de chuva. Recomenda-se ter um guarda-chuva à mão.";
  }

  return "Baixa probabilidade de chuva hoje em Nova York, mas fique atento a mudanças rápidas.";
}

export default async function Page() {
  let weather:
    | Awaited<ReturnType<typeof getWeatherSummary>>
    | null = null;
  let error: unknown = null;

  try {
    weather = await getWeatherSummary();
  } catch (err) {
    error = err;
  }

  return (
    <main className="viewport">
      <header className="header">
        <span className="badge">Previsão em tempo (quase) real</span>
        <span className="header-title">Vai chover hoje em Nova York?</span>
      </header>

      {weather ? (
        <>
          <section className="card highlight">
            <p className="eyebrow">Nova York • Hoje</p>
            <h1 className="headline">
              {weather.willRain ? "Sim, há chance de chuva hoje." : "Pouca chance de chuva hoje."}
            </h1>
            <p className="muted">{getAdvice(weather.probability, weather.precipitationSum)}</p>
            <dl className="metrics">
              <div>
                <dt>Probabilidade diária máxima</dt>
                <dd>{Math.round(weather.probability)}%</dd>
              </div>
              <div>
                <dt>Acúmulo previsto</dt>
                <dd>{weather.precipitationSum.toFixed(1)} mm</dd>
              </div>
              <div>
                <dt>Atualizado às</dt>
                <dd>
                  {new Intl.DateTimeFormat("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/New_York"
                  }).format(new Date(weather.updatedAt))}
                </dd>
              </div>
            </dl>
          </section>

          {weather.nextHours.length > 0 && (
            <section className="card">
              <h2 className="section-title">Próximas horas</h2>
              <p className="muted">
                Veja a probabilidade de chuva hora a hora para hoje em Nova York (horário local).
              </p>
              <div className="hourly-grid">
                {weather.nextHours.map((entry) => (
                  <div key={entry.time} className="hourly-item">
                    <span className="hour">{formatTime(entry.time)}</span>
                    <span className="probability">
                      {Math.round(entry.precipitationProbability)}%
                    </span>
                    <span className="precip">{entry.precipitation.toFixed(1)} mm</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="card error">
          <h1 className="headline">Não foi possível carregar a previsão.</h1>
          <p className="muted">
            Tente novamente em alguns instantes. Caso o problema persista, verifique sua conexão.
          </p>
          <pre className="error-box">{String(error)}</pre>
        </section>
      )}

      <footer className="footer">
        Dados fornecidos por{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        . Horários em America/New_York.
      </footer>
    </main>
  );
}
