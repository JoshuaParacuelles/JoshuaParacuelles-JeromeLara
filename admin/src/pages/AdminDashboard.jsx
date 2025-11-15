// ...existing code...
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaLaptopCode,
  FaChalkboardTeacher,
  FaShieldAlt,
  FaSeedling,
  FaUtensils,
  FaCalculator,  // <-- Add this
  FaFlask        // <-- Add this
} from "react-icons/fa";


import {
  PeopleFill,
  PersonBadge,
  BoxArrowRight,
  Speedometer,
  PersonPlus,
  PencilSquare,
  Trash,
  Eye,
} from "react-bootstrap-icons";

import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  Button,
  Form,
  Table,
  Modal,
} from "react-bootstrap";

import "./AdminDashboard.css";

const API_BASE = "http://localhost/enrollment";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [notification, setNotification] = useState({ message: "", type: "success", visible: false, show: false });
  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true, show: true });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  // Show login success notification when redirected from login
  useEffect(() => {
    if (location.state?.loginSuccess) {
      showNotification("Successfully logged in!", "success");
      // Remove the flag so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");

  const [studentCount, setStudentCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [courseCounts, setCourseCounts] = useState({
  BSIT: 0,
  BEED: 0,
  BSCRIM: 0,
  BSAB: 0,
  BSED: 0,
  BSHM: 0,
});


  const [students, setStudents] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    fullname: "",
    student_id: "",
    email: "",
    contact: "",
    course: "",
    section: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [studentFilter, setStudentFilter] = useState("");
  const [studentFilterType, setStudentFilterType] = useState("All");
  const [userFilter, setUserFilter] = useState("");
  const [userFilterType, setUserFilterType] = useState("All");
  const [addStudentFilter, setAddStudentFilter] = useState("");
  const [addStudentFilterType, setAddStudentFilterType] = useState("All");

  const fetchJson = async (url, opts) => {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const fetchStudentCount = async () => {
    try {
      const d = await fetchJson(`${API_BASE}/get_student_count.php`);
      setStudentCount(d.count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserCount = async () => {
    try {
      const d = await fetchJson(`${API_BASE}/get_user_count.php`);
      setUserCount(d.count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourseCounts = async () => {
    try {
      const d = await fetchJson(`${API_BASE}/get_course_counts.php`);
      setCourseCounts((p) => ({ ...p, ...d }));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStudents = async () => {
    try {
      const d = await fetchJson(`${API_BASE}/get_students.php`);
      setStudents(Array.isArray(d) ? d : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEnrolled = async () => {
    try {
      const d = await fetchJson(`${API_BASE}/get_enrolled.php`);
      setEnrolled(Array.isArray(d) ? d : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const d = await fetchJson(`${API_BASE}/get_users.php`);
      setUsers(Array.isArray(d) ? d : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchStudentCount(), fetchUserCount(), fetchCourseCounts(), fetchStudents(), fetchEnrolled(), fetchUsers()]);
    };
    load();
    const iv = setInterval(load, 2000);
    return () => clearInterval(iv);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  const handleLogout = () => navigate("/admin/login", { state: { logoutSuccess: true } });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode ? `${API_BASE}/update_student.php` : `${API_BASE}/add_student.php`;
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([k, v]) => body.append(k, v ?? ""));
      const res = await fetch(url, { method: "POST", body });
      const r = await res.json();
      if (r.success) {
        showNotification(editMode ? "Student updated." : "Student added.", "success");
        setFormData({ id: "", fullname: "", student_id: "", email: "", contact: "", course: "", section: "", password: "" });
        setEditMode(false);
        setShowModal(false);
        await Promise.all([fetchStudents(), fetchStudentCount(), fetchCourseCounts()]);
      } else {
        showNotification(r.message || "Save failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Network error saving student.", "error");
    }
  };

  const handleEdit = (s) => {
    setFormData({
      id: s.id || "",
      fullname: s.fullname || s.full_name || "",
      student_id: s.student_id || "",
      email: s.email || "",
      contact: s.contact || s.contact_number || "",
      course: s.course || "",
      section: s.section || "",
      password: "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete_student.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id }),
      });
      const r = await res.json();
      if (r.success) {
        showNotification("Student deleted.", "success");
        await Promise.all([fetchStudents(), fetchStudentCount(), fetchCourseCounts()]);
      } else showNotification(r.message || "Delete failed.", "error");
    } catch (e) {
      console.error(e);
      showNotification("Network error deleting student.", "error");
    }
  };

  const handleEditEnrolled = (student) => {
    setFormData({
      id: student.id || "",
      fullname: student.full_name || student.fullname || "",
      email: student.email || "",
      contact: student.contact || student.contact_number || "",
      course: student.course || "",
      status: student.status || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmitEnrolled = async (e) => {
    e.preventDefault();
    try {
      const payload = new URLSearchParams({
        id: formData.id || "",
        fullName: formData.fullname || "",
        email: formData.email || "",
        contact: formData.contact || "",
        course: formData.course || "",
      });
      const res = await fetch(`${API_BASE}/update_enrolled.php`, { method: "POST", body: payload });
      const d = await res.json();
      if (d.success) {
        showNotification("Enrolled updated.", "success");
        setShowModal(false);
        setEditMode(false);
        fetchEnrolled();
      } else {
        showNotification(d.message || "Update failed.", "error");
      }
    } catch (e) {
      console.error(e);
      showNotification("Network error updating enrolled.", "error");
    }
  };

  const handleDeleteEnrolled = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrolled student?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete_enrolled.php`, { method: "POST", body: new URLSearchParams({ id }) });
      const d = await res.json();
      if (d.success) {
        showNotification("Enrolled student deleted.", "success");
        fetchEnrolled();
      } else showNotification(d.message || "Delete failed.", "error");
    } catch (e) {
      console.error(e);
      showNotification("Network error deleting enrolled.", "error");
    }
  };

  const handleEditUser = (u) => {
    setFormData({ id: u.id || "", fullname: u.fullname || "", email: u.email || "", password: u.password || "" });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/update_user.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const r = await res.json();
      if (r.success) {
        showNotification("User updated.", "success");
        setShowModal(false);
        fetchUsers();
      } else showNotification(r.message || "Update failed.", "error");
    } catch (e) {
      console.error(e);
      showNotification("Network error updating user.", "error");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete_user.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const r = await res.json();
      if (r.success) {
        showNotification("User deleted.", "success");
        fetchUsers();
      } else {
        showNotification(r.error || "Delete failed.", "error");
        console.error("Delete error:", r);
      }
    } catch (e) {
      console.error(e);
      showNotification("Network error deleting user.", "error");
    }
  };

  const handleViewStudent = async (student) => {
    try {
      const d = await fetchJson(`${API_BASE}/get_student_answers.php?email=${encodeURIComponent(student.email)}`);
      if (d.success) {
        setSelectedStudent({ ...student, screeningAnswers: d.answers || [] });
        setShowViewModal(true);
      } else {
        showNotification(d.message || "No answers found.", "warning");
      }
    } catch (e) {
      console.error(e);
      showNotification("Error fetching screening answers.", "error");
    }
  };

  const handleMarkStudent = async (isCorrect) => {
    if (!selectedStudent) return;
    try {
      const status = isCorrect ? "Enrolled" : "Failed";
      const res = await fetch(`${API_BASE}/review_answers.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: selectedStudent.email, status }) });
      const d = await res.json();
      if (d.success) {
        showNotification(`Marked ${status}.`, "success");
        setShowViewModal(false);
        fetchEnrolled();
      } else showNotification(d.message || "Update failed.", "error");
    } catch (e) {
      console.error(e);
      showNotification("Network error marking student.", "error");
    }
  };

  const sidebarLinks = [
    { name: "Dashboard", icon: <Speedometer className="me-2" /> },
    { name: "All Students", icon: <PeopleFill className="me-2" /> },
    { name: "All Users", icon: <PersonBadge className="me-2" /> },
    { name: "Add Student", icon: <PersonPlus className="me-2" /> },
  ];

const courseCards = [
  { title: "BSIT", icon: <FaLaptopCode color="#4e73df" />, count: courseCounts.BSIT, className: "course-bsit" },
  { title: "BEED", icon: <FaChalkboardTeacher color="#1cc88a" />, count: courseCounts.BEED, className: "course-beed" },
  { title: "BSCRIM", icon: <FaShieldAlt color="#36b9cc" />, count: courseCounts.BSCRIM, className: "course-bscrim" },
  { title: "BSAB", icon: <FaSeedling color="#f6c23e" />, count: courseCounts.BSAB, className: "course-bsab" },
  { title: "BSED Math", icon: <FaCalculator color="#e74a3b" />, count: courseCounts.BSED_MATH || 0, className: "course-bsed-math" },
  { title: "BSED Science", icon: <FaFlask color="#858796" />, count: courseCounts.BSED_SCIENCE || 0, className: "course-bsed-science" },
  { title: "BSHM", icon: <FaUtensils color="#fd7e14" />, count: courseCounts.BSHM, className: "course-bshm" },
];




  const renderContent = () => {
    switch (activeLink) {
      case "Dashboard":
        return (
          <>
            <h2 className="dashboard-title mb-4 fw-bold display-10">Dashboard Analytics</h2>
            <Row className="g-4 dashboard-cards">
              <Col md={6} lg={4}>
                <Card onClick={() => setActiveLink("All Students")} style={{ cursor: "pointer" }}>
                  <Card.Body className="text-center">
                    <PeopleFill size={30} />
                    <h5 className="mt-2 fw-bold">All Students</h5>
                    <h2 className="fw-bold">{studentCount}</h2>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={4}>
                <Card onClick={() => setActiveLink("All Users")} style={{ cursor: "pointer" }}>
                  <Card.Body className="text-center">
                    <PersonBadge size={30} />
                    <h5 className="mt-2 fw-bold">All Users</h5>
                    <h2 className="fw-bold">{userCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <h2 className="below-title mt-4 mb-3 fw-bold display-10">All Courses Enrolled</h2>
            <div className="dashboard-cards">
              {courseCards.map((c, i) => (
                <div key={i} className={`course-card ${c.className}`}>
                  <div className="card-icon">{c.icon}</div>
                  <h5 className="fw-bold">{c.title}</h5>
                  <h2 className="fw-bold">{c.count}</h2>
                </div>
              ))}
            </div>
          </>
        );

      case "All Students": {
        const search = studentFilter.toLowerCase();
        const filtered = enrolled.filter((s) => {
          const name = (s.full_name || s.fullname || "").toLowerCase();
          const email = (s.email || "").toLowerCase();
          const course = (s.course || "").toLowerCase();
          const matchesSearch = name.includes(search) || email.includes(search) || course.includes(search);
          const dbStatus = (s.status || "").toLowerCase();
          const matchesType =
            studentFilterType === "All" ? true : studentFilterType === "Enrolled" ? dbStatus === "enrolled" : studentFilterType === "Failed" ? dbStatus === "failed" : true;
          return matchesSearch && matchesType;
        });

        return (
          <div>
            <h3 className="mb-4 fw-bold">All Enrolled Students</h3>

            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
              <Form.Control type="text" placeholder="Search by name, email, or course..." className="w-50" value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} />
              <Form.Select className="w-auto" value={studentFilterType} onChange={(e) => setStudentFilterType(e.target.value)}>
                <option value="All">All Students</option>
                <option value="Enrolled">Enrolled Students</option>
                <option value="Failed">Failed Students</option>
              </Form.Select>
            </div>
          <div className="table-wrapper wrapper-header">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((s) => {
                    const statusRaw = s.status || "Pending";
                    return (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.full_name || s.fullname}</td>
                        <td>{s.email}</td>
                        <td>{s.contact_number || s.contact}</td>
                        <td>{s.course}</td>
                        <td>
                          <span className={statusRaw.toLowerCase() === "pending" ? "text-warning" : statusRaw.toLowerCase() === "enrolled" ? "text-success" : statusRaw.toLowerCase() === "failed" ? "text-danger" : "text-muted"}>
                            {statusRaw}
                          </span>
                        </td>
                        <td>
                          <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditEnrolled(s)}>
                            <PencilSquare />
                          </Button>
                          <Button variant="info" size="sm" className="me-2" onClick={() => handleViewStudent(s)}>
                            <Eye />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteEnrolled(s.id)}>
                            <Trash />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No enrolled students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
           <Modal
  show={showViewModal}
  onHide={() => setShowViewModal(false)}
  centered
  size="lg"
  className="screening-modal"
>
  <Modal.Header closeButton className="border-0 pb-0">
    <Modal.Title className="fw-bold text-primary">Screening Answers Review</Modal.Title>
  </Modal.Header>

  <Modal.Body className="pt-3">
    {selectedStudent?.screeningAnswers?.length ? (
      <div className="answers-container">
        {selectedStudent.screeningAnswers.map((ans, i) => (
          <div key={i} className="answer-card mb-3 p-3 rounded-3 shadow-sm">
            <p className="question fw-semibold mb-2">
              <span className="text-secondary">Question {i + 1}:</span> {ans.question}
            </p>
            <p className="answer mb-0">
              <span className="fw-semibold text-success">Answer:</span> {ans.answer}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted text-center mt-3">No answers submitted yet.</p>
    )}
  </Modal.Body>

  <Modal.Footer className="border-0 d-flex justify-content-end">
    <Button
      variant="outline-danger"
      className="fw-semibold me-2"
      onClick={() => handleMarkStudent(false)}
    >
      Mark as Failed
    </Button>
    <Button
      variant="success"
      className="fw-semibold"
      onClick={() => handleMarkStudent(true)}
    >
      Mark as Enrolled
    </Button>
  </Modal.Footer>
</Modal>


            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Edit Enrolled Student</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmitEnrolled}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="fullname" value={formData.fullname || ""} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email || ""} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control type="text" name="contact" value={formData.contact || ""} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Course</Form.Label>
                    <Form.Control type="text" name="course" value={formData.course || ""} onChange={handleChange} required />
                  </Form.Group>
                  <div className="text-end">
                    <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        );
      }

      case "All Users": {
        const s = userFilter.toLowerCase();
        const filtered = users.filter((u) => {
          const name = (u.fullname || "").toLowerCase();
          const email = (u.email || "").toLowerCase();
          const status = (u.status || "New").toLowerCase();
          const matchesSearch = name.includes(s) || email.includes(s);
          const matchesType = userFilterType === "All" ? true : userFilterType === "New" ? status === "new" : userFilterType === "Old" ? status === "old" : true;
          return matchesSearch && matchesType;
        });

        return (
          <div>
            <h3 className="mb-4 fw-bold">All Registered Users</h3>

            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
              <Form.Control type="text" placeholder="Search by name or email..." className="w-50" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
              <Form.Select className="w-auto" value={userFilterType} onChange={(e) => setUserFilterType(e.target.value)}>
                <option value="All">All Users</option>
                <option value="New">New Users</option>
                <option value="Old">Old Users</option>
              </Form.Select>
            </div> 
          <div className="table-wrapper wrapper-header">
           <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>{u.password}</td>
                      <td>{u.status || "New"}</td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditUser(u)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmitUser}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" name="password" value={formData.password} onChange={handleChange} required />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Save Changes
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        );
      }

      case "Add Student": {
        const s = addStudentFilter.toLowerCase();
        const filtered = students.filter((st) => {
          const name = (st.fullname || "").toLowerCase();
          const sid = (st.student_id || "").toLowerCase();
          const email = (st.email || "").toLowerCase();
          const course = (st.course || "").toLowerCase();
          const matchesSearch = name.includes(s) || sid.includes(s) || email.includes(s) || course.includes(s);
          const status = st.status ? st.status.toLowerCase().trim() : "new student";
          const matchesType = addStudentFilterType === "All" ? true : addStudentFilterType === "New" ? status === "new student" : status === "old student";
          return matchesSearch && matchesType;
        });

        return (
          <div>
            <h3 className="mb-4 fw-bold">Manage Students</h3>

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  setShowModal(true);
                  setEditMode(false);
                  setFormData({ id: "", fullname: "", student_id: "", email: "", contact: "", course: "", section: "", password: "" });
                }}
              >
                + Add New Student
              </Button>

              <div className="d-flex gap-2 flex-wrap">
                <Form.Control type="text" placeholder="Search students..." className="w-auto" value={addStudentFilter} onChange={(e) => setAddStudentFilter(e.target.value)} />
                <Form.Select className="w-auto" value={addStudentFilterType} onChange={(e) => setAddStudentFilterType(e.target.value)}>
                  <option value="All">All</option>
                  <option value="New">New Students</option>
                  <option value="Old">Old Students</option>
                </Form.Select>
              </div>
            </div> 
          <div className="table-wrapper wrapper-header">
      <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Student ID</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((st) => (
                    <tr key={st.id}>
                      <td>{st.id}</td>
                      <td>{st.fullname}</td>
                      <td>{st.student_id}</td>
                      <td>{st.email}</td>
                      <td>{st.course}</td>
                      <td>{st.section}</td>
                      <td>{st.status || "Complete"}</td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(st)}>
                          <PencilSquare />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(st.id)}>
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>{editMode ? "Edit Student" : "Add New Student"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Student ID</Form.Label>
                    <Form.Control type="text" name="student_id" value={formData.student_id} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Course</Form.Label>
                    <Form.Control type="text" name="course" value={formData.course} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Section</Form.Label>
                    <Form.Control type="text" name="section" value={formData.section} onChange={handleChange} required />
                  </Form.Group>
                  <div className="text-end">
                    <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      {editMode ? "Update" : "Save"}
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        );
      }

      default:
        return <h3>{activeLink} content goes here...</h3>;
    }
  };

  return (
    <div className="d-flex flex-column vh-100 admin-dashboard">
      {notification.visible && (
        <div className={`notification ${notification.type} ${notification.show ? "show" : ""}`}>
          {notification.message}
        </div>
      )}

      <Navbar expand="lg" bg="light" variant="light" className="shadow-sm border-bottom py-3 px-4">
        <Container fluid className="px-0 d-flex align-items-center justify-content-between">
          <Button variant="outline-dark" className="d-lg-none me-2 sidebar-toggle-btn" onClick={toggleSidebar}>
            ☰
          </Button>

          <Navbar.Brand className="fw-bold text-center flex-grow-1 mx-2 mx-lg-0">ADMIN DASHBOARD</Navbar.Brand>

          <Nav className="ms-auto">
            <Button onClick={handleLogout} variant="outline-secondary" className="d-flex align-items-center btn-logout">
              <BoxArrowRight size={18} className="me-2" />
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1 overflow-hidden admin-layout-wrapper">
        <aside className={`admin-sidebar d-flex flex-column p-4 border-end bg-white shadow-sm ${isSidebarOpen ? "open" : ""}`}>
          <h3 className="mb-2 fw-bold">Admin Panel</h3>
          <div style={{ height: 1, backgroundColor: "#dee2e6", marginBottom: "1rem", width: "100%" }} />
          <Nav className="flex-column admin-sidebar-nav">
            {sidebarLinks.map((link) => (
              <Nav.Link
                key={link.name}
                href="#"
                onClick={() => {
                  setActiveLink(link.name);
                  setIsSidebarOpen(false);
                }}
                className={`py-2 px-3 mb-2 rounded d-flex align-items-center ${activeLink === link.name ? "active-link" : "text-dark"}`}
              >
                {link.icon}
                <span className="fw-bold">{link.name}</span>
              </Nav.Link>
            ))}
          </Nav>
        </aside>

        <main className="admin-dashboard-main flex-grow-1 overflow-auto p-4">{renderContent()}</main>
      </div>
    </div>
  );
}