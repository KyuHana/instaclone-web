import propTypes from "prop-types";
import styled from "styled-components";
import Comment from "./Comment";

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  display: block;
  margin: 10px 0px;
  font-size: 12px;
  font-weight: 600;
`;

function Comments({author, caption, commentNumber, comments}) {
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map(comment => 
        <Comment key={comment.id} author={comment.user.username} payload={comment.payload} />
      )}
    </CommentsContainer>
  )
}

Comments.propTypes = {
  author: propTypes.string.isRequired,
  caption: propTypes.string,
  commentNumber: propTypes.number.isRequired,
  comments: propTypes.arrayOf(propTypes.shape({
    id: propTypes.number.isRequired,
    user: propTypes.shape({
      avatar: propTypes.string,
      username: propTypes.string.isRequired
    }),
    payload: propTypes.string.isRequired,
    isMine: propTypes.bool.isRequired,
    createdAt: propTypes.string.isRequired
  }))
}

export default Comments;