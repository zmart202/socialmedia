import React, { Component } from "react";
import classnames from "classnames";

class PostItem extends Component {
  onLikeClick(id) {
    this.props.addLike(id);
  }

  render() {
    const { post } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <p className="text-center">| Question | </p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text} </p>
          </div>
        </div>
      </div>
    );
  }
}

export default PostItem;
