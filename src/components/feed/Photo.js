import { faBookmark, faComment, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import {faHeart as SolidHeart} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import propTypes from "prop-types";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import Comments from "./Comments";
import { Link } from "react-router-dom";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 20px;
  max-width: 615px;
  `;

const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  width: 100%;
  height: 600px;
  object-fit: contain;
`;

const PhotoData = styled.div`
  padding: 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  display: block;
  margin-top: 15px
`;

function Photo({id, user, file, isLiked, likes, caption, commentNumber, comments, isMine}) {
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: {ok},
      }
    } = result;
    if(ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if(isLiked) {
              return prev - 1
            }
            return prev + 1
          }
        }
      })
    }
  };
  const [toggleLikeMutation, {loading}] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id
    },
    update: updateToggleLike,
  });
  return (
    <PhotoContainer>
      <PhotoHeader>
        <Link to={`/users/${user.username}`}>
        <Avatar url={user.avatar} lg/>
        </Link>
        <Link to={`/users/${user.username}`}>
          <Username>{user.username}</Username>
        </Link>
      </PhotoHeader>
      <PhotoFile src={file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={toggleLikeMutation}>
              <FontAwesomeIcon
                style={{color: isLiked ? "tomato": "inherit"}}
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction><FontAwesomeIcon icon={faComment} /></PhotoAction>
            <PhotoAction><FontAwesomeIcon icon={faPaperPlane} /></PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon size={"2x"} icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 likes" : `${likes} likes`}</Likes>
        <Comments 
          photoId={id}
          author={user.username}
          caption={caption}
          commentNumber={commentNumber}
          comments={comments}
          isMine={isMine}
        />
      </PhotoData>
    </PhotoContainer>
  )
}

Photo.propTypes = {
  id: propTypes.number.isRequired,
  user: propTypes.shape({
    avatar: propTypes.string,
    username: propTypes.string.isRequired
  }),
  file: propTypes.string.isRequired,
  isLiked: propTypes.bool.isRequired,
  likes: propTypes.number.isRequired,
  caption: propTypes.string,
  commentNumber: propTypes.number.isRequired,
  isMine: propTypes.bool.isRequired
};

export default Photo;
