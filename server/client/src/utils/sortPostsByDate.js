export default (posts, { sortBy }) => {
    return posts.sort((a, b) => {
      if (sortBy === 'newest') {
        return a.timestamp < b.timestamp ? 1 : -1;
      } if (sortBy === 'oldest') {
        return a.amount > b.amount ? -1 : 1;
      }
      return -1;
    });
  }