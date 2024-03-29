import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { auth, db, storage } from "src/firebase";
import styled from "styled-components";

function ImageChange({ user, dispatchUser }) {
  const [previewImg, setPreviewImg] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const hiddenFileInput = useRef(null);

  const fileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    let fileRead = new FileReader();
    fileRead.onload = function () {
      setPreviewImg(fileRead.result);
    };
    fileRead.readAsDataURL(event.target.files[0]);
  };

  const handClick = () => {
    hiddenFileInput.current.click();
  };

  const handleUpload = async () => {
    if (selectedFile.length === 0) {
      alert("이미지를 넣어주시기 바랍니다.");
      return;
    }
    const imageRef = ref(storage, `${auth.currentUser.uid}/profileImage`);
    await uploadBytes(imageRef, selectedFile);

    const postRef = doc(db, "users", `${user.id}`);
    const downloadUrl = await getDownloadURL(imageRef);
    await updateDoc(postRef, {
      profileImg: downloadUrl,
    });

    dispatchUser({ ...user, profileImg: downloadUrl });
    setSelectedFile([]);
    setPreviewImg([]);
  };

  return (
    <>
      <p>Image Change</p>
      <ImageChangeSection>
        <ImageStyle src={user.profileImg} />
        <ChangeBtn onClick={handClick}>Image Upload</ChangeBtn>
        {previewImg.length === 0 ? false : <ImageStyle src={previewImg} />}
        <InputStyle type="file" ref={hiddenFileInput} onChange={fileChange} />
        <ChangeBtn onClick={handleUpload}>Image Change</ChangeBtn>
        <p>{user.reloadListener}</p>
      </ImageChangeSection>
    </>
  );
}

export default ImageChange;

const ImageChangeSection = styled.section`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 90%;
  height: 20vh;
  margin: 5%;
`;

const ImageStyle = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const ChangeBtn = styled.button`
  border: none;
  width: 130px;
  height: 40px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 1px 1px 5px 1px gray;
`;

const InputStyle = styled.input`
  display: none;
`;
