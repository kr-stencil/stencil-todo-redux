import { Component, Prop, State } from '@stencil/core';
import { StoreManager } from '../store/store-manager';

@Component({
  tag: 'my-todo'
})
export class Todo {
  @Prop({ connect: 'store-manager' }) storeManagerLoader;
  @State() storeManager: StoreManager;

  @Prop() value: string;
  @Prop() id: string;
  @State() isEditable = false;

  componentWillLoad() {
    this.getStoreService();
  }

  getStoreService() {
    this.storeManagerLoader.componentOnReady().then((cmp) => {
      this.storeManager = cmp.$instance;
    });
  }

  removeThisTodo = () => {
    this.storeManager.delete(this.id);
  }

  updateThisTodo(id, value) {
    this.storeManager.update(id, value);
  }

  toggleEdition = () => {
    this.isEditable = !this.isEditable;
  }

  handleKeyDown = (e) => {
    if (e.code === 'Enter') {
      this.updateThisTodo(this.id, e.target.value);
      this.isEditable = false;
    }
  }

  render() {
    let todoTemplate;

    if (!this.isEditable) {
      todoTemplate = <div>

        {this.value}

        <button onClick = {this.removeThisTodo}>
          X
        </button>

      </div>
    } else {
      todoTemplate = <div>

        <input value={this.value} onKeyDown={this.handleKeyDown} />

      </div>
    }

    return (
      <li onDblClick= {this.toggleEdition}>
        {todoTemplate}
      </li>
    );
  }
}
