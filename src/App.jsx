import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchWeather = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const response = await fetch(`${API_URL}/api/weather/${city}`);

      if (!response.ok) throw new Error();

      const data = await response.json();
      setWeather(data);
    } catch {
      setError("City not found");
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    if (!weather) return "linear-gradient(135deg, #667eea, #764ba2)";
    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("cloud"))
      return "linear-gradient(135deg, #757f9a, #d7dde8)";
    if (condition.includes("rain"))
      return "linear-gradient(135deg, #314755, #26a0da)";
    if (condition.includes("clear"))
      return "linear-gradient(135deg, #f7971e, #ffd200)";
    if (condition.includes("night"))
      return "linear-gradient(135deg, #141e30, #243b55)";

    return "linear-gradient(135deg, #667eea, #764ba2)";
  };

  return (
    <div className="container" style={{ background: getBackground() }}>
      <div className="card">
        <h1 className="title">🌤 Weather Updates</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button onClick={fetchWeather} disabled={loading}>
            {loading ? "..." : "Search"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {loading && (
          <div className="loading">
            Loading weather...
          </div>
        )}

        {weather && (
          <div className="result">
            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt="icon"
              className="icon"
            />

            <h1 className="temp">
              {Math.round(weather.main.temp)}°C
            </h1>

            <p className="desc">
              {weather.weather[0].description}
            </p>

            <div className="details">
              <div>💧 {weather.main.humidity}%</div>
              <div>💨 {weather.wind.speed} m/s</div>
              <div>🌡 {Math.round(weather.main.feels_like)}°C</div>
              <div>☁ {weather.clouds.all}%</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.8s ease;
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
        }

        .card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(15px);
          padding: 40px;
          border-radius: 25px;
          text-align: center;
          color: white;
          width: 100%;
          max-width: 420px;
        }

        .title {
          margin-bottom: 25px;
          font-weight: 600;
        }

        .search {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        input {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: none;
          outline: none;
        }

        button {
          padding: 12px 18px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }

        button:hover {
          transform: scale(1.05);
        }

        .loading {
           margin-top: 20px;
           font-size: 18px;
           font-weight: 500;
           animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
           0% { opacity: 0.4; }
           50% { opacity: 1; }
           100% { opacity: 0.4; }
        }

        .result {
          animation: fadeIn 0.6s ease;
        }

        .icon {
          width: 100px;
          animation: float 3s ease-in-out infinite;
        }

        .temp {
          font-size: 48px;
          margin: 10px 0;
          animation: pop 0.4s ease;
        }

        .desc {
          text-transform: capitalize;
          margin-bottom: 15px;
        }

        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          font-size: 14px;
        }

        .error {
          color: #ff4d4d;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pop {
          from { transform: scale(0.8); }
          to { transform: scale(1); }
        }

        @media (max-width: 480px) {
          .details {
            grid-template-columns: 1fr;
          }

          .card {
            padding: 25px;
          }

          .temp {
            font-size: 40px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;