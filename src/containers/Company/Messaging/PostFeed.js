import React, { Component } from "react";
import PostItem from "./PostItem";

class PostFeed extends Component {
  render() {
    const { posts } = this.props;
    console.log(posts);
    return posts.map(post => <PostItem key={post.id} post={post} />);
  }
}

export default PostFeed;
