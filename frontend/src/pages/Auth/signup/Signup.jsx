import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faKey, faLock, faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
    RegisterForm,
    RegisterBody,
    RegisterTitle,
    RegisterBound,
    RegisterInp,
    RegisterButton,
    LoginBack
} from './styled.js'

import authService from '../../../services/authService'
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import AuthBackground from "../../../components/AuthBackground/AuthBackground.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm trạng thái chờ

  const handleRegister = async () => {
    if (!username || !email || !password) {
      message.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    const registerData = {
      username,
      password,
      email
    };

    setLoading(true);
    try {
      await authService.register(registerData);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <AuthBackground />
      <RegisterForm>
        {/* Quay lại trang login */}
        <LoginBack onClick={() => navigate("/login")}> 
          <FontAwesomeIcon className="cursor-pointer" icon={faArrowLeft} /> Đăng nhập
        </LoginBack>

        <RegisterBody>
          <RegisterTitle>Đăng ký</RegisterTitle>

          <RegisterBound>
            <RegisterInp
              id="username"
              type="text"
              required
              className="peer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label
              htmlFor="username"
              className={`absolute left-2 peer-focus:scale-[0.8] peer-focus:-translate-y-7 duration-300 ${username !== "" ? "scale-[0.8] -translate-y-7" : ""}`}
            >
              <FontAwesomeIcon icon={faUser} /> Tên đăng nhập
            </label>
          </RegisterBound>

          <RegisterBound>
            <RegisterInp
              id="email"
              type="email"
              required
              className="peer"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className={`absolute left-2 peer-focus:scale-[0.8] peer-focus:-translate-y-7 duration-300 ${email !== "" ? "scale-[0.8] -translate-y-7" : ""}`}
            >
              <FontAwesomeIcon icon={faEnvelope} /> Email
            </label>
          </RegisterBound>

          <RegisterBound>
            <RegisterInp
              id="password"
              type={`${passwordToggle ? "text" : "password"}`}
              required
              className="peer"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="password"
              className={`absolute left-2 peer-focus:scale-[0.8] peer-focus:-translate-y-7 duration-300 ${password !== "" ? "scale-[0.8] -translate-y-7" : ""}`}
            >
              <FontAwesomeIcon icon={faKey} /> Mật khẩu
            </label>
            <FontAwesomeIcon
              className="absolute right-2 cursor-pointer text-gray-400"
              icon={faEye}
              onClick={() => setPasswordToggle(!passwordToggle)}
            />
          </RegisterBound>

          <RegisterBound>
            <RegisterInp
              id="confirmPassword"
              type="password"
              required
              className="peer"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label
              htmlFor="confirmPassword"
              className={`absolute left-2 peer-focus:scale-[0.8] peer-focus:-translate-y-7 duration-300 ${confirmPassword !== "" ? "scale-[0.8] -translate-y-7" : ""}`}
            >
              <FontAwesomeIcon icon={faLock} /> Nhập lại mật khẩu
            </label>
          </RegisterBound>

          <RegisterButton 
            onClick={handleRegister}
            disabled={loading} // Chặn click liên tục khi đang gửi
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </RegisterButton>
        </RegisterBody>
      </RegisterForm>
    </div>
  )
}

export default Signup;