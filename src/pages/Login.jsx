import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "src/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
} from "firebase/auth";
import { googleProvider } from "src/components/LoginComponents/GoogleAuth";
import { gitProvider } from "src/components/LoginComponents/GitHubAuth";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100vh;
  overflow: hidden;
`;
const AuthSidebar = styled.div`
  width: 450px;
  height: 100%;
  background-color: #f2aa4c;
  color: #866118;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 0px 20px;
`;

const AuthContent = styled.div`
  width: 100%;
  max-width: 416px;
  text-align: center;
  margin: auto;
`;

const SubTitle = styled.h2`
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 24px;
  text-align: left;
`;

const HrDivider = styled.hr`
  margin: 30px 0px;
  border: none;
  background-color: #c6c6c6;
  color: black;
  text-align: center;
  overflow: visible;
  height: 1px;
  &::after {
    content: "or sign in with email";
    display: inline-block;
    position: relative;
    top: -7px;
    padding: 0 16px;
    background-color: #fff;
  }
`;

const AuthLink = styled.p`
  margin-top: 20px;
  color: #3d3d4e;
`;

const Session = styled.form``;
const AuthForm = styled.div``;
const FormField = styled.div`
  text-align: left;
`;
const Label = styled.label`
  display: block;
  justify-content: space-between;
  margin: 14px 0px 4px 0px;
  font-size: 15px;
  font-weight: 700;
`;
const LoginInput = styled.input`
  width: 100%;
  margin-right: 8px;
  padding: 18px 20px;
  border: 1.5px solid #e7e7e9;
  border-radius: 12px;
`;
const FieldSet = styled.fieldset`
  margin-bottom: 12px;
`;

const Button = styled.button`
  margin-top: 20px;
  width: 100%;
  background-color: #f2aa4c;
  color: #101820;
  font-size: 14px;
  padding: 16px 24px;
  border: 1.5px solid #f2aa4c;
  border-radius: 25px;
  height: 50px;
  cursor: pointer;
  font-weight: 600;
`;
const APIButton = styled.button`
  cursor: pointer;
  background-color: ${(props) => {
    switch (props.name) {
      case "google":
        return "white";
      default:
        return "black";
    }
  }};
  color: ${(props) => {
    switch (props.name) {
      case "google":
        return "#0e0c22";
      default:
        return "white";
    }
  }};
  font-weight: 600;
  padding: 16px 24px;
  margin-top: 20px;
  width: 100%;
  border: 1.5px solid
    ${(props) => {
      switch (props.name) {
        case "google":
          return "#e8e8ea";
        default:
          return "black";
      }
    }};
  border-radius: 25px;
`;
function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const updateInput = (event) => {
    switch (event.target.name) {
      case "login":
        setLogin(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        console.log("유효하지 않은 입력입니다.");
        return;
    }
  };
  const handleLogin = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, login, password)
      .then((userCredential) => {
        alert("WELCOME");
        navigate("/");
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            alert("이메일을 올바르게 입력해주세요.");
            break;
          case "auth/missing-password":
            alert("비밀번호를 입력해주세요.");
            break;
          case "auth/invalid-credential":
            alert("이메일 또는 비밀번호가 일치하지 않습니다.");
            break;
          default:
            alert(`ERROR CODE : ${error.code}`);
            return;
        }
      });
  };
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider) // popup을 이용한 signup
      .then((data) => {
        console.log(data); // console로 들어온 데이터 표시
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleGitHubLogin = () => {
    signInWithPopup(auth, gitProvider) // popup을 이용한 signup
      .then((data) => {
        console.log(data); // console로 들어온 데이터 표시
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <MainContainer>
      <AuthSidebar />
      <Content>
        <AuthContent>
          <SubTitle>Sign in to Code Feed</SubTitle>
          <APIButton onClick={handleGitHubLogin} name="github">
            Sign in with GitHub
          </APIButton>
          <APIButton onClick={handleGoogleLogin} name="google">
            Sign in with Google
          </APIButton>
          <HrDivider></HrDivider>
          <AuthForm>
            <Session onSubmit={handleLogin}>
              <FormField>
                <FieldSet>
                  <Label>Email</Label>
                  <LoginInput
                    type="text"
                    name="login"
                    value={login}
                    onChange={updateInput}
                  />
                </FieldSet>
                <FieldSet>
                  <Label>
                    Password
                    <Link
                      replace
                      to="/password_resets"
                      style={{
                        float: "right",
                        color: "#0d0c22",
                        fontSize: "14px",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: "400",
                      }}
                    >
                      Forgot?
                    </Link>
                  </Label>
                  <LoginInput
                    type="password"
                    name="password"
                    value={password}
                    onChange={updateInput}
                    autoComplete="off"
                  />
                </FieldSet>
              </FormField>
              <Button type="submit">Sign In</Button>
            </Session>
            <AuthLink>
              Dont have an account? <Link to="/sign-up">Sign Up</Link>
            </AuthLink>
          </AuthForm>
        </AuthContent>
      </Content>
    </MainContainer>
  );
}
export default Login;
