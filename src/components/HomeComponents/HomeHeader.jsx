import { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "src/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { checkSearch } from "src/redux/modules/search";
import { initialization } from "src/redux/modules/user";
import { LinkStyle } from "src/util/Style";
import { collection, getDocs, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function HomeHeader() {
  const user = useSelector((state) => state.users.user);
  const search = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (checkuid) => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);

      const initialTodos = [];

      querySnapshot.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        initialTodos.push(data);
      });
      const check = initialTodos.find((e) => e.id === checkuid);
      dispatch(initialization(check));
    };

    const authStateChangedCallback = (user) => {
      if (user) {
        fetchData(user.uid);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, authStateChangedCallback);

    return () => unsubscribe();
  }, [dispatch]);

  const logOut = async (event) => {
    event.preventDefault();
    await signOut(auth);
    dispatch(initialization(null));
  };

  const inputChcange = (e) => {
    dispatch(checkSearch(e.target.value));
  };

  const SubmitHandler = (event) => {
    event.preventDefault();
    navigate("/searchResult");
    dispatch(initialization(null));
  };

  return (
    <NavList>
      <NavPage>
        <LinkStyle to={"/"}>
          <SvgImage src="/CodeFeed.svg" alt="CodeFeed SVG" />
        </LinkStyle>
      </NavPage>
      <NavInformation>
        <form onSubmit={SubmitHandler}>
          <input
            type="text"
            placeholder="검색"
            value={search}
            onChange={inputChcange}
          />
        </form>
        {user ? (
          <Profile>
            <LinkStyle to={"/myPage"}>
              <UserDisplay>
                <ProfileName>{user.nickname}</ProfileName>
                <ProfileImage src={user.profileImg} alt="프로필 사진입니다." />
              </UserDisplay>
            </LinkStyle>
            <LogOutBtn onClick={logOut}>Logout</LogOutBtn>
          </Profile>
        ) : (
          <LinkStyle to={"/login"}>Login</LinkStyle>
        )}
      </NavInformation>
    </NavList>
  );
}

export default HomeHeader;

const NavList = styled.nav`
  display: flex;
  align-items: center;
  margin: 5px;
  padding: 5px;
  width: 100%;
  height: 50px;
  overflow-x: hidden;
`;

const NavPage = styled.ul`
  display: flex;
  align-items: center;
`;

const SvgImage = styled.img`
  width: 10vh;
  border-radius: 12px;
  opacity: 0.8;
`;

const NavInformation = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px;
  & input {
    border: none;
    height: 40px;
    border-radius: 25px;
    padding: 10px;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
`;

const UserDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileName = styled.label`
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const LogOutBtn = styled.button`
  border: none;
  height: 30px;
  margin: 8px;
  font-size: 12px;
`;
