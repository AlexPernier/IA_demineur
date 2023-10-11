var globalStartTime = performance.now(); //calculate performance

//Global variables

//start and finish nodes. Could be chosen dynamically
var startingNode; //to store the DOM starting node
var goalNode; //to store the DOM finishing node
var gr; //gc == goal column
var gc; //gr == goal row,

//Grid size
var start = 2;
var finish = 77;
var gridWidth = 10;
var gridHeight = 10;


//We call the clickableGrid function and store the result in a grid variable
var grid = clickableGrid(gridWidth, gridHeight, myCallback);

//we append the generated grid to the <div id="grid-container"> tag
document.getElementById('grid-container').appendChild(grid);

///////////////////////////////////////////////////////////////////////////////////////////////////
//Callback function (called on a cell click)
///////////////////////////////////////////////////////////////////////////////////////////////////
function myCallback(node, row, col, i) {
  if (i != start && i != finish) {
    node.toggleAttribute('notwalkable');
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////
//Clickable grid function
///////////////////////////////////////////////////////////////////////////////////////////////////
//It generates an HTML / DOM <table> which triggers a function when a <td> (our nodes) is clicked
function clickableGrid(rows, cols, callback, gridId = 'grid1', hasCost = false) {

  let i = 0; //nodes #ID
  let htmlTableGrid = document.createElement('table'); //We create a DOM <table> element
  htmlTableGrid.className = 'grid'; //add the CSS class .grid to the <table> element
  htmlTableGrid.id = gridId;

  for (let c = 0; c < cols; ++c) { //for each column
    let tr = htmlTableGrid.appendChild(document.createElement('tr')); //we create a <tr>

    for (let r = 0; r < rows; ++r) { //for each row

      let node = tr.appendChild(document.createElement('td')); //we create a <td> (our nodes)

      node.id = gridId + '_' + i; //we add an ID attribute to the <td>
      node.setAttribute('row', r); //we set a row attribute with the row value
      node.setAttribute('col', c); //we set a col attribute with the col value

      let cost = 1;
      if (hasCost) cost = Math.floor(Math.random() * 9) + 1; //random cost between 1 and 10
      node.setAttribute('cost', cost); //we set a cost attributes

      node.innerHTML = cost + '<br>' + '[' + r + ',' + c + ']'; //What we display in the <td>

      //Starting and Finishing nodes
      if (i == start) {
        node.innerHTML = 'S';
        node.classList.add('start'); //if starting node, give the .start CSS class
        startingNode = node; //global variable
      }
      if (i == finish) {
        node.innerHTML = 'F';
        node.classList.add('finish'); //if finish node, give the .finish CSS class
        goalNode = node;  //global variable
        gr = parseInt(goalNode.attributes.row.value);  //global variable
        gc = parseInt(goalNode.attributes.col.value);  //global variable
      }

      //We add an event listener on the node
      //The click event will trigger a callback function
      //The callback function is defined when we call the clickableGrid function (see below)
      node.addEventListener('click', (function (node, r, c, i) {
        return function () {
          callback(node, r, c, i);
        }
      })(node, r, c, i), false);

      i++; //increase node #ID

    }
  }

  return htmlTableGrid;
}
///////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////
//Click events to trigger algorithms
///////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById('bfs').addEventListener('click', function () { bfs(grid, start, finish) });
document.getElementById('dfs').addEventListener('click', function () { dfs(grid, start, finish) });
document.getElementById('best-first').addEventListener('click', function () { bestFirst(grid, start, finish) });
document.getElementById('dijkstra').addEventListener('click', function () { dijkstra(grid, start, finish) });
document.getElementById('astar').addEventListener('click', function () { astar(grid, start, finish) });

///////////////////////////////////////////////////////////////////////////////////////////////////
//Nodes functions
///////////////////////////////////////////////////////////////////////////////////////////////////

//Get <td> DOM element from given #ID
function getNode(id) {
  return document.getElementById(id);
}

//Get neighboring <td> DOM elements from given node
//@param: node : current node
//@param: gridId : DOM container #ID, useful if there's more than one grid in the page
function getNodeNeighbors(node, gridId = 'grid1') {

  let neighbors = []; //returned array

  //current node row and col
  let row = parseInt(node.getAttribute('row'));
  let col = parseInt(node.getAttribute('col'));

  let neighbor; //local variable

  if (row - 1 >= 0) { //The neighbor above our current node should exist in the grid
    neighbor = document.querySelector('#' + gridId + ' td[row="' + (row - 1) + '"][col="' + col + '"]');
    if (neighbor && !neighbor.hasAttribute('notwalkable')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }

  //needs to be completed for all neighbors

  return neighbors;
}

//Draw the path, for when the goal is found
function drawPath(node) {
  while (node.hasAttribute('parent')) {
    node.classList.add('path');
    node = document.getElementById(node.getAttribute('parent'));
  }
}

//reset grid before calling a search algorithm
function clearGrid() {
  grid.querySelectorAll('td').forEach(td => {
    td.removeAttribute('visited');
    td.removeAttribute('parent');
    td.classList.remove('path');
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//Search algorithms
///////////////////////////////////////////////////////////////////////////////////////////////////

//Simple Breadth-First Search
function bfs(grid, start, finish) {
  console.log('In bfs()');
  clearGrid();

  let startTime = performance.now(); //for performance stats
  let nodesVisited = 1; //for stats

  let visited = []; //for storing already visited nodes
  let queue = []; //for queuing nodes to explore

  if (startingNode) {
    queue.push(startingNode); //if starting node exists we add it to the queue
    visited.push(startingNode); //we add it to the visited
    startingNode.setAttribute('visited', true); //we add the visited attribute for CSS purposes
  }

  while (queue.length > 0) { //we keep exploring until the queue is empty

    // console.log('Queue:', queue);
    // console.log('Visited', visited);

    let currentNode = queue.shift(); // .shift() removes and returns the first element of queue

    // get neighboring nodes
      //explore neighbors
      //add neighbors to queue and visited ?
      //set DOM attribute 'visited' to true
      //set DOM attribute 'parent' to current node -> needed to draw path at the end
  }

  let endTime = performance.now();
  console.log(`BFS has finished visiting ${nodesVisited} nodes in ${endTime - startTime} milliseconds`);
}

//Depth-first search algorithm
function dfs(grid, start, finish) {
  console.log('In dfs()');
  clearGrid();

  let startTime = performance.now(); //for performance stats
  let nodesVisited = 1; //for stats

  //...

  let endTime = performance.now();
  console.log(`DFS has finished visiting ${nodesVisited} nodes in ${endTime - startTime} milliseconds`);
}

function bestFirst(grid, start, finish) {
  console.log('In bestFirst()');
  clearGrid();
  let startTime = performance.now(); //for performance stats
  let nodesVisited = 1; //for stats

  //...

  let endTime = performance.now();
  console.log(`Best-First has finished visiting ${nodesVisited} nodes in ${endTime - startTime} milliseconds`);
}

function dijkstra(grid, start, finish) {
  console.log('In dijkstra()');

  clearGrid();
  let startTime = performance.now(); //for performance stats
  let nodesVisited = 1; //for stats

  //...

  let endTime = performance.now();
  console.log(`Dijkstra has finished visiting ${nodesVisited} nodes in ${endTime - startTime} milliseconds`);
}

function astar(grid, start, finish) {
  console.log('In astar()');
  clearGrid();
}

var globalEndTime = performance.now();
console.log(`Page init took ${globalEndTime - globalStartTime} milliseconds`);