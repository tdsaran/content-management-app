import React from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';
import userIcon from '../../../src/assets/user_icon.png'

const UsersList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={userIcon}
          name={user.name}
          blogsCount={user.blogs.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
