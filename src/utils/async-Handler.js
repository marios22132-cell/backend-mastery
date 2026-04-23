const asyncHandler = (requestHandler) => { return (req, res, next)=> {
    Promise.resolve(requestHandler(req, res, next)).catch(err => next(err));
}}

export {asyncHandler};Error: Unauthorized
    at file:///Users/pogiatzeas/Desktop/Full_stack_Dev/Project%20camp%20Overview/src/middlewares/auth.middleware.js:11:15
    at file:///Users/pogiatzeas/Desktop/Full_stack_Dev/Project%20camp%20Overview/src/utils/async-Handler.js:2:21
    at Layer.handleRequest (/Users/pogiatzeas/Desktop/Full_stack_Dev/Project camp Overview/node_modules/router/lib/layer.js:152:17)
    at next (/Users/pogiatzeas/Desktop/Full_stack_Dev/Project camp Overview/node_modules/router/lib/route.js:157:13)
    at Route.dispatch (/Users/pogiatzeas/Desktop/Full_stack_Dev/Project camp Overview/node_modules/router/lib/route.js:117:3)
    at handle (/Users/pogiatzeas/Desktop/Full_stack_Dev/Project camp Overview/node_modules/router/index.js:435:11)
    at Layer.handleRequest (/Users/pogiatzeas/Desktop/Full_stack_Dev/Project camp Overview/node_modules/router/lib/layer.js:152:17)
    at /Users/pogiatzeas/Desktop/Full_stack_Dev/Project camp Overview/node_modules/router/index.js:295:15
    at processParams (/Users/pogiatzeas/Desktop/Full_stack_Dev/Project camp Overview/node_modules/router/index.js:582:12)
    at next (/Users/pogiatzeas/Desktop/Full_stack_Dev/Project camp Overview/node_modules/router/index.js:291:5)