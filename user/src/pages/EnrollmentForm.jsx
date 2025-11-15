import React, { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  Card,
  Button,
  Modal,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { BsBoxArrowRight } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import "./EnrollmentForm.css";

export default function EnrollmentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentEmail = location.state?.email || "";

  const [showDesc, setShowDesc] = useState(false);
  const [showScreening, setShowScreening] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", success: true });
  const [hasEnrolled, setHasEnrolled] = useState(false);
  const [contact, setContact] = useState("");
  const [screeningAnswers, setScreeningAnswers] = useState([]);
  const [existingEnrollment, setExistingEnrollment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmitScreening, setCanSubmitScreening] = useState(false);

  // NEW: for BSED major option
  const [showBsedOption, setShowBsedOption] = useState(false);
  const [selectedBsedMajor, setSelectedBsedMajor] = useState("");

  // ------------------------- Check if user already enrolled -------------------------
  useEffect(() => {
    if (!currentEmail) {
      setToast({ show: true, message: "Email is missing. Cannot enroll.", success: false });
      return;
    }

    const checkEnrollment = async () => {
      try {
        const res = await fetch(
          `http://localhost/enrollment/check_enrolled.php?email=${currentEmail}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        if (data.enrolled) {
          setHasEnrolled(true);
          setExistingEnrollment(data.enrollment);
        } else {
          setHasEnrolled(false);
        }
      } catch (err) {
        console.error("Check enrollment error:", err);
        setToast({
          show: true,
          message: `Error checking enrollment status: ${err.message}`,
          success: false,
        });
      }
    };

    checkEnrollment();
  }, [currentEmail]);

  // ------------------------- Show toast if redirected with message -------------------------
  useEffect(() => {
    if (location.state?.message)
      setToast({ show: true, message: location.state.message, success: true });
  }, [location.state]);

  // ------------------------- Enable/disable screening submit -------------------------
  useEffect(() => {
    if (
      currentEmail &&
      screeningAnswers.length > 0 &&
      screeningAnswers.every((a) => a.trim() !== "")
    ) {
      setCanSubmitScreening(true);
    } else {
      setCanSubmitScreening(false);
    }
  }, [currentEmail, screeningAnswers]);

  const handleLogout = () =>
    navigate("/", { replace: true, state: { message: "Logout successful" } });

  const handleExitForm = () => {
    setContact("");
    setSelectedCourse({});
    setShowForm(false);
    setShowDesc(false);
    setShowScreening(false);
    setShowConfirm(false);
  };

  // ------------------------- Courses List -------------------------
  const courses = [
    {
      name: "BSIT",
      description:
        "Bachelor of Science in Information Technology teaches students to develop software, manage data, and maintain IT systems.",
      screened: true,
      screeningQuestions: [
        "Have you used a computer before? What do you usually do on it?",
        "Which part of using computers do you find most interesting?",
        "Do you enjoy learning how to make websites or apps?",
        "Do you like working on computers alone or with friends?",
        "Why do you want to study IT in school?",
      ],
    },
    {
      name: "BEED",
    description:
      "Bachelor of Elementary Education prepares students to become professional teachers for elementary school students.",
    screened: true,
    screeningQuestions: [
      "Do you enjoy teaching or helping children learn?",
      "Have you participated in tutoring or mentoring programs?",
      "Do you like creating educational activities for kids?",
      "Are you patient and understanding with young learners?",
      "Why do you want to pursue Elementary Education?",
      ],
    },
    {
      name: "BSCRIM",
      description:
        "Bachelor of Science in Criminology studies criminal behavior, justice systems, and law enforcement techniques.",
      screened: true,
      screeningQuestions: [
        "What made you interested in Criminology?",
        "Do you enjoy learning about laws and rules?",
        "Have you joined any activities related to law or safety?",
        "Do you like solving mysteries or finding evidence?",
        "Which Criminology topic excites you most?",
      ],
    },
    {
      name: "BSHM",
      description:
        "Bachelor of Science in Hospitality Management trains students for careers in hotels, restaurants, and tourism.",
      screened: true,
      screeningQuestions: [
        "Do you enjoy helping and serving people?",
        "Have you worked in school events or team projects?",
        "Which subject do you like that's related to hospitality?",
        "Do you like organizing things or planning events?",
        "What excites you most about the hospitality industry?",
      ],
    },
    {
      name: "BSED",
      description:
        "Bachelor of Secondary Education prepares students to become professional teachers in high school subjects.",
      screened: true,
    },
    {
      name: "BSAB",
      description:
        "Bachelor of Science in Agribusiness prepares students for careers in managing agricultural enterprises and farm industries.",
      screened: true,
      screeningQuestions: [
        "Do you like learning about farming or business?",
        "Have you done school projects about agriculture or selling?",
        "Do you enjoy using technology in business?",
        "Which part of Agribusiness interests you the most?",
        "Why do you want to study Agribusiness?",
      ],
    },
  ];

  // ------------------------- Handle Course Click -------------------------
  const handleCardClick = (course) => {
    if (hasEnrolled) {
      setToast({
        show: true,
        message: "You are already enrolled. Enrollment is locked for your account.",
        success: false,
      });
      return;
    }

    if (course.name === "BSED") {
      setSelectedCourse(course);
      setShowBsedOption(true);
      return;
    }

    setSelectedCourse(course);
    setShowDesc(true);
    setScreeningAnswers(Array(course.screeningQuestions?.length).fill(""));
  };

  // ------------------------- Handle Major Selection -------------------------
  const handleBsedMajorSelect = (major) => {
    let updatedCourse = {};

    if (major === "Mathematics") {
      updatedCourse = {
        name: "BSED Math",
        description:
          "BSED Major in Mathematics trains students to teach mathematical concepts effectively in high schools.",
        screened: true,
        screeningQuestions: [
          "Do you enjoy solving mathematical problems?",
          "Are you confident explaining math concepts to others?",
          "Do you like logical reasoning and analysis?",
          "Have you participated in math-related contests or tutoring?",
          "Why do you want to become a Math teacher?",
        ],
      };
    } else if (major === "Science") {
      updatedCourse = {
        name: "BSED Science",
        description:
          "BSED Major in Science prepares future educators to teach Biology, Chemistry, and Physics to secondary students.",
        screened: true,
        screeningQuestions: [
          "Do you enjoy conducting scientific experiments?",
          "Are you curious about how nature and the universe work?",
          "Have you participated in any science fairs or labs?",
          "Do you like explaining how scientific concepts work?",
          "Why do you want to become a Science teacher?",
        ],
      };
    }

    setSelectedBsedMajor(major);
    setSelectedCourse(updatedCourse);
    setShowBsedOption(false);
    setShowDesc(true);
    setScreeningAnswers(Array(updatedCourse.screeningQuestions?.length).fill(""));
  };

  const handleProceed = () => {
    setShowDesc(false);
    if (selectedCourse.screened) setShowScreening(true);
    else setShowConfirm(true);
  };

  // ------------------------- Submit Screening -------------------------
  const handleScreeningSubmit = async () => {
    if (!currentEmail) {
      setToast({ show: true, message: "Email missing. Cannot submit screening.", success: false });
      return;
    }
    if (screeningAnswers.length === 0 || screeningAnswers.some((a) => !a.trim())) {
      setToast({ show: true, message: "Please answer all screening questions.", success: false });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      email: currentEmail,
      questions: selectedCourse.screeningQuestions,
      answers: screeningAnswers,
    };

    try {
      const res = await fetch("http://localhost/enrollment/save_answers.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setToast({
        show: true,
        message: data.success
          ? "Screening answers submitted successfully!"
          : data.message,
        success: data.success,
      });

      if (data.success) {
        setShowScreening(false);
        setShowConfirm(true);
      }
    } catch (err) {
      console.error("Screening submit error:", err);
      setToast({
        show: true,
        message: `Something went wrong: ${err.message}`,
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------- Confirm Enrollment -------------------------
  const handleConfirmYes = () => {
    setShowConfirm(false);
    setShowForm(true);
  };
  const handleConfirmNo = () => setShowConfirm(false);
  const handleCloseForm = () => {
    setContact("");
    setShowForm(false);
  };

  // ------------------------- Submit Enrollment -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName?.value?.trim() || "";
    const email = currentEmail?.trim() || "";
    const contactNumber = contact?.trim() || "";
    const course = selectedCourse?.name?.trim() || "";

    if (!fullName || !email || !contactNumber || !course) {
      setToast({ show: true, message: "All fields are required.", success: false });
      return;
    }

    if (!/^09\d{9}$/.test(contactNumber)) {
      setToast({
        show: true,
        message: "Contact number must start with 09 and be 11 digits.",
        success: false,
      });
      return;
    }

    const payload = { fullName, email, contact: contactNumber, course };

    try {
      const response = await fetch("http://localhost/enrollment/enroll.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      setToast({
        show: true,
        message: result.message,
        success: result.success ?? false,
      });

      if (result.success) {
        setShowForm(false);
        setHasEnrolled(true);
        setContact("");
        localStorage.setItem(`hasEnrolled_${email}`, "true");
        localStorage.setItem(`enrollment_${email}`, JSON.stringify(payload));
      }
    } catch (err) {
      console.error("Enrollment submit error:", err);
      setToast({
        show: true,
        message: `Something went wrong: ${err.message}`,
        success: false,
      });
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="navbar-left-placeholder" />
          <Navbar.Brand className="fw-bold fs-4 text-center mx-auto">
            Online Enrollment Portal
          </Navbar.Brand>
          <Nav className="d-flex align-items-center">
            <Nav.Link onClick={handleLogout} className="logout-link">
              <BsBoxArrowRight className="me-2" /> Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Course Cards */}
      <Container className="mt-5 d-flex justify-content-center">
        <div
          className="d-flex flex-wrap justify-content-center gap-4"
          style={{ maxWidth: "1000px" }}
        >
          {courses.map((course) => (
            <Card
              key={course.name}
              className="text-center shadow-lg"
              style={{
                cursor: hasEnrolled ? "not-allowed" : "pointer",
                opacity: hasEnrolled ? 0.5 : 1,
                borderRadius: "20px",
                width: "250px",
                transition: "transform 0.2s",
              }}
              onClick={() => handleCardClick(course)}
            >
              <Card.Body>
                <Card.Title className="fw-bold fs-4">{course.name}</Card.Title>
                <Card.Text>{course.description.substring(0, 60)}...</Card.Text>
                <Button variant="primary" disabled={hasEnrolled}>
                  {hasEnrolled ? "Locked" : "View Details"}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>

      {/* BSED Major Option Modal */}
      <Modal show={showBsedOption} onHide={() => setShowBsedOption(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose Your Major</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Select your specialization for BSED:</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="primary" onClick={() => handleBsedMajorSelect("Mathematics")}>
              Mathematics
            </Button>
            <Button variant="success" onClick={() => handleBsedMajorSelect("Science")}>
              Science
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Description Modal */}
      <Modal show={showDesc} onHide={handleExitForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourse.name} Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedCourse.description}</p>
          <Button variant="success" onClick={handleProceed} className="w-100">
            Proceed to Enrollment
          </Button>
        </Modal.Body>
      </Modal>

      {/* Screening Modal */}
      {selectedCourse.screened && (
        <Modal show={showScreening} onHide={handleExitForm} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCourse.name} Screening Questions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {selectedCourse.screeningQuestions?.map((q, i) => (
                <Form.Group className="mb-3" key={i}>
                  <Form.Label>
                    {i + 1}. {q}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={screeningAnswers[i] || ""}
                    onChange={(e) => {
                      const newAnswers = [...screeningAnswers];
                      newAnswers[i] = e.target.value;
                      setScreeningAnswers(newAnswers);
                    }}
                  />
                </Form.Group>
              ))}
              <Button
                type="button"
                className="w-100"
                variant="primary"
                onClick={handleScreeningSubmit}
                disabled={!canSubmitScreening || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Screening"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Confirm Modal */}
      <Modal show={showConfirm} onHide={handleConfirmNo} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>
            Are you sure you want to enroll in <strong>{selectedCourse.name}</strong>?
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="success" onClick={handleConfirmYes}>
              Yes, proceed
            </Button>
            <Button variant="secondary" onClick={handleConfirmNo}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Enrollment Form */}
      <Modal show={showForm} onHide={handleCloseForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enroll in {selectedCourse.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                defaultValue={existingEnrollment?.fullName || ""}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={currentEmail}
                readOnly
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                placeholder="09XXXXXXXXX"
                maxLength={11}
                value={contact}
                onChange={(e) =>
                  setContact(e.target.value.replace(/[^0-9]/g, ""))
                }
                required
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="success" className="w-100">
                Submit Enrollment
              </Button>
              <Button variant="secondary" onClick={handleCloseForm}>
                Exit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer
        className="p-3 d-flex justify-content-center"
        position="top-center"
      >
        <Toast
          show={toast.show}
          bg={toast.success ? "success" : "danger"}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
