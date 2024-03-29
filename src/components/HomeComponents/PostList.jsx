import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "src/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "src/redux/modules/postList";
import { LinkStyle } from "src/util/Style";
import Loading from "../Loading";

function PostList() {
  const post = useSelector((state) => state.postList.post);
  const { id } = useParams();
  const dispatch = useDispatch();

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

      dispatch(addPost(initialTodos));
    };
    fetchData();
  }, []);

  if (post === null) return <Loading />;
  if (id === undefined)
    return (
      <PostListMain>
        {post.map((e) => {
          return (
            <LinkStyle key={e.id} to={`/detail/${e.id}`}>
              <PostCard>
                <div>
                  <img src={e.image} alt="게시글 이미지 입니다." />
                  <span>{e.title}</span>
                </div>
                <p>{e.nickname}</p>
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
                  <img src={e.image} alt="게시글 이미지 입니다." />
                  <span>{e.title}</span>
                </div>
                <p>{e.nickname}</p>
              </PostCard>
            </LinkStyle>
          );
        })}
    </PostListMain>
  );
}

export default PostList;

const PostListMain = styled.ol`
  min-height: 400px;
  height: auto;
  margin: 3% 5%;
  display: grid;
  grid-gap: 36px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  list-style: none;
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
    height: 100%;
    opacity: 0;
    visibility: none;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    color: white;
    background-color: rgba(0, 0, 0, 0.56);
    transition: all 0.25s ease-in-out;
    //margin-bottom: 10px;
  }
  & img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
  :hover {
    & span {
      opacity: 1;
      visibility: visible;
    }
  }
`;
