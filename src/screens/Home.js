import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../components/fragments";
import PageTitle from "../components/PageTitle";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

function Home() {
  const { data, error } = useQuery(FEED_QUERY);
  console.log(data);
  return (
    <div>
      <PageTitle title="Home" />
      {
      data?.seeFeed?.map((photo) => (
        <Photo 
          key={photo.id} 
          {...photo}
        />
      ))}
    </div>
  )
}
export default Home 