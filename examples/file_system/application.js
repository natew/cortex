/** @jsx React.DOM */

var Node = React.createClass({displayName: 'Node',
  getInitialState: function() {
    return {editing: false, editText: ""};
  },
  edit: function() {
    this.setState({editing: true, editText: this.props.node.name.getValue()});
  },
  handleChange: function(event) {
    this.setState({editText: event.target.value});
  },
  update: function(event) {
    if(event.keyCode === 13) {
      this.setState({editing: false});
      this.props.node.name.set(event.target.value);
    }
  },
  render: function() {
    var nodeType, nodes, commands;
    var nameClass = React.addons.classSet({
      "node-name": true,
      "hide": this.state.editing
    });

    var editClass = React.addons.classSet({
      "edit-name": true,
      "hide": !this.state.editing
    });

    if (this.props.node.children) {
      nodeType = "folder";
      nodes = this.props.node.children.map(function(node) {
        return Node( {node:node} );
      });
    } else {
      nodeType = "file";
    }

    return(
      React.DOM.div( {className:nodeType}, 
        React.DOM.span( {className:"icon"}),
        React.DOM.span( {className:nameClass, onDoubleClick:this.edit}, 
          this.props.node.name.getValue()
        ),
        React.DOM.input( {className:editClass,
               value:this.state.editText,
               onChange:this.handleChange,
               onKeyPress:this.update} ),
        nodes
      )
    );
  }
});

var data = {name: "Desktop", children: [
  {name: "Applications", children: [
    {name: "Chrome"}, {name: "VLC"}, {name: "Mail"}
  ]},
  {name: "Media", children: [
    {name: "Photos", children: [
      {name: "By locations", children: [
        {name: "United States", children: [
          {name: "California", children: [
            {name: "San Francisco", children: [
              {name: "Mission", children: [
                {name: "delores.jpg"}, {name: "valencia.jpg"}, {name: "birite.png"}
              ]}
            ]}
          ]}
        ]}
      ]}
    ]},
    {name: "Videos", children: [
      {name: "movie1.mov"}, {name: "movie2.mov"}
    ]}
  ]},
  {name: "readme.txt"},
]};

var cortexData = new Cortex(data, function(updatedCortex) {
  fileSystemComponent.setProps({children: updatedCortex});
});

var fileSystemComponent = React.renderComponent(
  Node( {node:cortexData} ), document.getElementById("filesystem")
);
