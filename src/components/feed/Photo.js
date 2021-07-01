import { faBookmark, faComment, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import {faHeart as SolidHeart} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import propTypes from "prop-types";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import Comments from "./Comments";

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

function Photo({id, user, file, isLiked, likes, caption, commentNumber, comments}) {
  const updateToggleLike = (cache, result) => {
    const {
      data: {
          toggleLike: {ok},
        },
      } = result;
    if(ok) {
      const fragmentId = `Photo:${id}`;
      const fragment = gql`
        fragment heart on Photo {
          isLiked
          likes
        }
      `;
      const result = cache.readFragment({
        id: fragmentId,
        fragment
      });
      if("isLiked" in result && "likes" in result) {
        const {isLiked: cacheIsLiked, likes: cacheLikes} = result;
        cache.writeFragment({
          id: fragmentId,
          fragment: fragment,
          data: {
            isLiked: !cacheIsLiked,
            likes: cacheIsLiked ? cacheLikes - 1 : cacheLikes + 1 
          }
      })
      }
      
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
        <Avatar url={user.avatar} lg/>
        <Username>{user.username}</Username>
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
          author={user.username}
          caption={caption}
          commentNumber={commentNumber}
          comments={comments}
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
  
};

export default Photo;
