//you can get the user info by connect this useUser hook
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
    }
  }
`;

function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const {data, error} = useQuery(ME_QUERY, {
    skip: !hasToken
  });
  useEffect(() => {
    if(data?.me === null) { // 이 코드가 작동되는 이유는 클라이언트 쪽에서 서버쪽으로 토큰을 보내지 않아서이다
      console.log("there is a token on localstorage but the token did not work on the backend");
      logUserOut();
    }
  }, [data])
  return {data};
}

export default useUser;