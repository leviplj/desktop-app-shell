let req = require.context("./", false, /^(?!.*index.js)((.*\.(js\.*))[^.]*$)/)
req.keys().forEach(function(key){
  req(key);
});