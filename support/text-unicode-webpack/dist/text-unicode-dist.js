/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ot-text-unicode/dist/api.js":
/*!**************************************************!*\
  !*** ./node_modules/ot-text-unicode/dist/api.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n}); // Text document API for the 'text' type. This implements some standard API\n// methods for any text-like type, so you can easily bind a textarea or\n// something without being fussy about the underlying OT implementation.\n//\n// The API is desigend as a set of functions to be mixed in to some context\n// object as part of its lifecycle. It expects that object to have getSnapshot\n// and submitOp methods, and call _onOp when an operation is received.\n//\n// This API defines:\n//\n// - getLength() returns the length of the document in characters\n// - getText() returns a string of the document\n// - insert(pos, text, [callback]) inserts text at position pos in the document\n// - remove(pos, length, [callback]) removes length characters at position pos\n//\n// A user can define:\n// - onInsert(pos, text): Called when text is inserted.\n// - onRemove(pos, length): Called when text is removed.\n\nconst type_1 = __webpack_require__(/*! ./type */ \"./node_modules/ot-text-unicode/dist/type.js\");\n\nconst unicount_1 = __webpack_require__(/*! unicount */ \"./node_modules/unicount/index.js\");\n\nfunction api(getSnapshot, submitOp) {\n  return {\n    // Returns the text content of the document\n    get: getSnapshot,\n\n    // Returns the number of characters in the string\n    getLength() {\n      return getSnapshot().length;\n    },\n\n    // Insert the specified text at the given position in the document\n    insert(pos, text, callback) {\n      const uniPos = unicount_1.strPosToUni(getSnapshot(), pos);\n      return submitOp([uniPos, text], callback);\n    },\n\n    remove(pos, lengthOrContent, callback) {\n      const uniPos = unicount_1.strPosToUni(getSnapshot(), pos);\n      return submitOp([uniPos, {\n        d: lengthOrContent\n      }], callback);\n    },\n\n    // When you use this API, you should implement these two methods\n    // in your editing context.\n    //onInsert: function(pos, text) {},\n    //onRemove: function(pos, removedLength) {},\n    _onOp(op) {\n      type_1.eachOp(op, (component, prePos, postPos) => {\n        switch (typeof component) {\n          case 'string':\n            if (this.onInsert) this.onInsert(postPos, component);\n            break;\n\n          case 'object':\n            const dl = type_1.dlen(component.d);\n            if (this.onRemove) this.onRemove(postPos, dl);\n        }\n      });\n    },\n\n    onInsert: null,\n    onRemove: null\n  };\n}\n\nexports.default = api; // This triggers a bug in the typescript compiler, where it generates an\n// invalid typescript declaration file.\n//api.provides = {text: true}\n\n;\napi.provides = {\n  text: true\n};\n\n//# sourceURL=webpack:///./node_modules/ot-text-unicode/dist/api.js?");

/***/ }),

