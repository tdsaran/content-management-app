import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import BlogItem from './BlogItem';
import Button from '../../shared/components/FormElements/Button';
import './BlogList.css';
import { AuthContext } from '../../shared/context/auth-context';
import { ROUTES } from '../../shared/routes'

const BlogList = props => {
  const auth = useContext(AuthContext);
  const userIdFromParams = useParams().userId;

  if((!userIdFromParams || userIdFromParams === auth.userId) && props.items.length === 0) {
    return (
      <div className="blog-list center">
        <Card>
          <h2>No blogs found. Maybe create one?</h2>
          <Button to={ROUTES.BLOGS_NEW}>Create Blog</Button>
        </Card>
      </div>
    );
  }
  else if(props.items.length === 0) {
    return (
      <div className="blog-list center">
        <Card>
          <h2>No blogs found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-add-container">
        {(!userIdFromParams || userIdFromParams === auth.userId || auth.isAdmin) && (
          <Button to={ROUTES.BLOGS_NEW}>ADD</Button>
        )}
      </div>
      <ul className="blog-list">
        {props.items.map(blog => (
          <BlogItem
            key={blog._id}
            id={blog._id}
            title={blog.title}
            description={blog.description}
            creatorId={blog.creator}
            onDelete={props.onDeleteBlog}
          />
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
