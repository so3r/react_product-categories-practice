import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = productsFromServer
    .filter(product => {
      const category = categoriesFromServer.find(
        cat => cat.id === product.categoryId,
      );
      const user = usersFromServer.find(usr => usr.id === category.ownerId);

      return (
        (!selectedUser || user.id === selectedUser) &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .map(product => {
      const category = categoriesFromServer.find(
        cat => cat.id === product.categoryId,
      );
      const user = usersFromServer.find(usr => usr.id === category.ownerId);

      return {
        ...product,
        category,
        user,
      };
    });

  const resetFilters = () => {
    setSelectedUser(null);
    setSearchQuery('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p
              className="panel-heading has-background-white-ter
            has-text-dark"
            >
              Filters
            </p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                className={!selectedUser ? 'is-active' : ''}
                onClick={() => setSelectedUser(null)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  href="#/"
                  key={user.id}
                  className={selectedUser === user.id ? 'is-active' : ''}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block">
              <button
                type="button"
                data-cy="ResetAllButton"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        product.user?.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