/***/ "./node_modules/ot-text-unicode/dist/index.js":
/*!****************************************************!*\
  !*** ./node_modules/ot-text-unicode/dist/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {\n  if (k2 === undefined) k2 = k;\n  Object.defineProperty(o, k2, {\n    enumerable: true,\n    get: function () {\n      return m[k];\n    }\n  });\n} : function (o, m, k, k2) {\n  if (k2 === undefined) k2 = k;\n  o[k2] = m[k];\n});\n\nvar __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {\n  Object.defineProperty(o, \"default\", {\n    enumerable: true,\n    value: v\n  });\n} : function (o, v) {\n  o[\"default\"] = v;\n});\n\nvar __importStar = this && this.__importStar || function (mod) {\n  if (mod && mod.__esModule) return mod;\n  var result = {};\n  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n\n  __setModuleDefault(result, mod);\n\n  return result;\n};\n\nvar __importDefault = this && this.__importDefault || function (mod) {\n  return mod && mod.__esModule ? mod : {\n    \"default\": mod\n  };\n};\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.type = exports.remove = exports.insert = void 0; // This is an implementation of the text OT type built on top of JS strings.\n// You would think this would be horribly inefficient, but its surpringly\n// good. JS strings are magic.\n\nconst unicount_1 = __webpack_require__(/*! unicount */ \"./node_modules/unicount/index.js\");\n\nconst type_1 = __importStar(__webpack_require__(/*! ./type */ \"./node_modules/ot-text-unicode/dist/type.js\"));\n\nconst api_1 = __importDefault(__webpack_require__(/*! ./api */ \"./node_modules/ot-text-unicode/dist/api.js\"));\n\nconst ropeImplUnicodeString = {\n  create(s) {\n    return s;\n  },\n\n  toString(s) {\n    return s;\n  },\n\n  builder(oldDoc) {\n    if (typeof oldDoc !== 'string') throw Error('Invalid document snapshot: ' + oldDoc);\n    const newDoc = [];\n    return {\n      skip(n) {\n        let offset = unicount_1.uniToStrPos(oldDoc, n);\n        if (offset > oldDoc.length) throw Error('The op is too long for this document');\n        newDoc.push(oldDoc.slice(0, offset));\n        oldDoc = oldDoc.slice(offset);\n      },\n\n      append(s) {\n        newDoc.push(s);\n      },\n\n      del(n) {\n        oldDoc = oldDoc.slice(unicount_1.uniToStrPos(oldDoc, n));\n      },\n\n      build() {\n        return newDoc.join('') + oldDoc;\n      }\n\n    };\n  },\n\n  slice: type_1.uniSlice\n};\nconst textString = type_1.default(ropeImplUnicodeString);\nconst type = Object.assign(Object.assign({}, textString), {\n  api: api_1.default\n});\nexports.type = type;\n\nexports.insert = (pos, text) => text.length === 0 ? [] : pos === 0 ? [text] : [pos, text];\n\nexports.remove = (pos, textOrLen) => type_1.dlen(textOrLen) === 0 ? [] : pos === 0 ? [{\n  d: textOrLen\n}] : [pos, {\n  d: textOrLen\n}];\n\nvar type_2 = __webpack_require__(/*! ./type */ \"./node_modules/ot-text-unicode/dist/type.js\");\n\nObject.defineProperty(exports, \"makeType\", {\n  enumerable: true,\n  get: function () {\n    return type_2.default;\n  }\n});\n\n//# sourceURL=webpack:///./node_modules/ot-text-unicode/dist/index.js?");

/***/ }),

