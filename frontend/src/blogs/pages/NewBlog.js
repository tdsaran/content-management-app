import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { SERVICE_ROUTES } from '../../shared/routes';
import './BlogForm.css';

const NewBlog = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const blogSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        SERVICE_ROUTES.BLOGS,
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          creator: auth.userId
        }),
        { 'Content-Type': 'application/json' }
      );
      history.goBack();
    } catch (err) { }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="blog-form" onSubmit={blogSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD BLOG
        </Button>
        <Button inverse onClick={() => history.goBack()}>
          CANCEL
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewBlog;
