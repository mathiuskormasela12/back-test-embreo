// ========== Response
// import all modules
const config = require('../config')

module.exports = (req, res, status, success, message, results, totalPages, totalData, currentPage) => {
  if (results && Array.isArray(results) && totalPages && totalData && currentPage) {
    return res.status(status).json({
      message,
      status,
      success,
      results,
      pageInfo: {
        totalPages,
        totalData,
        currentPage,
        previousPage: (currentPage > 1) ? `${config.app_url}${req.path}${req.query ? `?${Object.keys(req.query).map((item, index) => `${item}=${item === 'page' ? `${Number(Object.values(req.query)[index]) - 1}` : Object.values(req.query)[index]}`).join('&')}` : ''}` : null,
        nextPage: (currentPage < totalPages) ? `${config.app_url}${req.path}${req.query ? `?${Object.keys(req.query).map((item, index) => `${item}=${item === 'page' ? `${Number(Object.values(req.query)[index]) + 1}` : Object.values(req.query)[index]}`).join('&')}` : ''}` : null
      }
    })
  } else if (results && !Array.isArray(results)) {
    return res.status(status).json({
      message,
      status,
      success,
      results
    })
  } else {
    return res.status(status).json({
      message,
      status,
      success
    })
  }
}
