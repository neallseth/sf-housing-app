import { NextResponse } from "next/server";
import { fetchFromTwitter } from "../../../../lib/utils/data";

const DATA_SOURCE_URL =
  "https://api.twitter.com/2/users/946482612167639040/following";

export async function GET() {
  let cursor = null;
  let getFollowing: User[] = [];

  do {
    const res = await fetchFromTwitter(
      `${DATA_SOURCE_URL}${cursor ? `?pagination_token=${cursor}` : ""}`
    );

    const data = await res.json();
    getFollowing = [...getFollowing, ...data.data];
    cursor = data.meta.next_token;
  } while (cursor);

  return NextResponse.json(getFollowing);
}
