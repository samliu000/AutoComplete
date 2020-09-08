import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// TrieNode represents each letter in a word
function TrieNode(letter) {
  this.letter = letter;
  this.parent = null;
  this.children = {};
  this.isWord = false;
}

TrieNode.prototype.getWord = function() {
  var output = [];
  var node = this;
  
  while (node !== null) {
    output.unshift(node.letter);
    node = node.parent;
  }
  
  return output.join('');
};

function Trie() {
  this.root = new TrieNode(null);
}

Trie.prototype.insert = function(word) {
  var currNode = this.root;

  for(var i = 0; i < word.length; i++) {
    // if current letter is not there
    if(!currNode.children[word[i]]) {
      currNode.children[word[i]] = new TrieNode(word[i]);

      currNode.children[word[i]].parent = currNode;
    }

    currNode = currNode.children[word[i]];

    if(i === word.length - 1) {
      currNode.isWord = true;
    }
  }
}

function findAllChildrenWords(node, arr) {
  if(node.isWord) {
    arr.unshift(node.getWord());
  }

  for(var child in node.children) {
    findAllChildrenWords(node.children[child], arr);
  }
}

Trie.prototype.findAllWithPrefix = function(prefix) {
  var currNode = this.root;
  var output = [];

  for(var i = 0; i < prefix.length; i++) {
    if(currNode.children[prefix[i]]) {
      currNode = currNode.children[prefix[i]];
    } else {
      return output;
    }
  }

  findAllChildrenWords(currNode,output);

  return output;
}

class Autofill extends React.Component {
  constructor(props) {
    super(props);
    this.trie = new Trie();
    this.trie.insert("hello");
    this.trie.insert("helium");
    this.trie.insert("hehehehe");
    this.state = {
      options: [],
    }
  }

  handleChange(context) {
      var prefix = document.getElementById('inputbox').value;
      var outputs = context.trie.findAllWithPrefix(prefix);
      const autofillOps = outputs.map((word) => {
        return (
          <li>{word}</li>
        );
      });
      context.setState({options: autofillOps});
    };

  render() {
    console.log(this.options);
    return (
      <div>

        <input id="inputbox" placeholder="Enter some text" name="name" onChange={(i) => this.handleChange(this)}/>
        <ol>{this.state.options}</ol>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Autofill />,
  document.getElementById('root')
);
