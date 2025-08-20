
const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data
  };
};

const parseFilters = (query) => {
  const filters = {};
  const { name, email, address, role, sortBy, sortOrder } = query;
  
  if (name) filters.name = name;
  if (email) filters.email = email;
  if (address) filters.address = address;
  if (role) filters.role = role;
  if (sortBy) filters.sortBy = sortBy;
  if (sortOrder) filters.sortOrder = sortOrder;
  
  return filters;
};

module.exports = {
  formatResponse,
  parseFilters
};