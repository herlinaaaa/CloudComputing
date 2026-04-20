import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function App() {
  const [activities, setActivities] = useState([]);
  const [logs, setLogs] = useState([]);

  const [form, setForm] = useState({
    judul_aktivitas: "",
    tanggal: "",
    deskripsi: "",
    kategori: "",
  });

  // ================= FETCH ACTIVITIES =================
  const fetchActivities = () => {
    fetch("http://localhost:3000/activities")
      .then((res) => res.json())
      .then(setActivities)
      .catch(console.error);
  };

  // ================= FETCH LOGS (CloudWatch) =================
  const fetchLogs = () => {
    fetch("http://localhost:3000/logs")
      .then((res) => res.json())
      .then(setLogs)
      .catch(console.error);
  };

  // ================= AUTO REFRESH =================
  useEffect(() => {
    fetchActivities();
    fetchLogs();

    const interval = setInterval(() => {
      fetchLogs();
    }, 5000); // 🔄 setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Date.now().toString(),
        ...form,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setForm({
          judul_aktivitas: "",
          tanggal: "",
          deskripsi: "",
          kategori: "",
        });
        fetchActivities();
      })
      .catch(console.error);
  };

  // ================= CHART DATA =================
  const chartData = {
    labels: logs.map((item) =>
      new Date(item.ts).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Temperature",
        data: logs.map((item) => item.temperature),
        borderWidth: 2,
      },
      {
        label: "Humidity",
        data: logs.map((item) => item.humidity),
        borderWidth: 2,
      },
      {
        label: "Light",
        data: logs.map((item) => item.light),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Dashboard</h1>

      {/* ================= FORM ================= */}
      <div style={styles.section}>
        <h2>➕ Tambah Aktivitas</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="judul_aktivitas"
            placeholder="Judul"
            value={form.judul_aktivitas}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="kategori"
            placeholder="Kategori"
            value={form.kategori}
            onChange={handleChange}
            style={styles.input}
          />
          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>
            Simpan
          </button>
        </form>
      </div>

      {/* ================= ACTIVITIES ================= */}
      <div style={styles.section}>
        <h2>📋 Activities</h2>
        {activities.map((item) => (
          <div key={item.id} style={styles.card}>
            <h3>{item.judul_aktivitas}</h3>
            <p><b>Tanggal:</b> {item.tanggal}</p>
            <p><b>Kategori:</b> {item.kategori}</p>
            <p>{item.deskripsi}</p>
          </div>
        ))}
      </div>

      {/* ================= CHART ================= */}
      <div style={styles.section}>
        <h2>📈 Sensor Chart (Real-time)</h2>
        <Line data={chartData} />
        <p>🔄 Update tiap 5 detik</p>
      </div>

      {/* ================= LOGS ================= */}
      <div style={styles.section}>
        <h2>📡 Sensor Logs</h2>
        {logs.map((item, index) => (
          <div key={index} style={styles.card}>
            <p><b>Device:</b> {item.device_id}</p>
            <p><b>Temp:</b> {item.temperature}°C</p>
            <p><b>Humidity:</b> {item.humidity}%</p>
            <p><b>Light:</b> {item.light}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= STYLE =================
const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
  },
  section: {
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginTop: "10px",
    backgroundColor: "#f9f9f9",
  },
};
