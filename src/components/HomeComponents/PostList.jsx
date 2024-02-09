import styled from "styled-components";
import { useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "src/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addTodos } from "src/redux/modules/postList";
import { Link, useParams } from "react-router-dom";

function PostList() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { post } = useSelector((state) => state.postList);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "posts"));
      const querySnapshot = await getDocs(q);

      const initialTodos = [];

      querySnapshot.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        initialTodos.push(data);
      });
      dispatch(addTodos(initialTodos));
    };
    fetchData();
  }, []);

  if (post === null) return <div>포스트가 없습니다.</div>;
  if (id === undefined)
    return (
      <PostListMain>
        {post.map((e) => {
          return (
            <LinkStyle key={e.id} to={`/detail/${e.id}`}>
              <PostCard>
                <div>
                  <img src={e.image} />
                  <span>{e.title}</span>
                </div>
                <p>{e.name}</p>
              </PostCard>
            </LinkStyle>
          );
        })}
      </PostListMain>
    );
  return (
    <PostListMain>
      {post
        .filter((i) => {
          return i.language === id;
        })
        .map((e) => {
          return (
            <LinkStyle key={e.id} to={`/detail/${e.id}`}>
              <PostCard>
                <div>
                  <img src={e.image} />
                  <span>{e.title}</span>
                </div>
                <p>{e.name}</p>
              </PostCard>
            </LinkStyle>
          );
        })}
    </PostListMain>
  );
}

export default PostList;

const PostListMain = styled.main`
  min-height: 400px;
  height: auto;
  margin: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: center;
`;

const PostCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 315px;
  height: 236px;
  margin: 5px;
  & span {
    position: relative;
    bottom: 100%;
    height: 99%;
    visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    border-radius: 12px;
    color: white;
    background-color: rgba(0, 0, 0, 0.4);
  }
  & img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
  :hover {
    & span {
      visibility: visible;
    }
  }
`;

const LinkStyle = styled(Link)`
  text-decoration: none;
  color: black;
`;
