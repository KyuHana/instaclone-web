import { gql, useMutation } from "@apollo/client";
import propTypes from "prop-types";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import Comment from "./Comment";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

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

function Comments({photoId, author, caption, commentNumber, comments, isMine}) {
  const {data: userData} = useUser()
  const { register, handleSubmit, setValue, getValues } = useForm();
  const createCommentUpdate = (cache, result) => {
    const {data: {createComment: {ok, id}}} = result;
    if(ok && userData?.me) {
      const {payload} = getValues();
      setValue("payload", "");
      const newComment = {
        __typename: " Comment",
        createdAt: Date.now(),  
        id,
        isMine,
        payload,
        user: {
          ...userData.me
        }
      };
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment BSName on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `
      });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment]
          }
        }
      })
    }
  }
  const [createCommentMutation, {loading}] = useMutation(CREATE_COMMENT_MUTATION, {
    update: createCommentUpdate
  });
  
  const onValid = (data) => {
    const {payload} = data;
    if(loading) {
      return;
    }
    createCommentMutation({
      variables: {
        photoId,
        payload
      }
    });
  }
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map(comment => 
        <Comment key={comment.id} id={comment.id} photoId={photoId} isMine={comment.isMine}  author={comment?.user?.username} payload={comment.payload} />
      )}
      <div>
        <form onSubmit={handleSubmit(onValid)}>
          <input name="payload" ref={register({required: true})} type="text" placeholder="Write a comment..." />
        </form>
      </div>
    </CommentsContainer>
  )
}

Comments.propTypes = {
  photoId: propTypes.number.isRequired,
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