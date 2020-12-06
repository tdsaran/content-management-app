import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import BlogList from '../components/BlogList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { SERVICE_ROUTES } from '../../shared/routes';

const UserBlogs = () => {
  const [loadedBlogs, setLoadedBlogs] = useState();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userIdFromParams = useParams().userId;
  const userId = (!userIdFromParams ? auth.userId : userIdFromParams);

  useEffect(() => {
    
    const url = (auth.isAdmin 
      ? SERVICE_ROUTES.BLOGS 
      : `${SERVICE_ROUTES.USER_BLOGS}/${userId}` )

    const fetchBlogs = async () => {
      try {
        const responseData = await sendRequest(
          url
        );
        setLoadedBlogs(responseData.blogs);
      } catch (err) {}
    };
    fetchBlogs();
  }, [sendRequest, userId, auth.isAdmin]);

  const blogDeletedHandler = deletedBlogId => {
    setLoadedBlogs(prevBlogs =>
      prevBlogs.filter(blog => blog._id !== deletedBlogId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBlogs && (
        <BlogList items={loadedBlogs} onDeleteBlog={blogDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserBlogs;
