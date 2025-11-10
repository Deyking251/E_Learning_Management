import React, { useMemo, useState } from "react";
import "./App.css";

const SAMPLE_TUTORS = [
  { id: 1, name: "Suhadip Roy", subjects: ["Math", "Physics"], rating: 4.8, fees: 500 },
  { id: 2, name: "Satrajit Roy", subjects: ["English", "History"], rating: 4.5, fees: 350 },
  { id: 3, name: "Anita Roy", subjects: ["Chemistry", "Biology"], rating: 4.9, fees: 650 },
  { id: 4, name: "Sahil Roy", subjects: ["CS", "Math"], rating: 4.6, fees: 450 }
];

const SAMPLE_STUDENTS = [
  { id: 1, name: "Kumar Rahul", grade: "10" },
  { id: 2, name: "Vikram Pandey", grade: "12" },
  { id: 3, name: "Maya Chakraborty", grade: "9" }
];

function Header({ onToggleSidebar, query, setQuery }) {
  return (
    <header className="hdr">
      <div className="hdr-left">
        <button className="icon-btn" onClick={onToggleSidebar} aria-label="toggle sidebar">☰</button>
        <h1 className="app-title">Tutor-Student LMS</h1>
      </div>
      <div className="hdr-right">
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tutors or subjects..."
        />
        <div className="signin">Signed in as <b>guest</b></div>
      <button
    className="btn"
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }}
  >
    Logout
  </button>
      </div>
    </header>
  );
}

function TutorCard({ tutor, onBook }) {
  return (
    <div className="card">
      <div className="card-row">
        <div>
          <h3 className="card-title">{tutor.name}</h3>
          <div className="muted">{tutor.subjects.join(" • ")}</div>
        </div>
        <div className="text-right">
          <div className="price">₹{tutor.fees}/hr</div>
          <div className="rating">⭐ {tutor.rating}</div>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn" onClick={() => onBook(tutor)}>Book</button>
        <button className="btn primary">Message</button>
      </div>
    </div>
  );
}

function StudentCard({ student }) {
  return (
    <div className="student">
      <div>
        <div className="student-name">{student.name}</div>
        <div className="muted">Grade {student.grade}</div>
      </div>
      <div className="muted">ID: {student.id}</div>
    </div>
  );
}

function BookingModal({ tutor, onClose, onConfirm }) {
  const [hours, setHours] = useState(1);
  if (!tutor) return null;
  return (
    <div className="modal-wrap" role="dialog" aria-modal="true">
      <div className="backdrop" onClick={onClose} />
      <div className="modal">
        <h2 className="modal-title">Book {tutor.name}</h2>
        <p className="muted">Subjects: {tutor.subjects.join(", ")}</p>

        <label className="label">Hours</label>
        <input
          type="number"
          min={1}
          className="input"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />

        <div className="btn-right">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn success" onClick={() => onConfirm({ tutor, hours })}>
            Confirm — ₹{tutor.fees * hours}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [tutors] = useState(SAMPLE_TUTORS);
  const [students] = useState(SAMPLE_STUDENTS);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredTutors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tutors;
    return tutors.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subjects.join(" ").toLowerCase().includes(q)
    );
  }, [query, tutors]);

  function handleConfirm({ tutor, hours }) {
    const booking = {
      id: bookings.length + 1,
      tutorId: tutor.id,
      tutorName: tutor.name,
      hours,
      cost: tutor.fees * hours,
      date: new Date().toISOString()
    };
    setBookings((prev) => [booking, ...prev]);
    setSelectedTutor(null);
  }

  return (
    <div className="app">
      <Header
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        query={query}
        setQuery={setQuery}
      />

      <div className="content">
        {sidebarOpen && (
          <aside className="sidebar">
            <div className="panel">
              <h3 className="panel-title">Your Students</h3>
              <div className="vstack">
                {students.map((s) => <StudentCard key={s.id} student={s} />)}
              </div>
            </div>

            <div className="panel">
              <h3 className="panel-title">Recent Bookings</h3>
              <div className="bookings">
                {bookings.length === 0 ? (
                  <div className="muted">No bookings yet</div>
                ) : (
                  bookings.slice(0, 4).map((b) => (
                    <div key={b.id} className="booking-row">
                      <div className="booking-name">{b.tutorName}</div>
                      <div className="muted">{b.hours} hr • ₹{b.cost}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        )}

        <main className="main">
          <section className="section">
            <div className="row-between">
              <h2 className="section-title">Available Tutors</h2>
              <div className="muted">{filteredTutors.length} tutors</div>
            </div>

            <div className="grid">
              {filteredTutors.map((t) => (
                <TutorCard key={t.id} tutor={t} onBook={setSelectedTutor} />
              ))}
            </div>
          </section>

          <section className="panel">
            <h3 className="panel-title">Admin / Reports (Demo)</h3>
            <div className="stats">
              <div className="stat">
                <div className="muted small">Total Tutors</div>
                <div className="stat-value">{tutors.length}</div>
              </div>
              <div className="stat">
                <div className="muted small">Total Students</div>
                <div className="stat-value">{students.length}</div>
              </div>
              <div className="stat">
                <div className="muted small">Earnings (demo)</div>
                <div className="stat-value">
                  ₹{bookings.reduce((s, b) => s + b.cost, 0)}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <BookingModal
        tutor={selectedTutor}
        onClose={() => setSelectedTutor(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
