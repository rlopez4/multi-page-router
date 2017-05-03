# Multi Page Router

Routing for non single page applications or applications that don't need history. Multi page router allows you to call a set of functions on page load using express style path strings (e.g. `/foo/:bar`).

*Heavily inspired by [page.js](https://github.com/visionmedia/page.js)*

## Usage

```JavaScript
multiPageRouter({
  'foo' : [cb1, cb2],
  'foo/:bar' : cb,
  '*' : [cb1, cb3]
})
```
