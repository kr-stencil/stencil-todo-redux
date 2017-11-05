exports.config = {
  bundles: [
    { components: ['todo-list', 'my-todo'] }
  ],
  collections: [
    { name: '@stencil/router' }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
