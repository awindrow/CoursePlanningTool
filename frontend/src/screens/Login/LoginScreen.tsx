import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import ecsuWhite from "../../assets/images/ecsu-logo-white-stacked-alt.png";
import "./LoginScreen.css";
import bgImage from "../../assets/images/login_background.png";
import LoginIcon from "../../assets/images/Login_Page_Icon.png";
import RedirectingModal from "../../components/RedirectingModal/RedirectingModal";

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const usernameRef = useRef<HTMLInputElement>(null);

    const { isLoading, handleLogin } = useLogin();
    const navigate = useNavigate();
    const location = useLocation() as any;
    const redirectTo = location.state?.from ?? "/course-page";

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const u = username.trim();
        const p = password;

        if (!u || !p || isLoading) return;

        // loading modal
        setModalTitle("Logging In");
        setModalMessage("Please wait while we verify your credentials...");
        setModalStatus("loading");
        setModalVisible(true);

        const ok = await handleLogin(u, p);

        if (ok) {
            setModalStatus("success");
            setModalTitle("Login Successful");
            setModalMessage("Welcome! Redirecting to your course page...");
            setTimeout(() => {
                setModalVisible(false);
                navigate(redirectTo, { replace: true });
            }, 900);
        } else {
            // Global error modal is already shown by handleApiError
            setModalVisible(false);
            usernameRef.current?.focus();
        }
    };

    return (
        <div
            className="login-page-wrapper"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
            }}
        >
            {/* Logo */}
            <div className="logo-container">
                <img
                    src={ecsuWhite}
                    alt="Eastern Connecticut State University Logo"
                    className="logo"
                />
            </div>

            <div className="login-page-container">
                {/* Left Section */}
                <div className="left-section">
                    <h1>Course Planning Tool</h1>
                    <p>
                        This course planning tool makes it easy to design courses and download a complete syllabus through guided steps.
                        Create a new course or edit an existing one at any time.
                    </p>
                    <p className="details-bottom">Create an account or log in to get started.</p>

                    <h2>How It Works:</h2>
                    <div className="how-block">
                        <img src={LoginIcon} alt="Login Icon" className="icon-login" />
                        <div className="description-container">
                            <div>Create or edit a course</div>
                            <div>Plan with step-by-step guidance</div>
                            <div>Export your syllabus as a Word document</div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="right-section">
                    <form onSubmit={onSubmit} className="login-form" noValidate>
                        <label className="sr-only" htmlFor="username">Username</label>
                        <input
                            id="username"
                            ref={usernameRef}
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                            aria-invalid={false}
                        />

                        <label className="sr-only" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            aria-invalid={false}
                        />

                        <button
                            type="submit"
                            disabled={isLoading || !username.trim() || !password}
                        >
                            {isLoading ? "Logging in…" : "Login"}
                        </button>
                    </form>
                </div>
            </div>

            <RedirectingModal
                visible={modalVisible}
                status={modalStatus}
                title={modalTitle}
                message={modalMessage}
            />
        </div>
    );
};

export default LoginScreen;
