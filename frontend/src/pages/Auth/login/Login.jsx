import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEye, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  LoginForm,
  LoginBody,
  LoginTitle,
  LoginBound,
  LoginInp,
  LoginButton
} from './styled.js'
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import authService from "../../../services/authService";
import { saveAuthUser } from "../../../utils/auth";
import AuthBackground from "../../../components/AuthBackground/AuthBackground.jsx";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!username || !password) {
      message.warning("Vui lòng nhập tài khoản và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ username, password });
      saveAuthUser(response);

      message.success("Đăng nhập thành công!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <AuthBackground />
      <LoginForm>
        <LoginBody>
          <LoginTitle>Đăng nhập</LoginTitle>
          
          <LoginBound>
            <LoginInp 
              id="username" 
              type="text" 
              required 
              className="peer" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Nhấn Enter để login
            />
            <label 
              htmlFor="username" 
              className={`absolute left-2 peer-focus:scale-[0.8] peer-focus:-translate-y-7 duration-300 ${username !== "" ? "scale-[0.8] -translate-y-7" : ""}`}
            >
              <FontAwesomeIcon icon={faUser} /> Tài khoản
            </label>
          </LoginBound>

          <LoginBound>
            <LoginInp 
              id="password" 
              type={`${passwordToggle ? "text" : "password"}`} 
              required 
              className="peer" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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
          </LoginBound>

          <div className="w-full flex justify-around text-sm text-purple-600 mb-3">
            <span 
              onClick={() => navigate("/signup")} 
              className="hover:text-purple-800 transition-colors cursor-pointer font-medium"
            >
              Tạo tài khoản
            </span>
            <a href="#" className="hover:text-purple-800 transition-colors">Bạn quên mật khẩu?</a>
          </div>
        </LoginBody>

        <LoginButton 
          onClick={handleLogin} 
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Đang xác thực..." : "Đăng nhập"}
        </LoginButton>
      </LoginForm>
    </div>
  )
}

export default Login;