import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { ROUTES, SERVICE_ROUTES } from '../../shared/routes'
import './BlogItem.css';

const BlogItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${SERVICE_ROUTES.BLOGS}/${props.id}`,
        'DELETE'
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="blog-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this blog?
        </p>
      </Modal>
      <li className="blog-item">
        <Card className="blog-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="blog-item__info">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
          </div>
          <div className="blog-item__actions">
            {(auth.userId === props.creatorId || auth.isAdmin) && (
              <Button to={`${ROUTES.BLOGS}/${props.id}`}>EDIT</Button>
            )}

            {(auth.userId === props.creatorId || auth.isAdmin) && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default BlogItem;
