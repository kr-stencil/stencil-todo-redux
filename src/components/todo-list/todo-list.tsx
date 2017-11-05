import { Component, Prop, State } from '@stencil/core';
import { createStore } from 'redux';
import { StoreManager } from '../store/store-manager';

@Component({
  tag: 'todo-list',
  styleUrl: 'todo-list.scss'
})
export class TodoList {
  @State() todos: any;
  @State() newTodo;
  @State() store;

  @Prop({ connect: 'store-manager' }) storeManagerLoader;

  @State() storeManager: StoreManager;

  componentWillLoad() {
    this.getStoreService();

    const preloadedState = [ {id:1, value:'Hello'} ];

    this.store = createStore<any>(this.todoReducer, preloadedState);

    this.todos = this.store.getState();

    this.store.subscribe(() =>{
      this.todos = this.store.getState();
    });
  }

  getStoreService() {
    this.storeManagerLoader.componentOnReady().then((cmp) => {
      this.storeManager = cmp.$instance;
      this.storeManager.setStore(this.store);
    });
  }

  todoReducer(state, action) {
    switch (action.type) {
      case 'CREATE':
        state = [...state, action.payload];
        return state;
      case 'DELETE':
        state = state.filter((todo) => {
          return todo.id !== action.payload.id;
        });
        return state;
      case 'UPDATE':
        const todos = state.concat([]);

        let todoToUpdate = todos.filter((todo) => {
          return todo.id === action.payload.id;
        })[0];

        todoToUpdate.value = action.payload.value;

        state = todos;
        return state;
      default:
        return state;
    }
  }

  addNewTodo (newTodo) {
    this.storeManager.create(newTodo.value);
  }

  render() {
    return(
      <div>

        <input onChange={e => this.addNewTodo(e.target)} />

        <ul>

          {this.todos
            ? <div>
              {this.todos.map((todo) => {
                return <my-todo
                         id={todo.id}
                         value={todo.value}></my-todo>
              })}
            </div>
            : <div></div>
          }
        </ul>

      </div>
    )
  }
}