/***/ "./node_modules/ot-text-unicode/dist/type.js":
/*!***************************************************!*\
  !*** ./node_modules/ot-text-unicode/dist/type.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/* Text OT!\n *\n * This is an OT implementation for text. It is the standard implementation of\n * text used by ShareJS.\n *\n * This type is composable and by default non-invertable (operations do not by\n * default contain enough information to invert them). Its similar to ShareJS's\n * old text-composable type, but its not invertable and its very similar to the\n * text-tp2 implementation but it doesn't support tombstones or purging.\n *\n * Ops are lists of components which iterate over the document. Components are\n * either:\n *\n * - A number N: Skip N characters in the original document\n * - \"str\": Insert \"str\" at the current position in the document\n * - {d:N}: Delete N characters at the current position in the document\n * - {d:\"str\"}: Delete \"str\" at the current position in the document. This is\n *   equivalent to {d:N} but provides extra information for operation\n *   invertability.\n *\n * Eg: [3, 'hi', 5, {d:8}]\n *\n * The operation does not have to skip the last characters in the document.\n *\n * Snapshots are by default strings.\n *\n * Cursors are either a single number (which is the cursor position) or a pair\n * of [anchor, focus] (aka [start, end]). Be aware that end can be before start.\n *\n * The actual string type is configurable. The OG default exposed text type uses\n * raw javascript strings, but they're not compatible with OT implementations in\n * other languages because string.length returns the wrong value for unicode\n * characters that don't fit in 2 bytes. And JS strings are quite an inefficient\n * data structure for manipulating lines & UTF8 offsets. For this reason, you\n * can use your own data structure underneath the text OT code.\n *\n * Note that insert operations themselves are always raw strings. Its just\n * snapshots that are configurable.\n */\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.uniSlice = exports.dlen = exports.eachOp = void 0;\n\nconst unicount_1 = __webpack_require__(/*! unicount */ \"./node_modules/unicount/index.js\");\n\nconst debugMode = false;\n/** Check the operation is valid. Throws if not valid. */\n\nconst checkOp = op => {\n  if (!Array.isArray(op)) throw Error('Op must be an array of components');\n  let last = null;\n\n  for (let i = 0; i < op.length; i++) {\n    const c = op[i];\n\n    switch (typeof c) {\n      case 'object':\n        // The only valid objects are {d:X} for +ive values of X or non-empty strings.\n        if (typeof c.d !== 'number' && typeof c.d !== 'string') throw Error('Delete must be number or string');\n        if (exports.dlen(c.d) <= 0) throw Error('Deletes must not be empty');\n        break;\n\n      case 'string':\n        // Strings are inserts.\n        if (!(c.length > 0)) throw Error('Inserts cannot be empty');\n        break;\n\n      case 'number':\n        // Numbers must be skips. They have to be +ive numbers.\n        if (!(c > 0)) throw Error('Skip components must be >0');\n        if (typeof last === 'number') throw Error('Adjacent skip components should be combined');\n        break;\n    }\n\n    last = c;\n  }\n\n  if (typeof last === 'number') throw Error('Op has a trailing skip');\n}; // TODO: Consider exposing this at the library level.\n// TODO: Also consider rewriting this to use es iterators instead of callback-passing style.\n\n\nfunction eachOp(op, fn) {\n  let prePos = 0,\n      postPos = 0;\n\n  for (let i = 0; i < op.length; i++) {\n    const c = op[i];\n    fn(c, prePos, postPos);\n\n    switch (typeof c) {\n      case 'object':\n        // Delete\n        prePos += exports.dlen(c.d);\n        break;\n\n      case 'string':\n        // Insert\n        postPos += unicount_1.strPosToUni(c);\n        break;\n\n      case 'number':\n        // Skip\n        prePos += c;\n        postPos += c;\n        break;\n    }\n  }\n}\n\nexports.eachOp = eachOp;\n\nfunction mapOp(op, fn) {\n  const newOp = [];\n  const append = makeAppend(newOp);\n  eachOp(op, (c, prePos, postPos) => {\n    append(fn(c, prePos, postPos));\n  });\n  return trim(newOp);\n}\n\nconst id = x => x;\n\nconst normalize = op => {\n  return mapOp(op, id);\n};\n/** Check that the given selection range is valid. */\n\n\nconst checkSelection = selection => {\n  // This may throw from simply inspecting selection[0] / selection[1]. Thats\n  // sort of ok, though it'll generate the wrong message.\n  if (typeof selection !== 'number' && (typeof selection[0] !== 'number' || typeof selection[1] !== 'number')) {\n    throw Error('Invalid selection');\n  }\n};\n\nexports.dlen = d => typeof d === 'number' ? d : unicount_1.strPosToUni(d);\n/** Make a function that appends to the given operation. */\n\n\nconst makeAppend = op => component => {\n  if (!component || component.d === 0 || component.d === '') {// The component is a no-op. Ignore!\n  } else if (op.length === 0) {\n    op.push(component);\n  } else if (typeof component === typeof op[op.length - 1]) {\n    if (typeof component === 'object') {\n      // Concatenate deletes. This is annoying because the op or component could\n      // contain strings or numbers.\n      const last = op[op.length - 1];\n      last.d = typeof last.d === 'string' && typeof component.d === 'string' ? last.d + component.d // Preserve invert information\n      : exports.dlen(last.d) + exports.dlen(component.d); // Discard invert information, if any.\n      // (op[op.length - 1] as {d:number}).d += component.d\n    } else {\n      // Concat strings / inserts. TSC should be smart enough for this :p\n      op[op.length - 1] += component;\n    }\n  } else {\n    op.push(component);\n  }\n};\n/** Get the length of a component */\n\n\nconst componentLength = c => typeof c === 'number' ? c : typeof c === 'string' ? unicount_1.strPosToUni(c) : typeof c.d === 'number' ? c.d : unicount_1.strPosToUni(c.d); // Does not support negative numbers.\n\n\nexports.uniSlice = (s, startUni, endUni) => {\n  const start = unicount_1.uniToStrPos(s, startUni);\n  const end = endUni == null ? Infinity : unicount_1.uniToStrPos(s, endUni);\n  return s.slice(start, end);\n};\n\nconst dslice = (d, start, end) => typeof d === 'number' ? end == null ? d - start : Math.min(d, end) - start : exports.uniSlice(d, start, end);\n/** Makes and returns utility functions take and peek.\n */\n\n\nconst makeTake = op => {\n  // TODO: Rewrite this by passing a context, like the rust code does. Its cleaner that way.\n  // The index of the next component to take\n  let idx = 0; // The offset into the component. For strings this is in UCS2 length, not\n  // unicode codepoints.\n\n  let offset = 0; // Take up to length n from the front of op. If n is -1, take the entire next\n  // op component. If indivisableField == 'd', delete components won't be separated.\n  // If indivisableField == 'i', insert components won't be separated.\n\n  const take = (n, indivisableField) => {\n    // We're at the end of the operation. The op has skips, forever. Infinity\n    // might make more sense than null here.\n    if (idx === op.length) return n === -1 ? null : n;\n    const c = op[idx];\n    let part;\n\n    if (typeof c === 'number') {\n      // Skip\n      if (n === -1 || c - offset <= n) {\n        part = c - offset;\n        ++idx;\n        offset = 0;\n        return part;\n      } else {\n        offset += n;\n        return n;\n      }\n    } else if (typeof c === 'string') {\n      // Insert\n      if (n === -1 || indivisableField === 'i' || unicount_1.strPosToUni(c.slice(offset)) <= n) {\n        part = c.slice(offset);\n        ++idx;\n        offset = 0;\n        return part;\n      } else {\n        const offset2 = offset + unicount_1.uniToStrPos(c.slice(offset), n);\n        part = c.slice(offset, offset2);\n        offset = offset2;\n        return part;\n      }\n    } else {\n      // Delete\n      //\n      // So this is a little weird - the insert case uses UCS2 length offsets\n      // directly instead of counting in codepoints. Thats more efficient, but\n      // more complicated. It only matters for non-invertable ops with huge\n      // deletes being composed / transformed by other very complicated ops.\n      // Probably not common enough to optimize for. Esp since this is a little\n      // bit of a mess anyway, and the tests should iron out any problems.\n      if (n === -1 || indivisableField === 'd' || exports.dlen(c.d) - offset <= n) {\n        // Emit the remainder of the delete.\n        part = {\n          d: dslice(c.d, offset)\n        }; // part = {d: dlen(c.d) - offset}\n\n        ++idx;\n        offset = 0;\n        return part;\n      } else {\n        // Slice into the delete content\n        let result = dslice(c.d, offset, offset + n);\n        offset += n;\n        return {\n          d: result\n        };\n      }\n    }\n  }; // Peek at the next op that will be returned.\n\n\n  const peek = () => op[idx];\n\n  return {\n    take,\n    peek\n  };\n};\n/** Trim any excess skips from the end of an operation.\n *\n * There should only be at most one, because the operation was made with append.\n */\n\n\nconst trim = op => {\n  if (op.length > 0 && typeof op[op.length - 1] === 'number') {\n    op.pop();\n  }\n\n  return op;\n};\n/** Transform op by otherOp.\n *\n * @param op - The operation to transform\n * @param otherOp - Operation to transform it by\n * @param side - Either 'left' or 'right'\n */\n\n\nfunction transform(op1, op2, side) {\n  if (side !== 'left' && side !== 'right') {\n    throw Error(\"side (\" + side + \") must be 'left' or 'right'\");\n  }\n\n  checkOp(op1);\n  checkOp(op2);\n  const newOp = [];\n  const append = makeAppend(newOp);\n  const {\n    take,\n    peek\n  } = makeTake(op1);\n\n  for (let i = 0; i < op2.length; i++) {\n    const c2 = op2[i];\n    let length, c1;\n\n    switch (typeof c2) {\n      case 'number':\n        // Skip\n        length = c2;\n\n        while (length > 0) {\n          c1 = take(length, 'i');\n          append(c1);\n\n          if (typeof c1 !== 'string') {\n            length -= componentLength(c1);\n          }\n        }\n\n        break;\n\n      case 'string':\n        // Insert\n        if (side === 'left') {\n          // The left insert should go first.\n          if (typeof peek() === 'string') {\n            append(take(-1));\n          }\n        } // Otherwise skip the inserted text.\n\n\n        append(unicount_1.strPosToUni(c2));\n        break;\n\n      case 'object':\n        // Delete\n        length = exports.dlen(c2.d);\n\n        while (length > 0) {\n          c1 = take(length, 'i');\n\n          switch (typeof c1) {\n            case 'number':\n              length -= c1;\n              break;\n\n            case 'string':\n              append(c1);\n              break;\n\n            case 'object':\n              // The delete is unnecessary now - the text has already been deleted.\n              length -= exports.dlen(c1.d);\n          }\n        }\n\n        break;\n    }\n  } // Append any extra data in op1.\n\n\n  let c;\n\n  while (c = take(-1)) append(c);\n\n  if (debugMode && isInvertible(op1) && isInvertible(op2) && !isInvertible(newOp)) {\n    throw Error('Internal error - composed operation should also be invertible');\n  }\n\n  return trim(newOp);\n}\n/** Compose op1 and op2 together and return the result */\n\n\nfunction compose(op1, op2) {\n  checkOp(op1);\n  checkOp(op2);\n  const result = [];\n  const append = makeAppend(result);\n  const {\n    take\n  } = makeTake(op1);\n\n  for (let i = 0; i < op2.length; i++) {\n    const component = op2[i];\n    let length, chunk;\n\n    switch (typeof component) {\n      case 'number':\n        // Skip\n        length = component;\n\n        while (length > 0) {\n          chunk = take(length, 'd');\n          append(chunk);\n\n          if (typeof chunk !== 'object') {\n            length -= componentLength(chunk);\n          }\n        }\n\n        break;\n\n      case 'string':\n        // Insert\n        append(component);\n        break;\n\n      case 'object':\n        // Delete\n        length = exports.dlen(component.d); // Length of the delete we're doing\n\n        let offset = 0; // Offset into our deleted content\n\n        while (offset < length) {\n          chunk = take(length - offset, 'd');\n\n          switch (typeof chunk) {\n            case 'number':\n              // We're deleting the skipped characters.\n              append({\n                d: dslice(component.d, offset, offset + chunk)\n              });\n              offset += chunk;\n              break;\n\n            case 'string':\n              offset += unicount_1.strPosToUni(chunk);\n              break;\n\n            case 'object':\n              append(chunk);\n          }\n        }\n\n        break;\n    }\n  }\n\n  let c;\n\n  while (c = take(-1)) append(c);\n\n  if (debugMode && isInvertible(op1) && isInvertible(op2) && !isInvertible(result)) {\n    throw Error('Internal error - composed operation should also be invertible');\n  }\n\n  return trim(result);\n} // This operates in unicode offsets to make it consistent with the equivalent\n// methods in other languages / systems.\n\n\nconst transformPosition = (cursor, op) => {\n  let pos = 0;\n\n  for (let i = 0; i < op.length && cursor > pos; i++) {\n    const c = op[i]; // I could actually use the op_iter stuff above - but I think its simpler\n    // like this.\n\n    switch (typeof c) {\n      case 'number':\n        {\n          // skip\n          pos += c;\n          break;\n        }\n\n      case 'string':\n        // insert\n        // Its safe to use c.length here because they're both utf16 offsets.\n        // Ignoring pos because the doc doesn't know about the insert yet.\n        const offset = unicount_1.strPosToUni(c);\n        pos += offset;\n        cursor += offset;\n        break;\n\n      case 'object':\n        // delete\n        cursor -= Math.min(exports.dlen(c.d), cursor - pos);\n        break;\n    }\n  }\n\n  return cursor;\n};\n\nconst transformSelection = (selection, op) => typeof selection === 'number' ? transformPosition(selection, op) : selection.map(s => transformPosition(s, op));\n\nfunction makeInvertible(op, doc, ropeImpl) {\n  return mapOp(op, (c, prePos) => typeof c === 'object' && typeof c.d === 'number' ? // Delete\n  {\n    d: ropeImpl.slice(doc, prePos, prePos + c.d)\n  } : c);\n}\n/** Attempt to invert the operation. Operations with {d:N} components cannot be inverted, and this method will throw. */\n\n\nfunction invert(op) {\n  return mapOp(op, c => {\n    switch (typeof c) {\n      case 'object':\n        // Delete\n        if (typeof c.d === 'number') {\n          throw Error('Cannot invert text op: Deleted characters missing from operation. makeInvertible must be called first.');\n        } else return c.d;\n\n      // delete -> insert\n\n      case 'string':\n        return {\n          d: c\n        };\n      // Insert -> delete\n\n      case 'number':\n        return c;\n      // skip -> skip\n    }\n  });\n}\n/** Strip extraneous invertibility information from the operation */\n\n\nfunction stripInvertible(op) {\n  return mapOp(op, c => typeof c === 'object' && typeof c.d === 'string' ? {\n    d: unicount_1.strPosToUni(c.d)\n  } : c);\n}\n/** Helper method. returns true if the operation can be successfully inverted. */\n\n\nfunction isInvertible(op) {\n  let invertible = true;\n  eachOp(op, c => {\n    if (typeof c === 'object' && typeof c.d === 'number') invertible = false;\n  });\n  return invertible;\n}\n\nfunction makeType(ropeImpl) {\n  return {\n    name: 'text-unicode',\n    uri: 'http://sharejs.org/types/text-unicode',\n    trim,\n    normalize,\n    checkOp,\n\n    /** Create a new text snapshot.\n     *\n     * @param {string} initial - initial snapshot data. Optional. Defaults to ''.\n     * @returns {Snap} Initial document snapshot object\n     */\n    create(initial = '') {\n      if (typeof initial !== 'string') {\n        throw Error('Initial data must be a string');\n      }\n\n      return ropeImpl.create(initial);\n    },\n\n    /** Apply an operation to a document snapshot\n     */\n    apply(str, op) {\n      checkOp(op);\n      const builder = ropeImpl.builder(str);\n\n      for (let i = 0; i < op.length; i++) {\n        const component = op[i];\n\n        switch (typeof component) {\n          case 'number':\n            builder.skip(component);\n            break;\n\n          case 'string':\n            builder.append(component);\n            break;\n\n          case 'object':\n            builder.del(exports.dlen(component.d));\n            break;\n        }\n      }\n\n      return builder.build();\n    },\n\n    transform,\n    compose,\n    transformPosition,\n    transformSelection,\n    isInvertible,\n\n    makeInvertible(op, doc) {\n      return makeInvertible(op, doc, ropeImpl);\n    },\n\n    stripInvertible,\n    invert,\n\n    invertWithDoc(op, doc) {\n      return invert(makeInvertible(op, doc, ropeImpl));\n    },\n\n    isNoop: op => op.length === 0\n  };\n}\n\nexports.default = makeType;\n\n//# sourceURL=webpack:///./node_modules/ot-text-unicode/dist/type.js?");

