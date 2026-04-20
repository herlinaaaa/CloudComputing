import { useEffect, useState } from "react";

export default function App() {
  const [activities, setActivities] = useState([]);
  const [sensor, setSensor] = useState([]);

  const [form, setForm] = useState({
    judul_aktivitas: "",
    tanggal: "",
    deskripsi: "",
    kategori: "",
  });

  // 🔹 FETCH ACTIVITIES
  const fetchActivities = () => {
    fetch("http://localhost:3000/activities")
      .then((res) => res.json())
      .then(setActivities)
      .catch(console.error);
  };

  // 🔹 FETCH SENSOR
  const fetchSensor = () => {
    fetch("http://localhost:3000/sensor")
      .then((res) => res.json())
      .then(setSensor)
      .catch(console.error);
  };

  useEffect(() => {
    fetchActivities();
    fetchSensor();
  }, []);

  // 🔹 INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 SUBMIT ACTIVITY
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
        {activities.length === 0 ? (
          <p>Tidak ada data</p>
        ) : (
          activities.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3>{item.judul_aktivitas}</h3>
              <p><b>Tanggal:</b> {item.tanggal}</p>
              <p><b>Kategori:</b> {item.kategori}</p>
              <p>{item.deskripsi}</p>
            </div>
          ))
        )}
      </div>

      {/* ================= SENSOR ================= */}
      <div style={styles.section}>
        <h2>🌡 Sensor Data</h2>
        {sensor.length === 0 ? (
          <p>Tidak ada data sensor</p>
        ) : (
          sensor.map((item, index) => (
            <div key={index} style={styles.card}>
              <p><b>CO:</b> {item.co}</p>
              <p><b>Temperature:</b> {item.temperature}</p>
              <p><b>Humidity:</b> {item.humidity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 🎨 STYLE
const styles = {
  container: {
    maxWidth: "700px",
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