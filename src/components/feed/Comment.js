import React from 'react';
import propTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id:Int!) {
    deleteComment(id:$id) {
      ok
    }
  }
`;

const CommentContainer = styled.div``;

const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Comment({id, isMine, author, payload, photoId}) {
  console.log(payload);
  const updateDeleteComment = (cache, result) => {
    const { data: {deleteComment: {ok, error}} } = result;
    if(ok) {
      cache.evict({id: `Comment:${id}`});
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          }
        }
      })
    }
  }
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id
    },
    update: updateDeleteComment
  })
  const onDeleteClick = () => {
    deleteCommentMutation();
  }
  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      <CommentCaption>
        {payload.split(" ").map(
          (word, index) => /#[\w]+/.test(word) ? 
          <React.Fragment key={index}><Link to ={`/hashtags/${word}`}>{word}</Link>{" "}</React.Fragment> : 
          <React.Fragment key={index}>{word}{" "}</React.Fragment>
        )}
      </CommentCaption>
      {isMine ? <button onClick={onDeleteClick}>x</button> : null}
    </CommentContainer>
  )
} 

Comment.propTypes = {
  isMine: propTypes.bool,
  id: propTypes.number,
  photoId: propTypes.number,
  author: propTypes.string.isRequired,
  payload: propTypes.string.isRequired
}

export default Comment;