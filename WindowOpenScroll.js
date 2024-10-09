// Create the observer like the examples above
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('content_window_animation');
      return;
    }

    //entry.target.classList.remove('content_window_animation');
  });
});

// Get multiple elements instead of a single one using "querySelectorAll"
const squares = document.querySelectorAll('.content_window');

// Loop over the elements and add each one to the observer
squares.forEach((element) => observer.observe(element));