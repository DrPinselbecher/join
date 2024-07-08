
// general:

let content = document.getElementById('content');

// board site:

let highestTaskId = 0;
let tasks = [];
let currentTaskStatus = 'small'
let resizeTimer;
let lastAnimationTimestamp = 0;
let mininamLoadingElementJoinTime = 1000;
let textSlideAnimationTimer;
let currentDraggedTaskId;
let isDragging = false;
let scrollIntervalInDragAndDrop = null;
let longPressTimer;
let isScrolling = false;
let currentTouchedTaskLineId = null;

// add task site:

let currentPrioriyToCreateTask = 'Low';