/***/ }),

/***/ "./node_modules/unicount/index.js":
/*!****************************************!*\
  !*** ./node_modules/unicount/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.uniToStrPos = exports.strPosToUni = void 0;\n\nexports.strPosToUni = (s, strOffset = s.length) => {\n  let pairs = 0;\n  let i = 0;\n\n  for (; i < strOffset; i++) {\n    const code = s.charCodeAt(i);\n\n    if (code >= 0xd800 && code <= 0xdfff) {\n      pairs++;\n      i++; // Skip the second part of the pair.\n    }\n  }\n\n  if (i !== strOffset) throw Error('Invalid offset - splits unicode bytes');\n  return i - pairs;\n};\n\nexports.uniToStrPos = (s, uniOffset) => {\n  let pos = 0;\n\n  for (; uniOffset > 0; uniOffset--) {\n    const code = s.charCodeAt(pos);\n    pos += code >= 0xd800 && code <= 0xdfff ? 2 : 1;\n  }\n\n  return pos;\n};\n\n//# sourceURL=webpack:///./node_modules/unicount/index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var ot_text_unicode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ot-text-unicode */ \"./node_modules/ot-text-unicode/dist/index.js\");\n/* harmony import */ var ot_text_unicode__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ot_text_unicode__WEBPACK_IMPORTED_MODULE_0__);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ot_text_unicode__WEBPACK_IMPORTED_MODULE_0__[\"type\"]);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });